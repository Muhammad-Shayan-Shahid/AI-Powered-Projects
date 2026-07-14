import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../services/chatService";
import {
  addUserMessage,
  addBotMessage,
  setLoading,
  setError,
  toggleChat,
} from "../state/chat.slice";

export function useChat() {
  const dispatch = useDispatch();
  const { messages, isOpen, isLoading, error } = useSelector((state) => state.chat);

  async function sendMessage(question) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    dispatch(addUserMessage(trimmed));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await sendChatMessage(trimmed);
      dispatch(addBotMessage(data.answer));
    } catch (err) {
      dispatch(setError(err.message));
      dispatch(
        addBotMessage(
          "Sorry, I couldn't reach the clinic assistant right now. Please try again or call the clinic directly."
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  function toggle() {
    dispatch(toggleChat());
  }

  return { messages, isOpen, isLoading, error, sendMessage, toggle };
}
