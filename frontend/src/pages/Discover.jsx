import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { api } from "../services/api";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import MatchModal from "../components/MatchModal";

const SAMPLE_LOCATION = { latitude: 20.2961, longitude: 85.8245 };

export default function Discover({ user, onUserUpdate, onOpenMatches }) {
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(Boolean(user.latitude));
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(0);
  const [matchedUser, setMatchedUser] = useState(null);
  const [locating, setLocating] = useState(false);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProfiles(await api.nearby(radius));
      setIndex(0);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [radius]);

  useEffect(() => {
    // This effect intentionally refreshes server results when location/radius changes.
     
    if (user.latitude != null && user.longitude != null) loadProfiles();
  }, [user.latitude, user.longitude, loadProfiles]);

  const saveLocation = async (location) => {
    const updatedUser = await api.updateLocation(location);
    onUserUpdate(updatedUser);
  };

  const useMyLocation = () => {
    setLocating(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser. You can use the sample location instead.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await saveLocation({ latitude: coords.latitude, longitude: coords.longitude });
        } catch (requestError) {
          setError(requestError.message);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Location permission was not granted. Use the sample location to explore the MVP.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useSampleLocation = async () => {
    setLocating(true);
    setError("");
    try {
      await saveLocation(SAMPLE_LOCATION);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLocating(false);
    }
  };

  const choose = async (action) => {
    const profile = profiles[index];
    if (!profile) return;
    setDirection(action === "LIKE" ? 1 : -1);
    try {
      const result = await api.swipe(profile.id, action);
      if (result.matched) setMatchedUser(result.matchedUser);
      setIndex((current) => current + 1);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (user.latitude == null || user.longitude == null) {
    return (
      <section className="location-gate page-enter">
        <div className="location-gate__visual"><span><Icon name="pin" size={34} /></span><i /><i /><i /></div>
        <p className="eyebrow">One step before discovery</p>
        <h1>Who is near you?</h1>
        <p>Near Connect uses your approximate location only to calculate distance and show profiles inside your chosen radius.</p>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="location-gate__actions">
          <button type="button" className="button button--primary" onClick={useMyLocation} disabled={locating}>
            <Icon name="pin" /> {locating ? "Finding you…" : "Use my location"}
          </button>
          <button type="button" className="button button--secondary" onClick={useSampleLocation} disabled={locating}>
            Use sample location
          </button>
        </div>
        <small>You stay in control. Update your location anytime from your profile.</small>
      </section>
    );
  }

  const profile = profiles[index];
  const remaining = Math.max(profiles.length - index, 0);

  return (
    <section className="discover-page page-enter">
      <header className="page-header">
        <div>
          <p className="eyebrow">Your local circle</p>
          <h1>Discover nearby</h1>
          <p>People inside your radius, one thoughtful connection at a time.</p>
        </div>
        <div className="radius-control">
          <Icon name="pin" size={17} />
          <label htmlFor="radius">Within</label>
          <select id="radius" value={radius} onChange={(event) => setRadius(Number(event.target.value))}>
            <option value="5">5 km</option><option value="10">10 km</option><option value="25">25 km</option><option value="50">50 km</option>
          </select>
        </div>
      </header>

      <div className="discover-layout">
        <div className="discover-stage">
          {error && <div className="form-error form-error--floating" role="alert">{error}</div>}
          {loading ? (
            <div className="profile-card profile-card--state"><div className="loader" /><h2>Finding people nearby</h2><p>Looking inside your {radius} km radius…</p></div>
          ) : !profile ? (
            <div className="profile-card profile-card--state">
              <span className="state-icon"><Icon name="sparkle" size={30} /></span>
              <h2>You are all caught up</h2>
              <p>You have seen everyone in this radius. Try a wider area or return later.</p>
              <button type="button" className="button button--secondary" onClick={loadProfiles}><Icon name="refresh" /> Check again</button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait" custom={direction}>
                <Motion.article
                  className="profile-card"
                  key={profile.id}
                  custom={direction}
                  initial={{ opacity: 0, scale: 0.96, y: 22 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, x: direction * 430, rotate: direction * 7 }}
                  transition={{ duration: 0.28 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 110) choose("LIKE");
                    if (info.offset.x < -110) choose("PASS");
                  }}
                >
                  <div className="profile-card__hero" style={{ "--profile-color": profile.avatarColor }}>
                    <div className="profile-card__pattern" />
                    <Avatar user={profile} size="xl" />
                    <span className="distance-pill"><Icon name="pin" size={15} /> {profile.distanceKm} km away</span>
                    <span className="profile-card__count">{remaining} nearby</span>
                  </div>
                  <div className="profile-card__body">
                    <div className="profile-card__name"><div><h2>{profile.name}</h2><span className="online-dot">Recently active</span></div></div>
                    <div className="mood-pill"><Icon name="sparkle" size={16} /> {profile.mood || "Open to meeting someone nearby"}</div>
                    <p className="profile-card__bio">{profile.bio || "This person is keeping their story short for now."}</p>
                    <div className="profile-card__hint"><span>Drag left to pass</span><i /><span>Drag right to connect</span></div>
                  </div>
                </Motion.article>
              </AnimatePresence>
              <div className="swipe-actions">
                <button type="button" className="swipe-button swipe-button--pass" onClick={() => choose("PASS")} aria-label={`Pass ${profile.name}`}><Icon name="close" size={29} /></button>
                <button type="button" className="swipe-button swipe-button--like" onClick={() => choose("LIKE")} aria-label={`Connect with ${profile.name}`}><Icon name="heart" size={28} /></button>
              </div>
            </>
          )}
        </div>

        <aside className="discover-note">
          <span><Icon name="sparkle" /></span>
          <h3>Connection, not collection.</h3>
          <p>A match appears only when both people choose to connect. Your passes remain private.</p>
          <div><strong>{remaining}</strong><span>profiles left<br />in this radius</span></div>
        </aside>
      </div>

      <MatchModal currentUser={user} matchedUser={matchedUser} onClose={() => setMatchedUser(null)}
        onMessage={() => { setMatchedUser(null); onOpenMatches(); }} />
    </section>
  );
}
