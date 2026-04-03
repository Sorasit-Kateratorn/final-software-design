## Project Setup Instructions

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Sorasit-Kateratorn/final-software-design.git
cd final-software-design
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


| Method | Endpoint            | Description                   |
| ------ | ------------------- | ----------------------------- |
| GET    | `/musicprompt/`     | Retrieve all music prompts    |
| POST   | `/musicprompt/`     | Create new music prompt       |
| GET    | `/musicprompt/{id}` | Retrieve music prompt by ID   |
| PUT    | `/musicprompt/{id}` | Update entire music prompt    |
| PATCH  | `/musicprompt/{id}` | Partially update music prompt |
| DELETE | `/musicprompt/{id}` | Delete music prompt           |


