import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app.store";
import { AppRoutes } from "./app.routes";
import ChatWidget from "../features/chatbot/components/ChatWidget";
import "./app.css";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={AppRoutes} />
      <ToastContainer position="top-right" autoClose={3000} />
      <ChatWidget />
    </Provider>
  );
}

export default App;
