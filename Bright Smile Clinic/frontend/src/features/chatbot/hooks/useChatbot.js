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

  const addMessage = useCallback((from, text) => {
    nextIdRef.current += 1;
    setMessages((prev) => [...prev, { id: nextIdRef.current, from, text }]);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setMessages((prev) => (prev.length > 0 ? prev : [{ id: 0, from: 'bot', text: WELCOME_MESSAGE }]));
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    addMessage('user', text);
    setInput('');
    setIsTyping(true);

    try {
      const { reply, sessionId } = await chatbotService.sendMessage({
        message: text,
        sessionId: sessionIdRef.current,
      });
      sessionIdRef.current = sessionId;
      addMessage('bot', reply);
    } catch (error) {
      addMessage('bot', FALLBACK_ERROR_MESSAGE);
    } finally {
      setIsTyping(false);
    }
  }, [input, addMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') send();
    },
    [send]
  );

  return { isOpen, messages, input, isTyping, open, close, send, setInput, handleKeyDown };
}
