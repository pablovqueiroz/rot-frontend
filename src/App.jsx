import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import ProvidersList from "./pages/client/ProvidersList/ProvidersList";
import ProviderDetails from "./pages/client/ProviderDetails/ProviderDetails";
import MyAppointments from "./pages/client/MyAppointments/MyAppointments";
import NotFound from "./pages/NotFound/NotFound";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProviderCalendar from "./pages/provider/Calendar/ProviderCalendar";
import UserProfilePage from "./pages/Profile/UserProfilePage";
import ProviderProfilePage from "./pages/Profile/ProviderProfilePage";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<ProvidersList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/user/profile" element={<UserProfilePage/>}/>
          <Route path="/provider/profile" element={<ProviderProfilePage/>}/>
          <Route path="/provider/calendar" element={<ProviderCalendar />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
