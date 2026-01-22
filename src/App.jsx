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

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<ProvidersList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/providers/:id" element={<ProviderDetails />} />
      <Route path="/my-appointments" element={<MyAppointments />} />

      <Route path="/provider/calendar" element={<ProviderCalendar/>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
