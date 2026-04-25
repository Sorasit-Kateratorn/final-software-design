# Strategy Pattern: Song Generation

## Overview

This project implements the **Strategy Design Pattern** to support multiple interchangeable song generation methods without modifying the main application logic.

The goal is to **separate the generation behavior** (Mock vs Suno API) from the rest of the system, allowing easy switching between implementations.


> Note:
> After authentication (Google OAuth / JWT) was added, the `/musicprompt/` endpoint now requires a valid token.
> This does not affect the Strategy Pattern design itself.
> All strategy behaviors (Mock and Suno) remain unchanged.




---

## Why Strategy Pattern?

Without Strategy Pattern:

```text
if mode == "mock":
    generate_mock()
else:
    call_suno_api()
```

This leads to:

* Scattered conditional logic
* Difficult to maintain
* Hard to extend

With Strategy Pattern:

```text
generator.generate(data)
```

* Clean and modular design
* Easy to extend (add new strategies)
* No changes required in controller logic

---

## Architecture

```text
                +---------------------------+
                | SongGeneratorStrategy     |
                | (Interface / Abstract)    |
                +---------------------------+
                         ▲
            ┌────────────┴────────────┐
            │                         │
+--------------------------+   +--------------------------+
| MockSongGeneratorStrategy|   | SunoSongGeneratorStrategy|
+--------------------------+   +--------------------------+

                ↓
      +---------------------------+
      | MusicGeneratorContext     |
      +---------------------------+

                ↓
           Django Views
```

---

## Strategy Interface

Defined in:

```text
backend/musicprompt/strategies.py
```

```python
class SongGeneratorStrategy(ABC):
    @abstractmethod
    def generate(self, data):
        pass

    @abstractmethod
    def check_status(self, task_id):
        pass
```

All strategies must implement:

* `generate()` → start generation
* `check_status()` → check progress/result

---

## Strategy A: Mock Generator

### Purpose

Used for development and testing without external API.

### Behavior

* Does NOT call any API
* Returns deterministic result
* Provides a real playable `.mp3` file

### Example Response

```json
{
  "taskId": "mock-id",
  "status": "SUCCESS",
  "audio_url": "http://localhost:8000/media/mock_music/sample.mp3"
}
```

### Advantages

```text
No internet required
Fast response
Stable testing environment
```

---

## Strategy B: Suno API Generator

### Purpose

Uses real AI music generation via Suno API.

### API Flow

1. Generate request:

```http
POST https://api.sunoapi.org/api/v1/generate
Authorization: Bearer <API_KEY>
```

2. Receive:

```json
{
  "taskId": "abc123"
}
```

3. Check status:

```http
GET https://api.sunoapi.org/api/v1/generate/record-info?taskId=abc123
```

4. Final result:

```json
{
  "status": "SUCCESS",
  "audio_url": "https://..."
}
```

---

## Polling vs Callback

This project uses **polling**:

```text
Frontend → Backend → Suno API → Response
```

Instead of callback:

```text
Suno → Backend webhook (requires ngrok)
```

### Why Polling?

```text
Works locally
No ngrok setup required
Easier for TA to test
```

---

## Strategy Context

The Context class controls which strategy is used.

```python
class MusicGeneratorContext:

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
```

---

## Strategy Selection

Controlled via `.env`:

```env
GENERATOR_STRATEGY=mock
# or
GENERATOR_STRATEGY=suno
```

Factory function:

```python
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
```

---

