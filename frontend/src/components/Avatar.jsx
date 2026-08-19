export default function Avatar({ user, size = "md", className = "" }) {
  const initials = (user?.name || "NC")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`avatar avatar--${size} ${className}`}
      style={{ "--avatar-color": user?.avatarColor || "#7c5cff" }}
      aria-label={`${user?.name || "User"} avatar`}
    >
      <span>{initials}</span>
    </div>
  );
}
