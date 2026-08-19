import { motion as Motion } from "framer-motion";
import Avatar from "./Avatar";
import Icon from "./Icon";

export default function MatchModal({ currentUser, matchedUser, onClose, onMessage }) {
  if (!matchedUser) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <Motion.section
        className="match-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-title"
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="icon-button match-modal__close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        <div className="match-modal__spark"><Icon name="sparkle" size={28} /></div>
        <div className="match-modal__avatars">
          <Avatar user={currentUser} size="lg" />
          <span><Icon name="heart" size={22} /></span>
          <Avatar user={matchedUser} size="lg" />
        </div>
        <p className="eyebrow">Mutual connection</p>
        <h2 id="match-title">You and {matchedUser.name.split(" ")[0]} connected</h2>
        <p>You both want to meet. Start with a simple hello and take it from there.</p>
        <button type="button" className="button button--primary button--wide" onClick={onMessage}>
          <Icon name="message" /> Send a message
        </button>
        <button type="button" className="text-button" onClick={onClose}>Keep discovering</button>
      </Motion.section>
    </div>
  );
}
