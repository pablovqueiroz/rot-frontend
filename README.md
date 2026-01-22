# Frontend — Right On Time (ROT)

The frontend is a Single Page Application (SPA) built with React.
Routing is handled on the client side using React Router.
Each frontend route maps to one or more backend API endpoints.

---

## Frontend Routes (Client Side)

### Public Routes

| Route        | Page          | Backend Mapping |
|-------------|---------------|-----------------|
| `/`         | ProvidersList | GET /api/providers |
| `/login`    | Login         | POST /api/auth/login |
| `/register` | Register      | POST /api/auth/signup/user<br>POST /api/auth/signup/provider |

---

### Client (User) Routes

| Route               | Page            | Backend Mapping |
|--------------------|-----------------|-----------------|
| `/providers/:id`   | ProviderDetails | GET /api/providers/:id |
| `/booking/:id`     | Booking         | POST /api/appointments |
| `/my-appointments` | MyAppointments  | GET /api/users/me/appointments |

---

### Provider Routes (Protected)

| Route                     | Page         | Backend Mapping |
|--------------------------|--------------|-----------------|
| `/provider/dashboard`    | Dashboard    | GET /api/providers/me |
| `/provider/services`     | Services     | POST /api/providers/services |
| `/provider/appointments` | Appointments | GET /api/appointments |
| `/provider/availability` | Availability | (future extension) |

---

## Image Flow (Frontend ↔ Backend)

Image handling is performed in two steps:

1. Upload image  
POST /api/upload/image

2. Associate image  
PUT /api/users/image  
PUT /api/providers/image  

The frontend never sends files directly to signup routes.
Signup and update routes only receive JSON objects in the format:

{
  "url": "https://res.cloudinary.com/...",
  "public_id": "temp/abc123"
}

---

## Frontend Architecture

The frontend follows a page-based and component-based architecture.

- Pages represent full views and routes
- Components are reusable UI elements
- Each page/component owns its CSS file
- Global styles and variables are centralized

---

## Frontend Directory Structure

frontend/
└── src/
    ├── pages/
    │   ├── auth/
    │   │   ├── Login/
    │   │   └── Register/
    │   ├── client/
    │   │   ├── ProvidersList/
    │   │   ├── ProviderDetails/
    │   │   ├── Booking/
    │   │   └── MyAppointments/
    │   ├── provider/
    │   │   ├── Dashboard/
    │   │   ├── Calendar/
    │   │   ├── Services/
    │   │   ├── Appointments/
    │   │   └── Availability/
    │   └── NotFound/
    ├── components/
    │   ├── Navbar/
    │   ├── Card/
    │   └── Modal/
    ├── styles/
    │   ├── variables.css
    │   ├── reset.css
    │   └── global.css
    ├── App.jsx
    └── main.jsx

---

## Key Rules

- Frontend routes are not the same as backend routes
- Frontend routes map user flows
- Backend routes expose resources
- Image upload is always a separate request
- Signup routes never receive files
- Images are always sent as objects (url + public_id)


## Academic Disclaimer

This project was developed exclusively for **academic and educational purposes**.

It is not intended for commercial use, production deployment, or real-world service operation.  
All data, users, providers, and appointments used in this project are **fictional** and created solely for learning and demonstration purposes.

Any resemblance to real persons, businesses, or systems is purely coincidental.
