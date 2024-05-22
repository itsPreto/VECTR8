import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavbarHook from "./NavbarHook/NavbarHook";
import Upload from "./pages/Upload";
import Preview from "./pages/preview/Preview";
import Embed from "./pages/embed/Embed";
import Query from "./pages/query/Query";
import TransitionWrapper from "./transition/Transition";
import './App.css';

const AppRoutes = ({ handleRouteChange, direction }) => {
  const location = useLocation();

  return (
    <TransitionWrapper direction={direction}>
      <Routes location={location}>
        <Route path="/" element={<Upload onPreviewData={handleRouteChange} />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/embed" element={<Embed />} />
        <Route path="/query" element={<Query />} />
      </Routes>
    </TransitionWrapper>
  );
};

const App = () => {
  const [previewData, setPreviewData] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [navigationDirection, setNavigationDirection] = useState('forward');

  const handlePreviewData = (data, path) => {
    setPreviewData(data);
    setFilePath(path);
    setSelectedKeys(data.keys || []);
  };

  const determineDirection = (currentPath, nextPath) => {
    const paths = ['/', '/preview', '/embed', '/query'];
    const currentIndex = paths.indexOf(currentPath);
    const nextIndex = paths.indexOf(nextPath);

    return nextIndex > currentIndex ? 'forward' : 'backward';
  };

  const handleRouteChange = (nextPath) => {
    const currentPath = window.location.pathname;
    const direction = determineDirection(currentPath, nextPath);
    setNavigationDirection(direction);
  };

  return (
    <Router>
      <NavbarHook selectedKeys={selectedKeys} filePath={filePath} onRouteChange={handleRouteChange} />
      <main className="main-content">
        <AppRoutes handleRouteChange={handlePreviewData} direction={navigationDirection} />
      </main>
    </Router>
  );
};

export default App;
