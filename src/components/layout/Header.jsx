import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Popover, Input, Button, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSun,
  faMoon,
  faLanguage,
  faCog,
  faBolt,
  faBell,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "@/hooks/useAuth";
import { useGroups, useJoinGroup, useMyGroups } from "@/hooks/useGroups";

function Header() {
  const { darkMode, setDarkMode, setLanguage, themeMode, setThemeMode } = useTheme();
  const [isThemeOpen, setThemeOpen] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const { logout } = useAuth();
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState('');
  const { groups, isLoadingGroups, isErrorGroups } = useGroups(group);
  const { mutate: joinGroup, isLoading, isError, error } = useJoinGroup();
  const { refetch, myGroups } = useMyGroups();


  const themeRef = useRef(null);
  const langRef = useRef(null);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  // Popoverni yopish
  useEffect(() => {
    function handleClickOutside(event) {
      if (themeRef.current && !themeRef.current.contains(event.target)) setThemeOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tema o'zgartirish
  const changeTheme = (mode) => {
    setThemeMode(mode);
    if (mode === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(systemDark);
    } else {
      setDarkMode(mode === "dark");
    }
  };

  // Guruhga qo'shish
  const handleJoin = (group) => {
    if (!group._id) {
      message.error("Group ID is missing!");
      return;
    }
    if (!password) {
      message.warning("Please enter a password.");
      return;
    }
    joinGroup(
      { groupId: group._id, password },
      {
        onSuccess: () => {
          message.success("Successfully joined the group!");
          setPassword("");
          setGroup("");
          refetch();
        },
        onError: (err) => {
          message.error(err.response?.data?.error || "Failed to join the group.");
        },
      }
    );
  };

  // Guruhga qo'shish uchun popover(modal)
  const joinPopoverContent = (group) => (
    <div>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        placeholder="Enter group password"
      />
      <Button
        type="primary"
        style={{ backgroundColor: "green", color: "white", width: "100%", marginTop: "10px" }}
        onClick={() => handleJoin(group)}
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join"}
      </Button>
      {isError && message.error(error?.message || "Failed to join")}
    </div>
  );

  // Guruhlarni qidirish uchun filter
  const filteredGroups = groups?.filter(
    (g) => !myGroups?.some((myGroup) => myGroup._id === g._id)
  );

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className="container">
        <div className="menu-input">
          <button className="menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <label>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" style={{ color: "#A9AAAC" }} />
            <input
              type="text"
              placeholder="Search..."
              className="input"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
            {group.length > 0 && (
              <div className="search-results">
                {groups.length > 0 && !isLoadingGroups && <h3>Groups</h3>}
                <ul>
                  {isLoadingGroups ? (
                    <p className="loading">Loading groups...</p>
                  ) : filteredGroups.length > 0 ? (
                    filteredGroups.map((group, index) => (
                      <li key={group.id || index + 1}>
                        <div className="user">
                          <div className="user-info">
                            <h4>{group.name}</h4>
                            <span>{new Date(group.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</span>
                          </div>
                          <p>Created By: <span>{group.owner.name}</span></p>
                        </div>
                        <Popover content={() => joinPopoverContent(group)} title="Group password" trigger="click">
                          <button className="join-btn">Join</button>
                        </Popover>
                      </li>
                    ))
                  ) : (
                    <p className="no-results">No groups found</p>
                  )}
                </ul>
              </div>
            )}
          </label>
        </div>
        {isErrorGroups && console.log("Error fetching groups: ", isErrorGroups)}
        <div className="flex">
          <div className="relative" ref={themeRef}>
            <button className="icon-btn" onClick={() => setThemeOpen(!isThemeOpen)}>
              <FontAwesomeIcon icon={themeMode === "dark" ? faMoon : themeMode === "light" ? faSun : faDesktop} />
            </button>
            {isThemeOpen && (
              <div className="dropdown">
                <button onClick={() => changeTheme("light")}>
                  <FontAwesomeIcon icon={faSun} /> Light
                </button>
                <button onClick={() => changeTheme("dark")}>
                  <FontAwesomeIcon icon={faMoon} /> Dark
                </button>
                <button onClick={() => changeTheme("system")}>
                  <FontAwesomeIcon icon={faDesktop} /> System
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={langRef}>
            <button className="icon-btn" onClick={() => setLangOpen(!isLangOpen)}>
              <FontAwesomeIcon icon={faLanguage} />
            </button>
            {isLangOpen && (
              <div className="dropdown">
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangOpen(false);
                  }}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => {
                    setLanguage("uz");
                    setLangOpen(false);
                  }}
                >
                  🇺🇿 O'zbek
                </button>
                <button
                  onClick={() => {
                    setLanguage("ru");
                    setLangOpen(false);
                  }}
                >
                  🇷🇺 Русский
                </button>
              </div>
            )}
          </div>

          <button className="icon-btn">
            <FontAwesomeIcon icon={faCog} />
          </button>

          <button className="icon-btn">
            <FontAwesomeIcon icon={faBolt} />
          </button>

          <div className="relative" ref={notificationRef}>
            <button className="icon-btn notification" onClick={() => setNotificationOpen(!isNotificationOpen)}>
              <FontAwesomeIcon icon={faBell} />
              <span className="badge">3</span>
            </button>
            {isNotificationOpen && (
              <div className="dropdown">
                <p>📩 You have 3 new notifications!</p>
              </div>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button className="avatar" onClick={() => setMenuOpen(!isMenuOpen)}>
              <img src="avatar.jpg" alt="User Avatar" />
            </button>
            {isMenuOpen && (
              <div className="dropdown">
                <button>👤 Profile</button>
                <button onClick={logout}>🔓 Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
