import { useState } from "react";
import { api } from "../services/api";
import Avatar from "../components/Avatar";
import Brand from "../components/Brand";
import Icon from "../components/Icon";

const previewProfiles = [
  { name: "Aditi Sharma", avatarColor: "#7c5cff" },
  { name: "Rohan Das", avatarColor: "#ff6b45" },
  { name: "Meera Nair", avatarColor: "#18a999" },
];

const emptyRegister = { name: "", email: "", password: "", bio: "", mood: "" };

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState(emptyRegister);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const session = mode === "login" ? await api.login(login) : await api.register(register);
      onAuthenticated(session);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const useDemo = async () => {
    setMode("login");
    setBusy(true);
    setError("");
    const credentials = { email: "aditi@nearconnect.app", password: "demo1234" };
    setLogin(credentials);
    try {
      onAuthenticated(await api.login(credentials));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Brand />
        <div className="auth-story__content">
          <p className="eyebrow eyebrow--light">Real people. Right around you.</p>
          <h1>Turn nearby into <em>known.</em></h1>
          <p>Discover people close to you, connect only when the feeling is mutual, then start a private conversation.</p>
          <div className="auth-story__proof">
            <div className="avatar-stack">
              {previewProfiles.map((profile) => <Avatar key={profile.name} user={profile} size="sm" />)}
            </div>
            <span><strong>Made for local circles</strong><br />Private by design, simple by choice.</span>
          </div>
        </div>
        <div className="auth-story__card" aria-hidden="true">
          <Avatar user={previewProfiles[2]} size="lg" />
          <div><strong>Meera is 1.4 km away</strong><span>Up for a photo walk</span></div>
          <span className="auth-story__heart"><Icon name="heart" size={19} /></span>
        </div>
        <small>Near Connect · MVP 1.0</small>
      </section>

      <section className="auth-panel">
        <div className="auth-panel__inner">
          <div className="mobile-brand"><Brand /></div>
          <p className="eyebrow">Welcome to your neighbourhood</p>
          <h2>{mode === "login" ? "Good to see you again" : "Create your profile"}</h2>
          <p className="auth-panel__intro">
            {mode === "login" ? "Sign in to continue discovering people nearby." : "A few details are enough to start making real connections."}
          </p>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Sign in</button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Create account</button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <label>Full name
                <input required minLength="2" maxLength="80" autoComplete="name" placeholder="Your name"
                  value={register.name} onChange={(event) => setRegister({ ...register, name: event.target.value })} />
              </label>
            )}
            <label>Email address
              <input required type="email" autoComplete="email" placeholder="you@example.com"
                value={mode === "login" ? login.email : register.email}
                onChange={(event) => mode === "login"
                  ? setLogin({ ...login, email: event.target.value })
                  : setRegister({ ...register, email: event.target.value })} />
            </label>
            <label>Password
              <input required type="password" minLength="8" maxLength="72"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="At least 8 characters"
                value={mode === "login" ? login.password : register.password}
                onChange={(event) => mode === "login"
                  ? setLogin({ ...login, password: event.target.value })
                  : setRegister({ ...register, password: event.target.value })} />
            </label>
            {mode === "register" && (
              <>
                <label>Short bio <span>optional</span>
                  <textarea maxLength="500" rows="3" placeholder="What should nearby people know about you?"
                    value={register.bio} onChange={(event) => setRegister({ ...register, bio: event.target.value })} />
                </label>
                <label>Current vibe <span>optional</span>
                  <input maxLength="80" placeholder="Coffee, coworking, a walk..."
                    value={register.mood} onChange={(event) => setRegister({ ...register, mood: event.target.value })} />
                </label>
              </>
            )}

            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button--primary button--wide" type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              {!busy && <Icon name="arrow" />}
            </button>
          </form>

          <div className="auth-demo">
            <span>or</span>
            <button type="button" className="button button--secondary button--wide" onClick={useDemo} disabled={busy}>
              Explore with demo account
            </button>
            <small>Demo login: aditi@nearconnect.app · demo1234</small>
          </div>
        </div>
      </section>
    </main>
  );
}
