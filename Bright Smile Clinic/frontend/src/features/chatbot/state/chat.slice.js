import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  messages: [
    {
      role: "bot",
      text: "Hi! I'm the Bright Smile assistant. Ask me about services, doctors, insurance, or booking an appointment.",
    },
  ],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    addUserMessage(state, action) {
      state.messages.push({ role: "user", text: action.payload });
    },
    addBotMessage(state, action) {
      state.messages.push({ role: "bot", text: action.payload });
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { toggleChat, addUserMessage, addBotMessage, setLoading, setError } =
  chatSlice.actions;
export default chatSlice.reducer;
