import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarHook from "./NavbarHook/NavbarHook";
import Upload from "./pages/Upload";
import Preview from "./pages/preview/Preview";
import Embed from "./pages/embed/Embed";
import Query from "./pages/query/Query";
import TransitionWrapper from "./transition/Transition";
import './App.css';

const App = () => {
  const [previewData, setPreviewData] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]); // Add state for selected keys

  const handlePreviewData = (data, path) => {
    setPreviewData(data);
    setFilePath(path);
    setSelectedKeys(data.keys || []); // Set selected keys from preview data
  };

  return (
    <Router>
      <NavbarHook selectedKeys={selectedKeys} filePath={filePath} />
      <main className="main-content">
        <TransitionWrapper>
          <Routes>
            <Route path="/" element={<Upload onPreviewData={handlePreviewData} />} />
            <Route path="/preview" element={<Preview previewData={previewData} filePath={filePath} />} />
            <Route
              path="/embed"
              element={<Embed selectedKeys={selectedKeys} filePath={filePath} />}
            />
            <Route path="/query" element={<Query />} />
          </Routes>
        </TransitionWrapper>
      </main>
    </Router>
  );
};

export default App;
