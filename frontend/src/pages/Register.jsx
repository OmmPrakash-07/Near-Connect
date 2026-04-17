import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register({ goToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    mood: ""
  });

  const handleRegister = async () => {
    const res = await registerUser(form);

    if (res && res.id) {
      alert("Registered Successfully ✅");
      goToLogin();
    } else {
      alert("Error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔥 Create Account</h2>

      <input placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={styles.input}
      />

      <input placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={styles.input}
      />

      <input type="password" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={styles.input}
      />

      <input placeholder="Bio"
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        style={styles.input}
      />

      <input placeholder="Mood 😎"
        onChange={(e) => setForm({ ...form, mood: e.target.value })}
        style={styles.input}
      />

      <button onClick={handleRegister} style={styles.button}>
        Register
      </button>

      <p onClick={goToLogin} style={styles.link}>
        Already have account? Login
      </p>
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
  input: {
    margin: "8px",
    padding: "10px",
    width: "260px",
    borderRadius: "5px",
    border: "none",
  },
  button: {
    padding: "10px 20px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
  link: {
    marginTop: "10px",
    cursor: "pointer",
    color: "#22c55e"
  }
};