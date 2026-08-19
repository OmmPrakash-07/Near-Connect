import { useState } from "react";
import { api } from "../services/api";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";

const SAMPLE_LOCATION = { latitude: 20.2961, longitude: 85.8245 };

export default function Profile({ user, onUserUpdate, onLogout }) {
  const [form, setForm] = useState({ name: user.name || "", bio: user.bio || "", mood: user.mood || "" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      onUserUpdate(await api.updateProfile(form));
      setStatus("Profile saved.");
    } catch (requestError) {
      setStatus(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const updateLocation = () => {
    setBusy(true);
    setStatus("");
    const persist = async (location) => {
      try {
        onUserUpdate(await api.updateLocation(location));
        setStatus("Location updated.");
      } catch (requestError) {
        setStatus(requestError.message);
      } finally {
        setBusy(false);
      }
    };
    if (!navigator.geolocation) return persist(SAMPLE_LOCATION);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => persist({ latitude: coords.latitude, longitude: coords.longitude }),
      () => {
        setStatus("Location permission was not granted. Your current location was not changed.");
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="profile-page page-enter">
      <header className="page-header"><div><p className="eyebrow">Your presence</p><h1>My profile</h1><p>Share just enough to make the first conversation easier.</p></div></header>
      <div className="profile-layout">
        <aside className="profile-preview">
          <div className="profile-preview__top" style={{ "--profile-color": user.avatarColor }}><Avatar user={{ ...user, name: form.name }} size="xl" /></div>
          <h2>{form.name || "Your name"}</h2>
          <div className="mood-pill"><Icon name="sparkle" size={16} /> {form.mood || "Your current vibe"}</div>
          <p>{form.bio || "Your bio will appear here."}</p>
          <span className="profile-preview__location"><Icon name="pin" size={16} /> {user.latitude == null ? "Location not added" : "Location is active"}</span>
        </aside>

        <form className="profile-form" onSubmit={saveProfile}>
          <div className="section-heading"><div><h2>Profile details</h2><p>This is what nearby people see before connecting.</p></div></div>
          <label>Full name<input required minLength="2" maxLength="80" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Current vibe<input maxLength="80" placeholder="Coffee, coworking, a walk…" value={form.mood} onChange={(event) => setForm({ ...form, mood: event.target.value })} /></label>
          <label>About you<textarea rows="5" maxLength="500" placeholder="Tell people a little about you" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /><small>{form.bio.length}/500</small></label>
          {status && <div className="profile-status" role="status">{status}</div>}
          <button className="button button--primary" type="submit" disabled={busy}>Save changes</button>

          <div className="profile-form__divider" />
          <div className="location-setting">
            <span><Icon name="pin" /></span>
            <div><strong>Discovery location</strong><p>Refresh the location used to calculate nearby distance.</p></div>
            <button type="button" className="button button--secondary" onClick={updateLocation} disabled={busy}>Update</button>
          </div>
          <button type="button" className="text-button text-button--danger" onClick={onLogout}><Icon name="logout" size={17} /> Log out of Near Connect</button>
        </form>
      </div>
    </section>
  );
}
