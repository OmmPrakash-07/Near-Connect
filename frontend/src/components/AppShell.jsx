import Avatar from "./Avatar";
import Brand from "./Brand";
import Icon from "./Icon";

const navItems = [
  { id: "discover", label: "Discover", icon: "discover" },
  { id: "matches", label: "Connections", icon: "matches" },
  { id: "profile", label: "My profile", icon: "profile" },
];

export default function AppShell({ page, setPage, user, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <nav className="sidebar__nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`nav-item ${page === item.id ? "nav-item--active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.id === "matches" && <i className="nav-item__dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar__profile">
          <Avatar user={user} size="sm" />
          <div>
            <strong>{user.name}</strong>
            <span>Profile active</span>
          </div>
          <button type="button" className="icon-button icon-button--quiet" onClick={onLogout} aria-label="Log out">
            <Icon name="logout" size={19} />
          </button>
        </div>
      </aside>

      <main className="app-main">{children}</main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={page === item.id ? "mobile-nav__active" : ""}
            onClick={() => setPage(item.id)}
          >
            <Icon name={item.icon} />
            <span>{item.label === "Connections" ? "Matches" : item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
