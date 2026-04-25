## Project Setup Instructions
Before running the project, please complete the setup steps below.
#### Configuration (.env file)
Create a `.env` file in the `backend/` directory (you can copy `.env.example`).

Create a `.env` file in the `frontend/` directory (you can copy `.env.example`).

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

### 7. Run the frontend

```bash
cd frontend
npm install
npm run dev
```
Then open the browser and go to:

```
http://localhost:5173/
```

---


### Evidence of CRUD Functionality + Domain modeling (exercise 3)


[Link here](https://docs.google.com/document/d/1MPPSM0sSq1NjJ2zlB2z-vb9CKjb0V_ytjwQRhGoYWus/edit?usp=sharing)


---


| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| POST   | `/auth/login/`   | Local Login (Returns JWT Tokens)       |
| POST   | `/auth/google/`  | Google OAuth Login (Returns JWT Tokens)|
| GET    | `/user/`         | Retrieve all users                     |
| POST   | `/user/`         | Create a new user (Local Signup)       |
| GET    | `/user/{id}`     | Retrieve a user by ID                  |
| PUT    | `/user/{id}`     | Update entire user                     |
| PATCH  | `/user/{id}`     | Partially update user                  |
| DELETE | `/user/{id}`     | Delete user                            |

*Note: Local authentication strictly uses `username` and `password`. Google OAuth automatically creates a user via email and sets an unusable password for security.*



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


### For full Strategy Pattern explanation:
[STRATEGY_PATTERN.md](STRATEGY_PATTERN.md)

---
### Google OAuth Setup
To enable Google Login, you need to configure both the backend and frontend.

1. **Get your Client ID:**
   - Please follow the detailed visual guide in [Google_OAuth.md](./Google_OAuth.md) to set up your Google Cloud Project.

2. **Environment Configuration:**
   - **Important:** Don't forget to create your `.env` files based on the provided `.env.example` templates

3. **Backend Dependencies:**
   - Run `pip install -r requirements.txt` to ensure the backend authentication packages are installed.

---




## Testing & Grading



1. **Strategy Pattern Implementation**: 
   - Please review `backend/musicprompt/strategies.py`. 
   - Here you will find the formal `MusicGeneratorContext` class along with the `SongGeneratorStrategy` interface and its concrete strategies (`MockSongGeneratorStrategy`, `SunoSongGeneratorStrategy`).
2. **Mock Generation Demo**: 
   - By default, `.env` is set to `GENERATOR_STRATEGY=mock`. 
   - The frontend will trigger the mock generation and receive a real, playable `.mp3` file, proving the flow works end-to-end without needing an external API key.
3. **Frontend Integration**:
   - The application provides a complete UI to input a prompt, poll for generation status, and play/download the resulting music.

---


## Evidence for exercise4 + Demo

[Link here](https://docs.google.com/document/d/1dlFLKA79bE8DtYs4g0FyBlAcE5cbChnmMETeC-Q2IcA/edit?usp=sharing)


## UML Diagrams

### Class Diagram
![Class Diagram](/image/class_diagram.png)

### Sequence Diagram (Song Generation Flow)
![Sequence Diagram](/image/sequence_diagram.png)

## Domain modeling
![Domain modeling](/image/domain_modeling.png)