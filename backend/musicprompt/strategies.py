import os
import requests as req
import uuid
from abc import ABC, abstractmethod
from typing import Dict, Any

class SongGeneratorStrategy(ABC):
    @abstractmethod
    def generate(self, data: Dict[str, Any]):
        """
        Generate a song based on the provided data.
        Returns the initial response from the service.
        """
        pass

    @abstractmethod
    def check_status(self, task_id: str):
        """
        Check the status of a generation task.
        Returns the current task status.
        """
        pass

class MockSongGeneratorStrategy(SongGeneratorStrategy):
    def generate(self, data: Dict[str, Any]):
        print(f"[MOCK] Generating song with data: {data}")
        # Return a fake taskId indicating success
        task_id = str(uuid.uuid4())
        return {
            "taskId": task_id,
            "status": "PENDING",
            "message": "Mock generation started."
        }

    def check_status(self, task_id: str):
        print(f"[MOCK] Checking status for task: {task_id}")
        return {
            "taskId": task_id,
            "status": "SUCCESS",
            "audio_url": "http://localhost:8000/media/mock_music/sample.mp3",
            "message": "Mock generation completed."
        }

class SunoSongGeneratorStrategy(SongGeneratorStrategy):
    def __init__(self):
        from django.conf import settings

        self.api_key = getattr(settings, "SUNO_API_KEY", os.getenv("SUNO_API_KEY"))
        self.base_url = "https://api.sunoapi.org/api/v1"
        self.callback_url = getattr(
            settings,
            "SUNO_CALLBACK_URL",
            os.getenv("SUNO_CALLBACK_URL", "https://example.com/callback")
        )

    def _build_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        }

    def _extract_task_id(self, result: Dict[str, Any]) -> str | None:
        if not isinstance(result, dict):
            return None

        data = result.get("data")

        if isinstance(data, str) and data.strip():
            return data

        if isinstance(data, dict):
            return data.get("taskId") or data.get("task_id") or data.get("id")

        if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
            return data[0].get("taskId") or data[0].get("task_id") or data[0].get("id")

        return result.get("taskId") or result.get("task_id") or result.get("id")

    def generate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "error": "SUNO_API_KEY is missing.",
                "message": "API key is not configured."
            }

        prompt_text = (
            f"Generate a {data.get('genre')} song for a {data.get('occasion')} occasion "
            f"with the title '{data.get('title')}'"
        )

        payload = {
            "customMode": False,
            "instrumental": False,
            "model": "V5_5",
            "prompt": prompt_text,
            "style": data.get("genre"),
            "title": data.get("title"),
            "callBackUrl": self.callback_url,
        }

        try:
            response = req.post(
                f"{self.base_url}/generate",
                headers=self._build_headers(),
                json=payload,
                timeout=30,
            )

            result = response.json()

            if response.status_code >= 400:
                return {
                    "error": f"Suno API returned HTTP {response.status_code}",
                    "message": result.get("msg", "Failed to call Suno API"),
                    "raw": result,
                }

            api_code = result.get("code")
            if api_code and api_code != 200:
                return {
                    "error": f"Suno API returned code {api_code}",
                    "message": result.get("msg", "Failed to call Suno API"),
                    "raw": result,
                }

            task_id = self._extract_task_id(result)
            if not task_id:
                return {
                    "error": "No taskId returned by Suno API.",
                    "message": result.get("msg", "Generation started but taskId was not found."),
                    "raw": result,
                }

            return {
                "taskId": task_id,
                "status": "PENDING",
                "message": result.get("msg", "Generation started."),
                "raw": result,
            }

        except req.RequestException as e:
            return {
                "error": str(e),
                "message": "Failed to call Suno API"
            }
        except ValueError:
            return {
                "error": "Invalid JSON response from Suno API.",
                "message": "Failed to parse Suno response."
            }

    def check_status(self, task_id: str) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "error": "SUNO_API_KEY is missing.",
                "message": "API key is not configured."
            }

        try:
            response = req.get(
                f"{self.base_url}/generate/record-info",
                headers=self._build_headers(),
                params={"taskId": task_id},
                timeout=30,
            )

            result = response.json()

            if response.status_code >= 400:
                return {
                    "error": f"Suno API returned HTTP {response.status_code}",
                    "message": result.get("msg", "Failed to get status from Suno API"),
                    "raw": result,
                }

            data = result.get("data")

            if isinstance(data, dict):
                suno_status = data.get("status", "PENDING")

                if suno_status == "SUCCESS":
                    suno_data_list = data.get("response", {}).get("sunoData", [])
                    audio_url = None

                    if suno_data_list and isinstance(suno_data_list[0], dict):
                        track_info = suno_data_list[0]
                        audio_url = track_info.get("audioUrl") or track_info.get("sourceAudioUrl")

                    return {
                        "taskId": task_id,
                        "status": "SUCCESS",
                        "audio_url": audio_url,
                        "message": "Song generation completed.",
                        "raw": result,
                    }

                if suno_status in ["FAILED", "CREATE_TASK_FAILED", "GENERATE_AUDIO_FAILED"]:
                    return {
                        "taskId": task_id,
                        "status": "FAILED",
                        "message": "Song generation failed.",
                        "raw": result,
                    }

                return {
                    "taskId": task_id,
                    "status": "PENDING",
                    "message": "Song generation is still processing.",
                    "raw": result,
                }

            return {
                "taskId": task_id,
                "status": "PENDING",
                "message": "Unexpected status format from Suno API.",
                "raw": result,
            }

        except req.RequestException as e:
            return {
                "error": str(e),
                "message": "Failed to get status from Suno API"
            }
        except ValueError:
            return {
                "error": "Invalid JSON response from Suno API.",
                "message": "Failed to parse Suno status response."
            }



def get_generator_strategy():
    """
    Factory function to get the appropriate strategy based on the GENERATOR_STRATEGY setting.
    It defaults to 'mock' if not set.
    """
    from django.conf import settings
    strategy = getattr(settings, 'GENERATOR_STRATEGY', os.getenv('GENERATOR_STRATEGY', 'mock')).lower()
    
    if strategy == 'suno':
        return SunoSongGeneratorStrategy()
    return MockSongGeneratorStrategy()

class MusicGeneratorContext:
    """
    The Context class for the Strategy Pattern. It maintains a reference to a
    Strategy object and delegates the execution to it.
    """
    def __init__(self, strategy: SongGeneratorStrategy = None):
        if strategy is None:
            self.strategy = get_generator_strategy()
        else:
            self.strategy = strategy

    def set_strategy(self, strategy: SongGeneratorStrategy):
        self.strategy = strategy

    def execute_generation(self, data: Dict[str, Any]):
        return self.strategy.generate(data)

    def execute_status_check(self, task_id: str):
        return self.strategy.check_status(task_id)
