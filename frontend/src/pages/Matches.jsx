import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";

const shortTime = (value) => value
  ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value))
  : "";

export default function Matches({ currentUser }) {
  const [matches, setMatches] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  const selected = matches.find((match) => match.id === selectedId) || matches[0];

  useEffect(() => {
    let active = true;
    api.matches()
      .then((data) => {
        if (!active) return;
        setMatches(data);
        if (data.length) setSelectedId((current) => current || data[0].id);
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selected?.otherUser?.id) return undefined;
    let active = true;
    const load = () => api.messages(selected.otherUser.id)
      .then((data) => active && setMessages(data))
      .catch((requestError) => active && setError(requestError.message));
    load();
    const timer = window.setInterval(load, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [selected?.otherUser?.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selected) return;
    setDraft("");
    try {
      const message = await api.sendMessage(selected.otherUser.id, body);
      setMessages((current) => [...current, message]);
    } catch (requestError) {
      setDraft(body);
      setError(requestError.message);
    }
  };

  if (loading) return <section className="center-state"><div className="loader" /><h2>Loading connections</h2></section>;

  if (!matches.length) {
    return (
      <section className="center-state page-enter">
        <span className="state-icon"><Icon name="matches" size={32} /></span>
        <p className="eyebrow">Your connections</p>
        <h1>No matches yet</h1>
        <p>When you and another person both choose to connect, your private conversation will appear here.</p>
      </section>
    );
  }

  return (
    <section className="messages-page page-enter">
      <aside className="conversation-list">
        <header><p className="eyebrow">Mutual connections</p><h1>Messages</h1><span>{matches.length} {matches.length === 1 ? "connection" : "connections"}</span></header>
        <div className="conversation-list__items">
          {matches.map((match) => (
            <button type="button" key={match.id}
              className={`conversation-item ${selected?.id === match.id ? "conversation-item--active" : ""}`}
              onClick={() => setSelectedId(match.id)}>
              <Avatar user={match.otherUser} size="sm" />
              <div><strong>{match.otherUser.name}</strong><span>{match.lastMessage || "You connected — say hello"}</span></div>
              <time>{shortTime(match.lastActivityAt)}</time>
            </button>
          ))}
        </div>
      </aside>

      <div className="chat-panel">
        <header className="chat-panel__header">
          <Avatar user={selected.otherUser} size="sm" />
          <div><strong>{selected.otherUser.name}</strong><span><i /> Connected with you</span></div>
        </header>
        {error && <div className="form-error chat-error" role="alert">{error}</div>}
        <div className="chat-panel__messages">
          <div className="chat-intro">
            <Avatar user={selected.otherUser} size="md" />
            <strong>You connected with {selected.otherUser.name.split(" ")[0]}</strong>
            <span>{selected.otherUser.mood || "Start with a friendly hello."}</span>
          </div>
          {messages.map((message) => {
            const mine = message.senderId === currentUser.id;
            return (
              <div key={message.id} className={`message-row ${mine ? "message-row--mine" : ""}`}>
                {!mine && <Avatar user={selected.otherUser} size="xs" />}
                <div><p>{message.message}</p><time>{shortTime(message.timestamp)}</time></div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <form className="message-composer" onSubmit={send}>
          <input aria-label="Message" placeholder={`Message ${selected.otherUser.name.split(" ")[0]}…`}
            maxLength="1000" value={draft} onChange={(event) => setDraft(event.target.value)} />
          <button type="submit" aria-label="Send message" disabled={!draft.trim()}><Icon name="send" size={20} /></button>
        </form>
      </div>
    </section>
  );
}
