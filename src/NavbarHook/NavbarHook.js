import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import "./NavbarHook.css";

const NavbarHook = ({ selectedKeys, filePath, onRouteChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: "1150px" });
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleNavLinkClick = (path) => {
    // onRouteChange(path);
    navigate(path);
    closeMobileMenu();
  };

  const renderNavLinks = () => {
    const listClassName = isMobile ? "nav__list" : "nav__list__web";
    const linkClassName = "nav__link";
    const buttonClassName = "nav__cta";

    return (
      <ul className={listClassName}>
        <li>
          <NavLink to="/" className={linkClassName} onClick={() => handleNavLinkClick('/')}>
            Upload
          </NavLink>
        </li>
        <li>
          <NavLink to="/preview" className={linkClassName} onClick={() => handleNavLinkClick('/preview')}>
            Preview
          </NavLink>
        </li>
        <li>
          <NavLink to="/embed" className={linkClassName} onClick={() => handleNavLinkClick('/embed')}>
            Embeddings
          </NavLink>
        </li>
        <li>
          <NavLink to="/query" className={linkClassName} onClick={() => handleNavLinkClick('/query')}>
            Query
          </NavLink>
        </li>
      </ul>
    );
  };

  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo" style={{ paddingTop: "0px", paddingRight: "46px", paddingBottom: "0px", paddingLeft: "46px", color: "#1bcaff", backgroundColor: '#333333' }}>
          VECT.R8
        </NavLink>

        {isMobile && (
          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <IoMenu />
          </div>
        )}

        {isMobile ? (
          <div
            className={`nav__menu  ${isMenuOpen ? "show-menu" : ""}`}
            id="nav-menu"
          >
            {renderNavLinks()}
            <div className="nav__close" id="nav-close" onClick={toggleMenu}>
              <IoClose />
            </div>
          </div>
        ) : (
          renderNavLinks()
        )}
      </nav>
    </header>
  );
};

export default NavbarHook;
