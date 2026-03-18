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

### 5. Run the Development Server

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

