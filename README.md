# Angular ToDo App

A task management ToDo application built with **Angular**, featuring **user authentication**, **CRUD operations** for tasks, and a **RESTful API backend** deployed on **Railway**.

---

## 🚀 Live Demo

- **Frontend (Netlify):** [https://your-netlify-link.netlify.app](https://your-netlify-link.netlify.app)
- **Backend (JSON Server on Railway):** [https://todo-app-server-production.up.railway.app](https://todo-app-server-production.up.railway.app)

---

## 🛠️ Tech Stack

- **Frontend:** Angular, Angular Material, Bootstrap, SweetAlert2
- **Backend:** JSON Server (deployed on Railway)
- **State/Storage:** LocalStorage (for user session), Angular HttpClient
- **Deployment:** Netlify (Frontend), Railway (Backend)

---

## 📦 Features

- ✅ User authentication (registration & login)
- ✅ Token-based authentication system (localStorage)
- ✅ Task management (create, read, update, delete)
- ✅ Dashboard overview of tasks
- ✅ Detailed task view
- ✅ Route protection with Auth Guards
- ✅ Contact Us and About Us pages
- ✅ Responsive layout with Bootstrap & Angular Material
- ✅ SweetAlert2 confirmation modals

---

## 👨‍💻 Team Contributions

### 🔹 Reham Saeed
- Set up routing with lazy loading
- Applied auth guard to protect routes
- Built footer and navbar components

### 🔹 Mohamed Mahmoud
- Built and updated Angular components (UI + logic)
- Created the ToDo service for creating/updating tasks
- Integrated the service with components

### 🔹 Ahmed Emad
- Developed the task view component with SweetAlert for deletion
- Handled task read/delete operations via service
- Set up routing for CRUD features
- Created Contact Us and About Us pages

### 🔹 Tarek Goda
- Built Login and Register pages with form validation
- Connected forms to JSON Server (`/users`)
- Managed localStorage for storing user info post-login

### 🔹 Jawad Tamer
- Designed the Dashboard page (tasks summary, welcome message , widgets)
- Created task service integration for dashboard display
- Built manage account dialog
- Managed GitHub repo (branches, PRs, merging)
- Deployed backend (Railway) and frontend (Netlify)

---

## 📁 Project Structure

src/
 ┣ app/
  ┃ ┣ component/
    ┃ ┃ ┣ aboutus/
    ┃ ┃ ┣ auth/
    ┃ ┃ ┣ confirm-dialog/
    ┃ ┃ ┣ contactus/
    ┃ ┃ ┣ create-task/
    ┃ ┃ ┣ dashboard/
    ┃ ┃ ┣ footer/
    ┃ ┃ ┣ navbar/
    ┃ ┃ ┣ task-view/
    ┃ ┃ ┣ update-task/
 ┃ ┣ shared/
    ┃ ┃ ┣ guard/
    ┃ ┃ ┣ Model/
    ┃ ┃ ┣ services/

---

## 📡 Repositories

- **Frontend GitHub Repo:** [https://github.com/jawadTamer/ToDo-App](https://github.com/jawadTamer/ToDo-App)
- **Backend GitHub Repo:** [https://github.com/jawadTamer/ToDO-App-server](https://github.com/jawadTamer/ToDO-App-server)

---

## 🧪 How to Run Locally

### 👉 Clone the frontend repo:
```bash
git clone https://github.com/jawadTamer/ToDo-App
cd ToDo-App
npm install
ng serve
````
👉 Clone and run the backend (JSON Server):
````
git clone https://github.com/jawadTamer/ToDO-App-server
cd ToDO-App-server
npm install -g json-server
json-server --watch db.json --port 3000
````
## 🌐 Deployment

Frontend: Hosted on Netlify

Backend: JSON Server hosted on Railway

## 📞 Contact
For any inquiries or support, feel free to open an issue on GitHub or reach out to any of the team members.
