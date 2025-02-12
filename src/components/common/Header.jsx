import React, { useState } from "react";
import "./Header.scss";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ searchTerm, setSearchTerm, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("shapes");
    navigate("/login");
  };
  return (
    <header>
      <div className="app-header">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            placeholder="Search polygons"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <FaMapMarkerAlt />
          </button>
        </div>

        <div
          className="user-info"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            className="user-icon"
            src={`https://robohash.org/${user.email}?size=50x50`}
            alt="User Icon"
          />
          <span className="user-name">{user.name} </span>
          <FaChevronDown
            className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}
          />

          {dropdownOpen && (
            <div className="dropdown">
              <button className="logout-button" onClick={() => logout()}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
