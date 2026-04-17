import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ goToRegister, goToHome }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginUser({ email, password });

    if (res && res.id) {
      alert("Login Successful ✅");
      localStorage.setItem("user", JSON.stringify(res));

      // ✅ FIXED (no page reload)
      goToHome();

    } else {
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔥 NearConnect Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>

      {/* ✅ SWITCH BUTTON */}
      <p onClick={goToRegister} style={styles.link}>
        New user? Register
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
    margin: "10px",
    padding: "10px",
    width: "250px",
    borderRadius: "5px",
    border: "none",
  },
  button: {
    padding: "10px 20px",
    background: "#22c55e",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
  link: {
    marginTop: "12px",
    cursor: "pointer",
    color: "#3b82f6",
  },
};