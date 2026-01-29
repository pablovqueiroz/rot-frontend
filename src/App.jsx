import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import HomePage from "./pages/HomePage/HomePage";
import NotFound from "./pages/NotFound/NotFound";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProviderCalendar from "./pages/provider/Calendar/ProviderCalendar";
// import UserProfilePage from "./pages/Profile/UserProfilePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Booking from "./pages/client/Booking/Booking";
import Calendar from "./pages/client/Calendar/Calendar";
import Appointments from "./pages/Appointments/Appointments";
import ProviderDetails from "./pages/provider/ProviderDetails/ProviderDetails";
// import ProviderProfilePage from "./pages/Profile/ProviderProfilePage";
import MyServices from "./pages/provider/MyServices/MyServices";
import ProfilePage from "./pages/Profile/ProfilePage";


function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* <Route path="/user/profile" element={<UserProfilePage />} />
          <Route path="/provider/profile" element={<ProviderProfilePage />} /> */}

          <Route path="/provider/calendar" element={<ProviderCalendar />} />
          <Route path="/my-appointments" element={<Appointments/>} />
          <Route path="/provider/services" element={<MyServices />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
