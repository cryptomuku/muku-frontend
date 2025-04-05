import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleHomeClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">MyWebsite</h1>
        <div className="nav-menu">
          <button className="nav-button" onClick={handleHomeClick}>
            Home
          </button>
          <button className="nav-button" onClick={handleLoginClick}>
            Log In
          </button>
        </div>
        <button className="nav-toggle" onClick={toggleMenu}>
          <span className={isOpen ? "toggle-icon open" : "toggle-icon"}></span>
        </button>
      </div>
      {isOpen && (
        <div className="mobile-menu">
          <button className="nav-button mobile-button" onClick={handleHomeClick}>
            Home
          </button>
          <button className="nav-button mobile-button" onClick={handleLoginClick}>
            Log In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;