## Project Setup Instructions

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Sorasit-Kateratorn/final-software-design.git
cd final-software-design
cd backend
```

---

### 2. Create Virtual Environment

```bash
python -m venv .venv
```

Activate the environment:

**Windows**

```bash
.venv\Scripts\activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Apply Database Migrations

```bash
python manage.py migrate
```

This will create the database schema based on Django models.

---

### 5. Create Superuser for Django Admin

```bash
python manage.py createsuperuser
```

---

### 6. Run the Development Server

```bash
python manage.py runserver
```

Then open the browser and go to:

```
http://127.0.0.1:8000/
```

If the server runs successfully, the Django project is working.

---


### Evidence of CRUD Functionality + Domain modeling


[Link here](https://docs.google.com/document/d/1MPPSM0sSq1NjJ2zlB2z-vb9CKjb0V_ytjwQRhGoYWus/edit?usp=sharing)


---


| Method | Endpoint     | Description           |
| ------ | ------------ | --------------------- |
| GET    | `/user/`     | Retrieve all users    |
| POST   | `/user/`     | Create a new user     |
| GET    | `/user/{id}` | Retrieve a user by ID |
| PUT    | `/user/{id}` | Update entire user    |
| PATCH  | `/user/{id}` | Partially update user |
| DELETE | `/user/{id}` | Delete user           |



| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| GET    | `/library/`     | Retrieve all libraries   |
| POST   | `/library/`     | Create a new library     |
| GET    | `/library/{id}` | Retrieve a library by ID |
| PUT    | `/library/{id}` | Update entire library    |
| PATCH  | `/library/{id}` | Partially update library |
| DELETE | `/library/{id}` | Delete library           |



| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| GET    | `/music/`     | Retrieve all music     |
| POST   | `/music/`     | Create new music       |
| GET    | `/music/{id}` | Retrieve music by ID   |
| PUT    | `/music/{id}` | Update entire music    |
| PATCH  | `/music/{id}` | Partially update music |
| DELETE | `/music/{id}` | Delete music           |


| Method | Endpoint                             | Description                   |
| ------ | ------------------------------------ | ----------------------------- |
| GET    | `/musicprompt/`                      | Retrieve all music prompts    |
| GET    | `/musicprompt/status/{taskId}`       | Check generation status (Strategy Pattern)   |
| POST   | `/musicprompt/`                      | Create new music prompt       |
| GET    | `/musicprompt/{id}`                  | Retrieve music prompt by ID   |
| PUT    | `/musicprompt/{id}`                  | Update entire music prompt    |
| PATCH  | `/musicprompt/{id}`                  | Partially update music prompt |
| DELETE | `/musicprompt/{id}`                  | Delete music prompt           |

---

### Strategy Pattern for Song Generation

This project implements the Strategy pattern to support different methods for generating songs. The selection between strategies is controlled using the `GENERATOR_STRATEGY` environment variable, allowing the generation behavior to be switched without modifying the application code.

#### Configuration (.env file)
Create a `.env` file in the `backend/` directory (you can copy `.env.example`).
```env
# Choose your strategy: "mock" or "suno"
GENERATOR_STRATEGY=mock

# If using suno, add your API key here (DO NOT COMMIT THIS FILE)
SUNO_API_KEY=your_actual_suno_api_key

# Required for Suno API (a placeholder is sufficient for development)
SUNO_CALLBACK_URL=https://example.com/callback

```

#### How to run Mock mode
1. Set `GENERATOR_STRATEGY=mock` in your `backend/.env`.
2. Start the server.
3. Make a POST request to `/musicprompt/` with your prompt data. The mock strategy will execute without calling the external API, returning a fake `taskId`.
4. Check the status using `GET /musicprompt/status/<taskId>`. It will instantly return a mock SUCCESS payload.

#### How to run Suno mode
1. Set `GENERATOR_STRATEGY=suno` in your `backend/.env`.
2. Ensure you have added your valid API key to `SUNO_API_KEY`.
3. Start the server.
4. Make a POST request to `/musicprompt/` with your prompt data. The Suno strategy will call `https://api.sunoapi.org/api/v1/generate` and return a real `taskId`.
5. Check the status using `GET /musicprompt/status/<taskId>`. It will call `https://api.sunoapi.org/api/v1/generate/record-info` to get real-time status.


