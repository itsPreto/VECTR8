import React, { useState } from "react";

const Query = () => {
  const [queryText, setQueryText] = useState("");
  const [similarityMetric, setSimilarityMetric] = useState("cosine");
  const [results, setResults] = useState([]);

  const handleQuery = async () => {
    try {
      const response = await fetch('http://10.0.0.252:4000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query_text: queryText, similarity_metric: similarityMetric })
      });
      const results = await response.json();
      if (response.ok) {
        console.log("Query results:", results);
        setResults(results);
      } else {
        alert(results.error);
      }
    } catch (error) {
      console.error('Error querying database:', error);
    }
  };

  const displayResults = () => {
    return results.map(result => {
      const [doc, fullData, score] = result;
      return (
        <div key={doc} className="result-card">
          <div className="result-header">
            <h3>Score: {score.toFixed(2)}</h3>
            <button className="inspect-button button" onClick={() => displayFullData(fullData)}>Inspect</button>
          </div>
          <p>{doc}</p>
        </div>
      );
    });
  };

  const displayFullData = (data) => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;

    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      modal.remove();
    });

    document.body.appendChild(modal);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        modal.remove();
      }
    });
  };

  return (
    <section id="query">
      <h2 style={{ textAlign: "center" }}>Query Vector Database</h2>
      <input type="text" id="queryInput" value={queryText} onChange={e => setQueryText(e.target.value)} placeholder="Enter your query" />
      <select id="similarityMetric" className="button" value={similarityMetric} onChange={e => setSimilarityMetric(e.target.value)}>
        <option value="cosine">Cosine Similarity</option>
        <option value="euclidean">Euclidean Distance</option>
      </select>
      <button id="queryButton" className="button" onClick={handleQuery}>Submit</button>
      <div id="resultsContainer">
        {displayResults()}
      </div>
    </section>
  );
};

export default Query;
