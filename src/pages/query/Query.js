import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Query.css";

const Query = ({ selectedDb }) => {
  const [queryText, setQueryText] = useState(() => localStorage.getItem("queryText") || "");
  const [similarityMetric, setSimilarityMetric] = useState(() => localStorage.getItem("similarityMetric") || "cosine");
  const [results, setResults] = useState(() => JSON.parse(localStorage.getItem("results")) || []);
  const [ipAddress] = useState(() => localStorage.getItem("ipAddress") || "127.0.0.1");
  const [isLoading] = useState(false);
  const [progress] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!selectedDb) {
  //     alert("No database selected. Please select a database first.");
  //   }
  // }, [selectedDb, navigate]);

  useEffect(() => {
    localStorage.setItem("queryText", queryText);
  }, [queryText]);

  useEffect(() => {
    localStorage.setItem("similarityMetric", similarityMetric);
  }, [similarityMetric]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("ipAddress", ipAddress);
  }, [ipAddress]);

  useEffect(() => {
    localStorage.setItem("selectedDb", JSON.stringify(selectedDb));
  }, [selectedDb]);

  const handleQuery = async () => {
    if (!selectedDb) {
      alert("No database selected. Please select a database first.");
    navigate('/embed');

      return;
    }

    try {
      const response = await fetch(`http://${ipAddress}:4000/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query_text: queryText, similarity_metric: similarityMetric, db_filename: selectedDb.name }),
      });
      const results = await response.json();
      if (response.ok) {
        console.log("Query results:", results);
        setResults(results);
      } else {
        alert(results.error);
      }
    } catch (error) {
      console.error("Error querying database:", error);
    }
  };

  const displayFullData = (data) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-inspect-button">&times;</span>
        <pre class="result-details">${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    const closeButton = modal.querySelector(".close-inspect-button");
    closeButton.addEventListener("click", () => {
      modal.remove();
    });
    document.body.appendChild(modal);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        modal.remove();
      }
    });
  };

  const displayResults = () => {
    return (
      <div className="carousel">
        {results.map((result, index) => {
          const [doc, fullData, score] = result;
          return (
            <div key={index} className="query-result-card" onClick={() => displayFullData(fullData)}>
              <div className="result-header">
                <h3>Score: {score.toFixed(2)}</h3>
              </div>
              <div className="result-content">
                <p><strong>Title:</strong> {doc.title}</p>
                <p><strong>Overview:</strong> {doc.overview}</p>
                <p><strong>Release Date:</strong> {doc.release_date}</p>
                <p><strong>Popularity:</strong> {doc.popularity}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section id="query">
      <h2>Query Vector Database</h2>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}>
        <input
          type="text"
          id="queryInput"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Enter your query"
        />
        <select id="similarityMetric" className="button" value={similarityMetric} onChange={(e) => setSimilarityMetric(e.target.value)}>
          <option value="cosine">Cosine Similarity</option>
          <option value="euclidean">Euclidean Distance</option>
        </select>
      </div>
      <button id="queryButton" className="button" onClick={handleQuery}>
        Submit
      </button>
      {isLoading && (
        <div style={{ width: "100px", margin: "20px auto" }}>
          <CircularProgressbar
            value={progress}
            text={`${progress.toFixed(2)}%`}
            styles={buildStyles({
              textColor: "black",
              pathColor: "blue",
              trailColor: "gray",
            })}
          />
        </div>
      )}
      <div id="resultsContainer">{displayResults()}</div>
    </section>
  );
};

export default Query;
