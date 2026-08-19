import { useEffect, useState } from "react";
import "./App.css";
import AppShell from "./components/AppShell";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import { api, getStoredSession, storeSession } from "./services/api";

export default function App() {
  const [session, setSession] = useState(getStoredSession);
  const [page, setPage] = useState("discover");
  const [checkingSession, setCheckingSession] = useState(Boolean(getStoredSession()));

  useEffect(() => {
    if (!session?.token) return;
    api.me()
      .then((user) => {
        const freshSession = { ...session, user };
        storeSession(freshSession);
        setSession(freshSession);
      })
      .catch(() => {
        storeSession(null);
        setSession(null);
      })
      .finally(() => setCheckingSession(false));
    // The token is the stable identity for this verification.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  const authenticated = (nextSession) => {
    storeSession(nextSession);
    setSession(nextSession);
    setCheckingSession(false);
  };

  const updateUser = (user) => {
    const nextSession = { ...session, user };
    storeSession(nextSession);
    setSession(nextSession);
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* Local sign-out must still succeed. */ }
    storeSession(null);
    setSession(null);
    setPage("discover");
  };

  if (checkingSession) {
    return <main className="splash"><div className="brand-splash"><i /><i /></div><span>Near Connect</span></main>;
  }

  if (!session?.user) return <Auth onAuthenticated={authenticated} />;

  const pages = {
    discover: <Discover user={session.user} onUserUpdate={updateUser} onOpenMatches={() => setPage("matches")} />,
    matches: <Matches currentUser={session.user} />,
    profile: <Profile user={session.user} onUserUpdate={updateUser} onLogout={logout} />,
  };

  return (
    <AppShell page={page} setPage={setPage} user={session.user} onLogout={logout}>
      {pages[page]}
    </AppShell>
  );
}
