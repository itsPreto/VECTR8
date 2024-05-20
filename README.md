<h1 style="text-align: center;">Vect.r8 (Vector Embeddings Creation, Transformation & Retrieval) 🚀</h1>

<p align="center">
  <img src="./src/assets/logo.png" alt="logo" />
</p>

<p align="center">
  A Web UI where you can upload CSV/JSON files, create vector embeddings, and query them. Soon, you'll be able to convert unstructured data to JSON/CSV using an integrated LLM.
</p>

> **Note:** This project is under heavy active development and may be unstable. ⚠️

## Table of Contents

1. [Prerequisites](https://github.com/itsPreto/VECTR8/blob/main/README.md#prerequisites)
    - [Python 3.7+](https://github.com/itsPreto/VECTR8/blob/main/README.md#python-37)
    - [Flask](https://github.com/itsPreto/VECTR8/blob/main/README.md#flask)
    - [Flask-CORS](https://github.com/itsPreto/VECTR8/blob/main/README.md#flask-cors)
    - [transformers](https://github.com/itsPreto/VECTR8/blob/main/README.md#transformers)
    - [torch](https://github.com/itsPreto/VECTR8/blob/main/README.md#torch)
    - [numpy](https://github.com/itsPreto/VECTR8/blob/main/README.md#numpy)
    - [pandas](https://github.com/itsPreto/VECTR8/blob/main/README.md#pandas)
2. [Installation](https://github.com/itsPreto/VECTR8/blob/main/README.md#installation)
3. [Running the Application](https://github.com/itsPreto/VECTR8/blob/main/README.md#running-the-application)
4. [Uploading Files 📂](https://github.com/itsPreto/VECTR8/blob/main/README.md#uploading-files-)
    - [Command Line](https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line)
5. [Previewing Data 🧐](https://github.com/itsPreto/VECTR8/blob/main/README.md#previewing-data-)
    - [Command Line](https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-1)
6. [Creating Vector Embeddings 🧩](https://github.com/itsPreto/VECTR8/blob/main/README.md#creating-vector-embeddings-)
    - [Command Line](https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-2)
7. [Querying the Vector Database 🔍](https://github.com/itsPreto/VECTR8/blob/main/README.md#querying-the-vector-database-)
    - [Command Line](https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-3)
8. [Managing the Vector Database 🛠️](https://github.com/itsPreto/VECTR8/blob/main/README.md#managing-the-vector-database-)
    - [Command Line](https://github.com/itsPreto/VECTR8/blob/main/README.md#command-line-4)
9. [UI Walkthrough 🎨](https://github.com/itsPreto/VECTR8/blob/main/README.md#ui-walkthrough-)
    - [Uploading Files](https://github.com/itsPreto/VECTR8/blob/main/README.md#uploading-files-1)
    - [Previewing Data](https://github.com/itsPreto/VECTR8/blob/main/README.md#previewing-data-1)
    - [Creating Vector Embeddings](https://github.com/itsPreto/VECTR8/blob/main/README.md#creating-vector-embeddings-1)
    - [Querying the Vector Database](https://github.com/itsPreto/VECTR8/blob/main/README.md#querying-the-vector-database-1)
    - [Managing the Vector Database](https://github.com/itsPreto/VECTR8/blob/main/README.md#managing-the-vector-database-1)

-----


https://github.com/itsPreto/VECTR8/assets/45348368/e9a73466-e103-4e92-af76-3dd69e5057cd


## Prerequisites
### Python 3.7+
The application requires Python 3.7+.
## Prerequisites

### Python 3.7+
The application requires Python 3.7 or higher to leverage modern libraries and syntax. 🐍

### Flask
Flask creates the web server for the UI. 🌐

### Flask-CORS
Enables CORS for frontend-backend communication. 🌍

### transformers
Used for creating vector embeddings with pre-trained models. 🤖

### torch
Essential for running embedding models. Utilized by transformers. 🔥

### numpy
Handles arrays and mathematical operations. Used throughout the application. 🧮

### pandas
Processes CSV and JSON files. Utilized throughout the application. 📊

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/itsPreto/VECTR8.git
    cd VECTR8
    ```
2. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

## Running the Application

1. Start the Flask server:
    ```sh
    python3 rag.py
    ```
2. Open your web browser and navigate to `http://127.0.0.1:4000`.

## Uploading Files 📂

1. **Drag and Drop a File**: Drag and drop a CSV or JSON file into the upload area or click to select a file from your computer.
2. **View Uploaded File Information**: Once uploaded, the file information such as name and size will be displayed.

### Command Line

To upload a file using `curl`:
```sh
curl -X POST -F 'file=@/path/to/your/file.csv' http://127.0.0.1:4000/upload_file
```

## Previewing Data 🧐

1. **Select Embedding Keys**: After uploading a file, select the keys (columns) you want to include in the embeddings.
2. **Preview Document**: View a preview of the document created from the selected keys.
3. **Preview Embeddings**: View the generated embeddings and token count for the selected document.

### Command Line

To preview a file's keys using `curl`:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"file_path":"uploads/your-file.csv"}' http://127.0.0.1:4000/preview_file`
```

To preview a document's embeddings using `curl`:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"file_path":"uploads/your-file.csv", "selected_keys":["key1", "key2"]}' http://127.0.0.1:4000/preview_document`
```

## Creating Vector Embeddings 🧩

1. **Start Embedding Creation**: Click the "Create Vector DB" button to start the embedding creation process.
2. **View Progress**: Monitor the progress of the embedding creation with a circular progress indicator. 📈

### Command Line

To create a vector database using `curl`:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"file_path":"uploads/your-file.csv", "selected_keys":["key1", "key2"]}' http://127.0.0.1:4000/create_vector_database`
```

## Querying the Vector Database 🔍

1. **Enter Query**: Type your query into the input field.
2. **Select Similarity Metric**: Choose between cosine similarity or Euclidean distance.
3. **Submit Query**: Click the "Submit" button to query the vector database.
4. **View Results**: Inspect the results, which display the document, score, and a button to view detailed data.

### Command Line

To query the vector database using `curl`:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"query_text":"Your query text here", "similarity_metric":"cosine"}' http://127.0.0.1:4000/query`
```

## Managing the Vector Database 🛠️

1. **Backup Database**: Click the "Backup Database" button to create a backup of the current vector database.
2. **Delete Database**: Click the "Delete Database" button to delete the current vector database.
3. **View Database Statistics**: View statistics such as total documents and average vector length.

### Command Line

To check if the vector database exists using `curl`:

```sh
curl -X GET http://127.0.0.1:4000/check_vector_db`
```

To view database statistics using `curl`:

```sh
curl -X GET http://127.0.0.1:4000/db_stats`
```

To backup the database using `curl`:

```sh
curl -X POST http://127.0.0.1:4000/backup_db`
```

To delete the database using `curl`:

```sh
curl -X POST http://127.0.0.1:4000/delete_db`
```

## UI Walkthrough 🎨

### Uploading Files

- Drag and drop a file into the upload area or click to select a file.
- File information will be displayed after a successful upload.

### Previewing Data

- Select the keys you want to include in the embeddings.
- View a preview of the document and generated embeddings.

### Creating Vector Embeddings

- Click the "Create Vector DB" button to start the embedding creation.
- Monitor the progress with the circular progress indicator.

### Querying the Vector Database

- Enter your query text and select a similarity metric.
- Click "Submit" to query the database and view the results.

### Managing the Vector Database

- Backup the database by clicking "Backup Database".
- Delete the database by clicking "Delete Database".
- View database statistics such as total documents and average vector length.
