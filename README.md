## 🧩 Project Ecosystem

- ⚙️ **Backend** → https://github.com/pablovqueiroz/rot-backend
- 🌐 **Frontend** → https://github.com/pablovqueiroz/rot-frontend

<h1 align="center">ROT — RIGHT ON TIME  </h1>
<p align="center">
  <img src="src/assets/images/logo-rot.png" width="200" alt="Project Logo">
</p>
 
<p align="center">
    Appointment Scheduling Platform — Frontend Web App
</p>

<p align="center" style="font-size: 20px;">
  🌍 <a href="https://right-on-time.netlify.app/">Live Demo</a>
</p>

## Project Description

**ROT - Right On Time** is a modern appointment scheduling web application built as a Single Page Application (SPA) using React and Vite. The platform connects clients with service providers, enabling seamless appointment booking, management, and tracking.

### Key Features

- **User Authentication**: Secure login and registration for clients and providers
- **Provider Discovery**: Browse and search for service providers with filters
- **Appointment Booking**: Schedule appointments with real-time availability checking
- **Calendar Management**: Interactive calendar views for both clients and providers
- **Service Management**: Providers can create and manage their services
- **Profile Management**: User and provider profile customization with avatar uploads
- **Appointment Tracking**: View and manage scheduled appointments
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: User preference persistence

This project was developed as an academic capstone project for Ironhack's bootcamp and serves educational purposes.

## Technologies Used

- **React** (v19.2.0): JavaScript library for building user interfaces
- **Vite** (v7.2.4): Next-generation frontend build tool with HMR
- **React Router DOM** (v7.12.0): Client-side routing and navigation
- **Axios** (v1.13.2): HTTP client for API communication
- **Date-fns** (v4.1.0): Modern date utility library
- **React Icons** (v5.5.0): Icon library integration
- **React Spinners** (v0.17.0): Loading spinner components
- **UUID** (v13.0.0): Unique identifier generation
- **ESLint** (v9.39.1): Code quality and linting

## Folder Structure

```
rot-right-on-time-frontend/
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── README.md                 # Project documentation
├── vite.config.js            # Vite build configuration
├── images/                   # Static images
├── public/                   # Public assets
└── src/
    ├── App.jsx               # Main application component with routes
    ├── main.jsx              # React entry point
    ├── assets/               # Static assets and resources
    ├── components/           # Reusable UI components
    │   ├── AppointmentCard/  # Appointment display component
    │   ├── Dashboard/        # Hero section and dashboard components
    │   ├── Footer/           # Application footer
    │   ├── Message/          # Message/Alert component
    │   ├── Navbar/           # Navigation header
    │   ├── Profile/          # Profile-related components
    │   │   ├── AvatarUploader.jsx
    │   │   ├── DangerZone.jsx
    │   │   ├── ProfileForm.jsx
    │   │   └── ProfileHeader.jsx
    │   ├── Provider/         # Provider-related components
    │   │   ├── AvailabilitySection.jsx
    │   │   ├── ProviderCard.jsx
    │   │   └── ServicesManager.jsx
    │   ├── SearchHeader/     # Search functionality component
    │   └── spinner/          # Loading spinner component
    ├── config/               # Configuration files
    │   └── config.js         # API and environment configuration
    ├── context/              # React Context for state management
    │   ├── AuthContext.jsx   # Authentication context and logic
    │   └── ThemeContext.jsx  # Dark/Light theme context
    ├── hooks/                # Custom React hooks
    │   └── useCalendarEvents.js
    ├── pages/                # Page components (full views)
    │   ├── AboutPage/        # About page
    │   ├── Appointments/     # My appointments page
    │   ├── auth/             # Authentication pages
    │   │   ├── Login/
    │   │   └── Register/
    │   ├── client/           # Client-specific pages
    │   │   ├── Booking/      # Appointment booking page
    │   │   └── Calendar/     # Client calendar view
    │   ├── HomePage/         # Landing page with provider listing
    │   ├── NotFound/         # 404 page
    │   ├── Profile/          # User and provider profiles
    │   │   ├── UserProfilePage.jsx
    │   │   └── ProviderProfilePage.jsx
    │   └── provider/         # Provider-specific pages
    │       ├── Calendar/     # Provider calendar management
    │       ├── MyServices/   # Service management page
    │       ├── ProviderDetails/
    │       └── ProvidersList/
    ├── Services/             # API service modules
    │   └── appointmentService.js
    └── styles/               # Global styles
        ├── global.css        # Global styles
        ├── reset.css         # CSS reset
        └── variables.css     # CSS variables and theming
```

## Application Routes

### Public Routes

| Route            | Component       | Description                                   |
| ---------------- | --------------- | --------------------------------------------- |
| `/`              | HomePage        | Landing page with provider listing and search |
| `/login`         | Login           | User/provider login page                      |
| `/register`      | Register        | New user/provider registration                |
| `/about`         | AboutPage       | Information about the platform                |
| `/providers/:id` | ProviderDetails | Detailed provider information and services    |

### Client (User) Routes

| Route              | Component       | Description                            | Access        |
| ------------------ | --------------- | -------------------------------------- | ------------- |
| `/user/profile`    | UserProfilePage | Client profile management              | Authenticated |
| `/booking`         | Booking         | Appointment booking flow               | Authenticated |
| `/calendar`        | Calendar        | Client appointment calendar            | Authenticated |
| `/my-appointments` | Appointments    | View and manage scheduled appointments | Authenticated |

### Provider Routes

| Route                | Component           | Description                    | Access                   |
| -------------------- | ------------------- | ------------------------------ | ------------------------ |
| `/provider/profile`  | ProviderProfilePage | Provider profile and settings  | Authenticated (Provider) |
| `/provider/calendar` | ProviderCalendar    | Provider schedule management   | Authenticated (Provider) |
| `/provider/services` | MyServices          | Create and manage services     | Authenticated (Provider) |
| `/provider/:id`      | ProviderDetails     | Provider profile (public view) | Public                   |

### Error Handling

| Route | Component | Description        |
| ----- | --------- | ------------------ |
| `*`   | NotFound  | 404 page not found |

## Frontend Architecture

### Design Patterns

- **Page-Based Architecture**: Each route corresponds to a full-page component
- **Component-Based UI**: Reusable, modular components for consistent styling and behavior
- **Context API**: Global state management for authentication and theme
- **Custom Hooks**: Encapsulated logic for calendar and other features
- **Responsive Design**: Mobile-first approach with flexible layouts

### State Management

- **AuthContext**: Manages user authentication, login status, and current user data
- **ThemeContext**: Handles dark/light theme preferences and persistence
- **Component State**: Local state for form inputs, loading states, and UI interactions

### Styling Architecture

- **Global Styles**: Base styles and CSS resets in `src/styles/`
- **CSS Variables**: Theme colors and typography defined in `variables.css`
- **Component Scoped Styles**: Each component has its own CSS file for maintainability
- **Responsive Design**: Media queries for optimal desktop and mobile experiences

### Data Flow

```
Components/Pages → API Service (Axios) → Backend API
                  ↓
            Context (State Management)
                  ↓
           Local Storage (Auth Token, Preferences)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/rot-right-on-time-frontend.git
cd rot-right-on-time-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:

```
VITE_API_URL=http://localhost:5005/api
```

Adjust the API URL based on your backend server configuration.

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

This generates optimized static files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Code Linting

Check code quality and styling:

```bash
npm run lint
```

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

### API Base URL Configuration

Set the backend API URL in your environment:

```
VITE_API_URL=http://localhost:5005/api
```

### Image Flow

Image uploads are done in two steps:

1. Upload image: `POST /api/upload/image`
2. Associate image: `PUT /api/users/image` or `PUT /api/providers/image`

Images are sent as JSON objects containing `url` and `public_id`.

### Key API Endpoints

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/verify`
- **Providers**: `GET /providers`, `GET /providers/:id`, `PUT /providers/me`
- **Users**: `GET /users/me`, `PUT /users/me`
- **Appointments**: `GET /appointments`, `POST /appointments`, `PUT /appointments/:id`, `DELETE /appointments/:id`
- **Services**: `GET /services`, `POST /services`, `PUT /services/:id`, `DELETE /services/:id`
- **Images**: `POST /upload/image`

## API Integration

The frontend communicates with the backend API for:

- User authentication and authorization
- Provider and service data retrieval
- Appointment creation, retrieval, and management
- User and provider profile operations
- File uploads for avatars and images

### Important Rules

- Frontend routes are not identical to backend routes; they map user flows.
- Image uploads are always a separate request.
- Signup routes never receive files directly.
- All API calls include JWT authentication headers when required.

## Support & Academic Disclaimer

This project was developed exclusively for **academic and educational purposes** as part of the Ironhack Full-Stack Web Development Bootcamp.

It is **not intended for** commercial use, production deployment, or real-world service operation. All data, users, providers, and appointments are **fictional** and created solely for learning purposes.

---

**Last Updated**: January 28, 2026  
**Version**: 1.0.0  
**Status**: Complete ✅

## 🧩 Project Ecosystem

- ⚙️ **Backend** → https://github.com/pablovqueiroz/rot-backend
- 🌐 **Frontend** → https://github.com/pablovqueiroz/rot-frontend

<p style="font-size: 20px;">
  🌍 <a href="https://right-on-time.netlify.app/">Live Demo</a>
</p>
