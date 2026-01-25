# ROT - Right On Time Frontend

## Project Description

**ROT - Right On Time** is a frontend web application built as a Single Page Application (SPA) using React. The project aims to facilitate appointment scheduling and services with providers, allowing end users to book slots and providers to manage their schedules and services.

The application includes features for user and provider authentication, provider listings, provider details, appointment booking, calendar views, profile management, and more.

This project was developed exclusively for academic and educational purposes and is not intended for commercial use or production.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool for frontend development.
- **React Router DOM**: For client-side routing.
- **Axios**: For HTTP requests to the backend API.
- **React Big Calendar**: For calendar display and interaction.
- **Date-fns**: For date manipulation.
- **React Icons**: For icons in the interface.
- **UUID**: For generating unique identifiers.
- **ESLint**: For linting and clean code maintenance.

## Folder Structure

```
rot-right-on-time-frontend/
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── images/
├── public/
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── assets/
    ├── components/
    │   ├── AppointmentCard/
    │   ├── Dashboard/
    │   ├── Footer/
    │   ├── Navbar/
    │   ├── Profile/
    │   ├── ProviderCard/
    │   └── SearchHeader/
    ├── config/
    ├── context/
    ├── hooks/
    ├── pages/
    │   ├── AboutPage/
    │   ├── Appointments/
    │   ├── auth/
    │   │   ├── Login/
    │   │   └── Register/
    │   ├── client/
    │   │   ├── Booking/
    │   │   ├── Calendar/
    │   │   ├── MyAppointments/
    │   │   ├── ProviderDetails/
    │   │   └── ProvidersList/
    │   ├── HomePage/
    │   ├── NotFound/
    │   ├── Profile/
    │   └── provider/
    │       └── Calendar/
    ├── Services/
    └── styles/
```

## Application Routes

### Public Routes

- `/` - HomePage: Home page
- `/login` - Login: Login page
- `/register` - Register: Registration page
- `/about` - AboutPage: About page
- `/providers/:id` - ProviderDetails: Provider details

### Client (User) Routes

- `/booking` - Booking: Appointment booking
- `/calendar` - Calendar: User calendar
- `/my-appointments` - Appointments: My appointments
- `/user/profile` - UserProfilePage: User profile

### Provider Routes (Protected)

- `/provider/profile` - ProviderProfilePage: Provider profile
- `/provider/calendar` - ProviderCalendar: Provider calendar

### Other Routes

- `*` - NotFound: Page not found

## Frontend Architecture

The application follows a page-based and component-based architecture:

- **Pages**: Represent full views and specific routes.
- **Components**: Reusable UI elements.
- Each page/component has its own CSS file.
- Global styles and variables are centralized in `src/styles/`.

Authentication context is managed by `AuthContext`, wrapping the app to provide global auth state.

## Key Features

- **Authentication**: Login and registration for users and providers.
- **Provider Listings**: View available providers.
- **Provider Details**: Detailed information about a specific provider.
- **Booking**: Schedule appointments with providers.
- **Calendars**: View events and availability.
- **Profile Management**: Edit profiles for users and providers.
- **Service Management**: For providers, manage offered services.

## Backend Integration

The application communicates with a backend API for operations like authentication, provider search, bookings, etc. Frontend routes map to backend API endpoints.

### Image Flow

Image uploads are done in two steps:

1. Upload image: `POST /api/upload/image`
2. Associate image: `PUT /api/users/image` or `PUT /api/providers/image`

Images are sent as JSON objects containing `url` and `public_id`.

## Important Rules

- Frontend routes are not identical to backend routes; they map user flows.
- Image uploads are always a separate request.
- Signup routes never receive files directly.

## Academic Disclaimer

This project was developed exclusively for **academic and educational purposes**.

It is not intended for commercial use, production deployment, or real-world service operation. All data, users, providers, and appointments used in this project are **fictional** and created solely for learning and demonstration purposes.

Any resemblance to real persons, businesses, or systems is purely coincidental.
