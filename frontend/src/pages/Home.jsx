import { useEffect, useState } from "react";
import { getNearbyUsers, updateLocation } from "../services/api";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // ✅ Save current user location
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          await updateLocation(currentUser.id, {
            latitude: lat,
            longitude: lon,
          });
        }

        // ✅ Fetch nearby users
        const data = await getNearbyUsers(lat, lon);
        setUsers(data);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Please allow location access ❌");
      }
    );
  }, []);

  return (
    <div style={styles.container}>
      <h2>📍 Nearby Users</h2>

      {users.length === 0 ? (
        <p>No nearby users found 😢</p>
      ) : (
        users.map((user) => (
          <div key={user.id} style={styles.card}>
            <h3>{user.name}</h3>
            <p>{user.bio || "No bio"}</p>
            <p>😎 {user.mood || "No mood"}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  card: {
    background: "#1e293b",
    padding: "15px",
    margin: "10px",
    borderRadius: "10px",
    transition: "0.3s",
  },
};