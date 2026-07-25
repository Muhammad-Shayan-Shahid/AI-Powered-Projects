import { useEffect, useRef } from 'react';
import { useChatbot } from '../hooks/useChatbot';
import { useMascot } from '../hooks/useMascot';
import MascotIcon, { MascotHeaderIcon } from './MascotIcon';
import DoctorPickerCard from './cards/DoctorPickerCard';
import SlotPickerCard from './cards/SlotPickerCard';
import ConfirmationCard from './cards/ConfirmationCard';
import { formatTimeLabel } from '../../../utils/dateFormat';

const DOT_DELAYS_MS = [0, 150, 300];

// Renders the inline card a bot message carries (Phase 9b), if any. Every
// card's data comes straight from the backend's tool-call results — tapping
// an option just sends the next chat message, exactly like typing it.
function MessageCard({ card, onSendText }) {
  if (!card) return null;
  if (card.type === 'doctor_picker') {
    return <DoctorPickerCard data={card.data} onSelect={(doc) => onSendText(doc.name)} />;
  }
  if (card.type === 'slot_picker') {
    return <SlotPickerCard data={card.data} onSelect={(slot) => onSendText(formatTimeLabel(slot))} />;
  }
  if (card.type === 'confirmation') {
    return (
      <ConfirmationCard
        data={card.data}
        variant="confirm"
        onConfirm={() => onSendText('Yes, I confirm — please book it.')}
        onChange={() => onSendText("Actually, can I pick a different time?")}
      />
    );
  }
  if (card.type === 'success') {
    return <ConfirmationCard data={card.data} variant="success" />;
  }
  return null;
}

// Floating, always-mounted FAQ chat widget (see CLAUDE.md Chatbot/RAG rules) —
// imported from the Bright Smile Claude Design project ("Chat Widget.dc.html").
// Colors/spacing map 1:1 onto the app's existing design tokens (app.css) since
// the values already matched (brand/accent/page/border/etc).
//
// The robot mascot (MascotIcon/useMascot) is the single click target for the
// bubble — there is no separate plain bubble button underneath it. The chat
// panel itself (messages, input, send) is unchanged from Phase 9a; only the
// trigger and the header icon are new.
export default function ChatWidget() {
  const { isOpen, messages, input, isTyping, open, close, send, sendText, setInput, handleKeyDown } = useChatbot();
  const { pose, isBlinking, prefersReducedMotion, playGreetingThenOpen } = useMascot(isOpen);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const handleMascotClick = () => playGreetingThenOpen(open);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans max-[480px]:bottom-5 max-[480px]:right-5">
      {!isOpen && (
        <button
          type="button"
          onClick={handleMascotClick}
          aria-label="Open chat"
          className={[
            'relative h-[68px] w-[68px] rounded-full border-none bg-[oklch(96.5%_0.02_35)] p-1.5 cursor-pointer',
            'shadow-[0_8px_20px_oklch(40%_0.075_195_/_0.28)] transition-transform duration-150 hover:scale-[1.06]',
            'max-[380px]:h-14 max-[380px]:w-14',
            pose === 'entrance' && !prefersReducedMotion ? 'animate-chat-bubble-intro' : '',
          ].join(' ')}
        >
          <MascotIcon pose={pose} isBlinking={isBlinking} animationsEnabled={!prefersReducedMotion} />
        </button>
      )}

      <div
        data-testid="chatbot-panel"
        className={[
          'fixed bottom-24 right-6 h-[min(70vh,580px)] w-[380px] origin-bottom-right rounded-[22px] transition-all duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'max-[480px]:top-0 max-[480px]:left-0 max-[480px]:right-0 max-[480px]:bottom-0 max-[480px]:h-full max-[480px]:w-full max-[480px]:rounded-none',
          isOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-[0.92] translate-y-4 opacity-0',
        ].join(' ')}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[inherit] bg-surface shadow-[0_24px_60px_oklch(22%_0.05_265_/_0.22)]">
          <div className="flex shrink-0 items-center gap-3 bg-brand px-[18px] py-4">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-white/15 p-1">
              <MascotHeaderIcon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[0.9375rem] text-white">Bright Smile</div>
              <div className="font-medium text-[0.75rem] text-white/75">Ask us anything</div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-transparent text-[1.0625rem] text-white transition-colors duration-150 hover:bg-white/[0.14]"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-page p-[18px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`animate-message-in flex flex-col gap-2.5 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.text && (
                  <div
                    className={
                      msg.from === 'user'
                        ? 'max-w-[80%] rounded-2xl rounded-br-[4px] bg-brand px-[15px] py-[11px] text-[0.875rem] leading-[1.45] text-white text-pretty'
                        : 'max-w-[80%] rounded-2xl rounded-bl-[4px] bg-neutral-hover px-[15px] py-[11px] text-[0.875rem] leading-[1.45] text-ink text-pretty'
                    }
                  >
                    {msg.text}
                  </div>
                )}
                <MessageCard card={msg.card} onSendText={sendText} />
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-[5px] rounded-2xl rounded-bl-[4px] bg-neutral-hover px-4 py-[13px]">
                  {DOT_DELAYS_MS.map((delay) => (
                    <span
                      key={delay}
                      style={{ animationDelay: `${delay}ms` }}
                      className="animate-chat-dot inline-block h-1.5 w-1.5 rounded-full bg-ink-secondary"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 gap-2.5 border-t border-border bg-surface p-[14px]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="min-w-0 flex-1 rounded-[14px] border-[1.5px] border-border bg-page px-4 py-3 text-[0.9375rem] text-ink outline-none transition-colors duration-150 focus:border-brand"
            />
            <button
              type="button"
              onClick={send}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-none bg-accent text-[1.0625rem] text-accent-ink transition-[background-color,transform] duration-150 hover:bg-accent-hover active:scale-[0.94]"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
