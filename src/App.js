import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarHook from "./NavbarHook/NavbarHook";
import Upload from "./pages/Upload";
import Preview from "./pages/preview/Preview";
import Embed from "./pages/Embed";
import Query from "./pages/Query";
import './App.css';

const App = () => {
  const [previewData, setPreviewData] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const handlePreviewData = (data, path) => {
    setPreviewData(data);
    setFilePath(path); // Set file path
  };

  return (
    <Router>
      <NavbarHook />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Upload onPreviewData={handlePreviewData} />} />
          <Route path="/preview" element={<Preview previewData={previewData} filePath={filePath} />} />
          <Route path="/embed" element={<Embed />} />
          <Route path="/query" element={<Query />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
