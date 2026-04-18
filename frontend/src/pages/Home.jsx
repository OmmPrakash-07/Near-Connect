import { useEffect, useState } from "react";
import { getNearbyUsers, swipeUser } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const lat = 20.2961;
        const lon = 85.8245;

        const data = await getNearbyUsers(lat, lon);
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSwipe = async (action) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const targetUser = users[index];

    if (!currentUser || !targetUser) return;

    await swipeUser(currentUser.id, targetUser.id, action);
    setIndex((prev) => prev + 1);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // 🔥 LOADING
  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading users... ⏳</h2>
      </div>
    );
  }

  // 🔥 NO USERS
  if (users.length === 0) {
    return (
      <div style={styles.container}>
        <h2>No nearby users 😢</h2>
        <button style={styles.button} onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  // 🔥 END
  if (index >= users.length) {
    return (
      <div style={styles.container}>
        <h2>No more users 😢</h2>
        <button style={styles.button} onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  const user = users[index];

  return (
    <div style={styles.container}>
      <h2>🔥 NearConnect</h2>

      {/* 🔥 SWIPE CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={user.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x > 120) handleSwipe("LIKE");
            else if (info.offset.x < -120) handleSwipe("PASS");
          }}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -200 }}
          transition={{ duration: 0.3 }}
          style={styles.card}
        >
          <h3>{user.name}</h3>
          <p>{user.bio || "No bio"}</p>
          <p>😎 {user.mood || "No mood"}</p>
        </motion.div>
      </AnimatePresence>

      {/* BUTTONS */}
      <div>
        <button style={styles.pass} onClick={() => handleSwipe("PASS")}>
          ❌ Pass
        </button>

        <button style={styles.like} onClick={() => handleSwipe("LIKE")}>
          ❤️ Like
        </button>
      </div>

      {/* LOGOUT */}
      <button style={styles.logout} onClick={logout}>
        Logout 🚪
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "15px",
    margin: "20px",
    width: "300px",
    textAlign: "center",
    cursor: "grab",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  },
  like: {
    padding: "10px 20px",
    margin: "10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  pass: {
    padding: "10px 20px",
    margin: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logout: {
    marginTop: "20px",
    padding: "8px 16px",
    background: "#334155",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
  button: {
    padding: "10px 20px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
  },
};