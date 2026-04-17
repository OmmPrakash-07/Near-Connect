const BASE_URL = "http://localhost:8080/api/users";

// ✅ LOGIN
export const loginUser = async (user) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

// ✅ REGISTER
export const registerUser = async (user) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await res.json();
  } catch (err) {
    console.error("Register error:", err);
    return null;
  }
};

// ✅ GET NEARBY USERS
export const getNearbyUsers = async (lat, lon) => {
  try {
    const res = await fetch(
      `${BASE_URL}/nearby?lat=${lat}&lon=${lon}&radius=5`
    );

    return await res.json();
  } catch (err) {
    console.error("Nearby error:", err);
    return [];
  }
};

// ✅ UPDATE LOCATION
export const updateLocation = async (id, location) => {
  try {
    const res = await fetch(`${BASE_URL}/location/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });

    return await res.json();
  } catch (err) {
    console.error("Location update error:", err);
    return null;
  }
};