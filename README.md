<h1 align="center">VECT.R8 (Vector Embeddings Creation, Transformation & Retrieval) 🚀</h1>

<p align="center">
  <img src="./src/assets/logo.png" alt="logo" />
</p>

<h3 align="center">
  A Web UI where you can upload CSV/JSON files, create vector embeddings, and query them. Soon, you'll be able to convert unstructured data to JSON/CSV using an integrated LLM.
</h3>

<p align="center">
  <img src="https://github.com/itsPreto/VECTR8/assets/45348368/200c084c-443b-4206-b88d-931c38cf40d6" alt="VECTR8-demo-ezgif com-video-to-gif-converter" />
</p>

<div align="center">
  <font size=”1”>
  <strong font size=”1”">Project under heavy/active development [may be] unstable. Embeddings and Query pages WIP ⚠️</strong>
  </font>
</div>

<h2 align="center">Table of Contents</h2>

<div align="center">
  <table>
    <tr>
      <th>Section</th>
      <th>Links</th>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#prerequisites">Prerequisites</a></td>
      <td>
        <ul style="list-style-type:none; padding: 0;">
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#python-37">Python 3.7+</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#flask">Flask</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#flask-cors">Flask-CORS</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#transformers">transformers</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#torch">torch</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#numpy">numpy</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#pandas">pandas</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#installation">Installation</a></td>
      <td></td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#running-the-application">Running the Application</a></td>
      <td></td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#uploading-files-">Uploading Files 📂</a></td>
      <td>
        <ul style="list-style-type:none; padding: 0;">
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line">Command Line</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#previewing-data-">Previewing Data 🧐</a></td>
      <td>
        <ul style="list-style-type:none; padding: 0;">
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-1">Command Line</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#creating-vector-embeddings-">Creating Vector Embeddings 🧩</a></td>
      <td>
        <ul style="list-style-type:none; padding: 0;">
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-2">Command Line</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#querying-the-vector-database-">Querying the Vector Database 🔍</a></td>
      <td>
        <ul style="list-style-type:none; padding: 0;">
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-3">Command Line</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#managing-the-vector-database-">Managing the Vector Database 🛠️</a></td>
      <td>
        <ul style="list-style-type:none; padding: 0;">
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-4">Command Line</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#ui-walkthrough-">UI Walkthrough 🎨</a></td>
      <td>
        <ul style="list-style-type:none; padding: 0;">
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#uploading-files-1">Uploading Files</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#previewing-data-1">Previewing Data</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#creating-vector-embeddings-1">Creating Vector Embeddings</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#querying-the-vector-database-1">Querying the Vector Database</a></li>
          <li><a href="https://github.com/itsPreto/VECTR8/blob/main/README.md#managing-the-vector-database-1">Managing the Vector Database</a></li>
        </ul>
      </td>
    </tr>
  </table>
</div>

-----

<h2 align="center">Prerequisites</h2>

<div align="center">
  <table>
    <tr>
      <th>Requirement</th>
      <th>Description</th>
    </tr>
    <tr>
      <td><img src="https://img.icons8.com/color/24/000000/python.png" alt="Python"> <strong>Python 3.7+</strong></td>
      <td>The application requires Python 3.7 or higher to leverage modern libraries and syntax.</td>
    </tr>
    <tr>
      <td><img src="https://img.icons8.com/color/24/000000/chemical-plant.png" alt="flask icon"> <strong>Flask</strong></td>
      <td>Essential for running embedding models. Utilized by transformers.</td>
    </tr>
    <tr>
      <td><img src="https://img.icons8.com/color/24/000000/globe.png" alt="Flask-CORS"> <strong>Flask-CORS</strong></td>
      <td>Enables CORS for frontend-backend communication.</td>
    </tr>
    <tr>
      <td><img src="https://img.icons8.com/color/24/000000/robot-2.png" alt="transformers"> <strong>transformers</strong></td>
      <td>Used for creating vector embeddings with pre-trained models.</td>
    </tr>
    <tr>
      <td><img src="https://img.icons8.com/color/24/000000/fire-element.png" alt="fire icon"> <strong>torch</strong></td>
      <td>Essential for running embedding models. Utilized by transformers.</td>
    </tr>
    <tr>
      <td><img src="https://img.icons8.com/color/24/000000/calculator.png" alt="numpy"> <strong>numpy</strong></td>
      <td>Handles arrays and mathematical operations. Used throughout the application.</td>
    </tr>
    <tr>
      <td><img src="https://img.icons8.com/color/24/000000/data-sheet.png" alt="pandas"> <strong>pandas</strong></td>
      <td>Processes CSV and JSON files. Utilized throughout the application.</td>
    </tr>
  </table>
</div>
<h2 align="center">Installation</h2>

<div align="center">
  <table>
    <tr>
      <th>Step</th>
      <th>Instructions</th>
    </tr>
    <tr>
      <td>Clone the repository</td>
      <td><pre><code>git clone https://github.com/itsPreto/VECTR8.git
cd VECTR8</code></pre></td>
    </tr>
    <tr>
      <td>Install the required packages</td>
      <td><pre><code>pip install -r requirements.txt</code></pre></td>
    </tr>
  </table>
</div>

<h2 align="center">Running the Application</h2>

<div align="center">
  <table>
    <tr>
      <th>Step</th>
      <th>Instructions</th>
    </tr>
    <tr>
      <td>Start the Flask server</td>
      <td><pre><code>python3 rag.py</code></pre></td>
    </tr>
    <tr>
      <td>Open your web browser</td>
      <td>Navigate to <code>http://127.0.0.1:4000</code></td>
    </tr>
  </table>
</div>

<h2 align="center">Uploading Files 📂</h2>

<div align="center">
  <table>
    <tr>
      <th>Step</th>
      <th>Instructions</th>
    </tr>
    <tr>
      <td>Drag and Drop a File</td>
      <td>Drag and drop a CSV or JSON file into the upload area or click to select a file from your computer.</td>
    </tr>
    <tr>
      <td>View Uploaded File Information</td>
      <td>Once uploaded, the file information such as name and size will be displayed.</td>
    </tr>
  </table>
  <h3>Command Line</h3>
  <p>To upload a file using <code>curl</code>:</p>
  <pre><code>curl -X POST -F 'file=@/path/to/your/file.csv' http://127.0.0.1:4000/upload_file</code></pre>
</div>

<h2 align="center">Previewing Data 🧐</h2>

<div align="center">
  <table>
    <tr>
      <th>Step</th>
      <th>Instructions</th>
    </tr>
    <tr>
      <td>Select Embedding Keys</td>
      <td>After uploading a file, select the keys (columns) you want to include in the embeddings.</td>
    </tr>
    <tr>
      <td>Preview Document</td>
      <td>View a preview of the document created from the selected keys.</td>
    </tr>
    <tr>
      <td>Preview Embeddings</td>
      <td>View the generated embeddings and token count for the selected document.</td>
    </tr>
  </table>
  <h3>Command Line</h3>
  <p>To preview a file's keys using <code>curl</code>:</p>
  <pre><code>curl -X POST -H "Content-Type: application/json" -d '{"file_path":"uploads/your-file.csv"}' http://127.0.0.1:4000/preview_file</code></pre>
  <p>To preview a document's embeddings using <code>curl</code>:</p>
  <pre><code>curl -X POST -H "Content-Type: application/json" -d '{"file_path":"uploads/your-file.csv", "selected_keys":["key1", "key2"]}' http://127.0.0.1:4000/preview_document</code></pre>
</div>

<h2 align="center">Creating Vector Embeddings 🧩</h2>

<div align="center">
  <table>
    <tr>
      <th>Step</th>
      <th>Instructions</th>
    </tr>
    <tr>
      <td>Start Embedding Creation</td>
      <td>Click the "Create Vector DB" button to start the embedding creation process.</td>
    </tr>
    <tr>
      <td>View Progress</td>
      <td>Monitor the progress of the embedding creation with a circular progress indicator. 📈</td>
    </tr>
  </table>
  <h3>Command Line</h3>
  <p>To create a vector database using <code>curl</code>:</p>
  <pre><code>curl -X POST -H "Content-Type: application/json" -d '{"file_path":"uploads/your-file.csv", "selected_keys":["key1", "key2"]}' http://127.0.0.1:4000/create_vector_database</code></pre>
</div>

<h2 align="center">Querying the Vector Database 🔍</h2>

<div align="center">
  <table>
    <tr>
      <th>Step</th>
      <th>Instructions</th>
    </tr>
    <tr>
      <td>Enter Query</td>
      <td>Type your query into the input field.</td>
    </tr>
    <tr>
      <td>Select Similarity Metric</td>
      <td>Choose between cosine similarity or Euclidean distance.</td>
    </tr>
    <tr>
      <td>Submit Query</td>
      <td>Click the "Submit" button to query the vector database.</td>
    </tr>
    <tr>
      <td>View Results</td>
      <td>Inspect the results, which display the document, score, and a button to view detailed data.</td>
    </tr>
  </table>
  <h3>Command Line</h3>
  <p>To query the vector database using <code>curl</code>:</p>
  <pre><code>curl -X POST -H "Content-Type: application/json" -d '{"query_text":"Your query text here", "similarity_metric":"cosine"}' http://127.0.0.1:4000/query</code></pre>
</div>

<h2 align="center">Managing the Vector Database 🛠️</h2>

<div align="center">
  <table>
    <tr>
      <th>Step</th>
      <th>Instructions</th>
    </tr>
    <tr>
      <td>Backup Database</td>
      <td>Click the "Backup Database" button to create a backup of the current vector database.</td>
    </tr>
    <tr>
      <td>Delete Database</td>
      <td>Click the "Delete Database" button to delete the current vector database.</td>
    </tr>
    <tr>
      <td>View Database Statistics</td>
      <td>View statistics such as total documents and average vector length.</td>
    </tr>
  </table>
  <h3>Command Line</h3>
  <p>To check if the vector database exists using <code>curl</code>:</p>
  <pre><code>curl -X GET http://127.0.0.1:4000/check_vector_db</code></pre>
  <p>To view database statistics using <code>curl</code>:</p>
  <pre><code>curl -X GET http://127.0.0.1:4000/db_stats</code></pre>
  <p>To backup the database using <code>curl</code>:</p>
  <pre><code>curl -X POST http://127.0.0.1:4000/backup_db</code></pre>
  <p>To delete the database using <code>curl</code>:</p>
  <pre><code>curl -X POST http://127.0.0.1:4000/delete_db</code></pre>
</div>

<h2 align="center">UI Walkthrough 🎨</h2>

<div align="center">
  <table>
    <tr>
      <th>Feature</th>
      <th>Description</th>
    </tr>
    <tr>
      <td><strong>Uploading Files</strong></td>
      <td>
        <ul>
          <li>Drag and drop a file into the upload area or click to select a file.</li>
          <li>File information will be displayed after a successful upload.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>Previewing Data</strong></td>
      <td>
        <ul>
          <li>Select the keys you want to include in the embeddings.</li>
          <li>View a preview of the document and generated embeddings.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>Creating Vector Embeddings</strong></td>
      <td>
        <ul>
          <li>Click the "Create Vector DB" button to start the embedding creation.</li>
          <li>Monitor the progress with the circular progress indicator.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>Querying the Vector Database</strong></td>
      <td>
        <ul>
          <li>Enter your query text and select a similarity metric.</li>
          <li>Click "Submit" to query the database and view the results.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>Managing the Vector Database</strong></td>
      <td>
        <ul>
          <li>Backup the database by clicking "Backup Database".</li>
          <li>Delete the database by clicking "Delete Database".</li>
          <li>View database statistics such as total documents and average vector length.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

