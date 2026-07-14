import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Home from "../features/clinicInfo/pages/Home";
import Services from "../features/clinicInfo/pages/Services";
import Doctors from "../features/clinicInfo/pages/Doctors";
import InsuranceFaqs from "../features/clinicInfo/pages/InsuranceFaqs";
import BookAppointment from "../features/appointment/pages/BookAppointment";

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "doctors", element: <Doctors /> },
      { path: "insurance-faqs", element: <InsuranceFaqs /> },
      { path: "book-appointment", element: <BookAppointment /> },
    ],
  },
]);
