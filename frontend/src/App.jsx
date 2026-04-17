import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  const [page, setPage] = useState("login");

  if (page === "home") return <Home />;

  return page === "login" ? (
    <Login
      goToRegister={() => setPage("register")}
      goToHome={() => setPage("home")}
    />
  ) : (
    <Register goToLogin={() => setPage("login")} />
  );
}

export default App;