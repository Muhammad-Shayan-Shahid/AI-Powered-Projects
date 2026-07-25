import { useCallback, useRef, useState } from 'react';
import { chatbotService } from '../services/chatbotService';

const WELCOME_MESSAGE = 'Hi! Ask me about our services, insurance, or appointment info.';
const FALLBACK_ERROR_MESSAGE =
  "Sorry, I'm having trouble connecting right now. Please try again in a moment, or call the clinic directly if it's urgent.";

// Local component state is enough here (not Redux) — the widget stays mounted
// for the whole visit, and chat history/sessionId never need to survive a
// reload, so there's nothing that needs to live outside this hook.
export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const sessionIdRef = useRef(undefined);
  const nextIdRef = useRef(0);

  const addMessage = useCallback((from, text, card = null) => {
    nextIdRef.current += 1;
    setMessages((prev) => [...prev, { id: nextIdRef.current, from, text, card }]);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setMessages((prev) => (prev.length > 0 ? prev : [{ id: 0, from: 'bot', text: WELCOME_MESSAGE, card: null }]));
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Shared by the input's send button AND every inline card's tap/confirm/
  // change action (Phase 9b) — a card selection is just "the next message",
  // exactly like the patient typing it themselves.
  const sendText = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      addMessage('user', trimmed);
      setIsTyping(true);

      try {
        const { reply, sessionId, card } = await chatbotService.sendMessage({
          message: trimmed,
          sessionId: sessionIdRef.current,
        });
        sessionIdRef.current = sessionId;
        addMessage('bot', reply, card);
      } catch (error) {
        addMessage('bot', FALLBACK_ERROR_MESSAGE);
      } finally {
        setIsTyping(false);
      }
    },
    [addMessage]
  );

  const send = useCallback(() => {
    const text = input;
    setInput('');
    return sendText(text);
  }, [input, sendText]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') send();
    },
    [send]
  );

  return { isOpen, messages, input, isTyping, open, close, send, sendText, setInput, handleKeyDown };
}
