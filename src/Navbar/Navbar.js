import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Navbar.css";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          Navigation Bar
        </NavLink>

        <div
          className={`nav__menu ${showMenu ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className="nav__link" onClick={toggleMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/news" className="nav__link" onClick={toggleMenu}>
                News
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/about-us"
                className="nav__link"
                onClick={toggleMenu}
              >
                About Us
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/favourites"
                className="nav__link"
                onClick={toggleMenu}
              >
                Favourites
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/location"
                className="nav__link"
                onClick={toggleMenu}
              >
                Location
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/get-started" className="nav__link nav__cta">
                Get Started
              </NavLink>
            </li>
          </ul>
          <div className="nav__close" id="nav-close" onClick={toggleMenu}>
            <IoClose />
          </div>
        </div>

        <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
          <IoMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { IoClose, IoMenu } from "react-icons/io5";
// import { useMediaQuery } from "react-responsive";
// import "./Navbar.css";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const isMobile = useMediaQuery({ maxWidth: "1150px" });

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <header className="header">
//       <nav className="nav container">
//         <NavLink to="/" className="nav__logo">
//           Navigation Bar
//         </NavLink>

//         {isMobile && (
//           <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
//             <IoMenu />
//           </div>
//         )}

//         <div
//           className={`nav__menu  ${isMenuOpen && isMobile ? "show-menu" : ""}`}
//           id="nav-menu"
//         >
//           <ul className="nav__list">
//             <li className="nav__item">
//               <NavLink to="/" className="nav__link" onClick={toggleMenu}>
//                 Home
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink to="/news" className="nav__link" onClick={toggleMenu}>
//                 News
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/about-us"
//                 className="nav__link"
//                 onClick={toggleMenu}
//               >
//                 About Us
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/favourites"
//                 className="nav__link"
//                 onClick={toggleMenu}
//               >
//                 Favourites
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/location"
//                 className="nav__link"
//                 onClick={toggleMenu}
//               >
//                 Location
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/get-started"
//                 className="nav__link nav__cta"
//                 onClick={toggleMenu}
//               >
//                 Get Started
//               </NavLink>
//             </li>
//           </ul>
//           {isMobile && (
//             <div className="nav__close" id="nav-close" onClick={toggleMenu}>
//               <IoClose />
//             </div>
//           )}
//         </div>

//         {!isMobile && (
//           <ul className="nav__listt">
//             <li className="nav__item">
//               <NavLink to="/" className="nav__link" onClick={toggleMenu}>
//                 Home
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink to="/news" className="nav__link" onClick={toggleMenu}>
//                 News
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/about-us"
//                 className="nav__link"
//                 onClick={toggleMenu}
//               >
//                 About Us
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/favourites"
//                 className="nav__link"
//                 onClick={toggleMenu}
//               >
//                 Favourites
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/location"
//                 className="nav__link"
//                 onClick={toggleMenu}
//               >
//                 Location
//               </NavLink>
//             </li>
//             <li className="nav__item">
//               <NavLink
//                 to="/get-started"
//                 className="nav__link nav__cta"
//                 onClick={toggleMenu}
//               >
//                 Get Started
//               </NavLink>
//             </li>
//           </ul>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
