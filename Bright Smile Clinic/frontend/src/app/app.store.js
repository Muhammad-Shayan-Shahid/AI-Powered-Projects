import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chatbot/state/chat.slice";
import appointmentReducer from "../features/appointment/state/appointment.slice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    appointment: appointmentReducer,
  },
});
