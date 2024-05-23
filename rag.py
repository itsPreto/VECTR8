import subprocess
from flask import Flask, request, jsonify, stream_with_context, Response
from flask_cors import CORS
from transformers import GPT2Tokenizer
import logging
import torch
import numpy as np
import gzip
import pickle
import json
import os
import pandas as pd
import time
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_react_app():
    subprocess.Popen(["npm", "start"])

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

client = OpenAI(base_url="http://localhost:8081/v1", api_key="lm-studio")
chat_history = []
current_progress = 0
library = None
db_filename = None

class MBedFastAF:
    def __init__(self, model_name, similarity_metric='cosine'):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
        self.documents = []
        self.full_data = []  # Store full data for each document
        self.vectors = np.array([])
        self.tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        self.set_similarity_metric(similarity_metric)

    def set_similarity_metric(self, metric):
        metrics = {
            'cosine': self.cosine_similarity,
            'euclidean': self.euclidean_metric
        }
        if metric in metrics:
            self.similarity_metric = metrics[metric]
        else:
            raise ValueError(f"Unsupported similarity metric '{metric}'")

    def add_documents(self, documents, full_data):
        global current_progress
        total_docs = len(documents)
        processed_docs = 0
        embeddings = []
        for doc, data in zip(documents, full_data):
            # Ensure doc is a dictionary before proceeding
            if not isinstance(doc, dict):
                raise ValueError('Document must be a dictionary.')

            # Concatenate all values in the dictionary to create a single string
            doc_text = " ".join(str(value) for value in doc.values())
            
            embedding = self.get_embedding(doc_text)
            embeddings.append(embedding)
            self.full_data.append(data)
            processed_docs += 1
        embeddings = np.vstack(embeddings)
        self.documents.extend(documents)
        if self.vectors.size == 0:
            self.vectors = embeddings
        else:
            self.vectors = np.vstack((self.vectors, embeddings))


    def get_embedding(self, text):
        text = text.replace("\n", " ")
        response = client.embeddings.create(input=[text], model="nomic-ai/nomic-embed-text-v1.5-GGUF")
        return response.data[0].embedding

    def get_embeddings(self, documents):
        embeddings = [self.get_embedding(doc) for doc in documents]
        return np.array(embeddings)

    def query(self, query_document, top_k=5):
        query_vector = self.get_embeddings([query_document])[0]
        similarities = self.similarity_metric(self.vectors, query_vector)
        top_indices = np.argsort(similarities)[::-1]

        unique_documents = {}
        results = []
        for index in top_indices:
            doc_id = self.documents[index]
            doc_id_str = str(doc_id)  # Convert doc_id to a string
            if doc_id_str not in unique_documents:
                unique_documents[doc_id_str] = True
                results.append((self.documents[index], self.full_data[index], similarities[index]))
                if len(results) >= top_k:
                    break

        return results

    @staticmethod
    def cosine_similarity(vectors, query_vector):
        vectors_norm = np.linalg.norm(vectors, axis=1)
        query_norm = np.linalg.norm(query_vector)
        return np.dot(vectors, query_vector) / (vectors_norm * query_norm)

    @staticmethod
    def euclidean_metric(vectors, query_vector):
        distances = np.linalg.norm(vectors - query_vector, axis=1)
        return 1 / (1 + distances)

    def save(self, filename):
        with gzip.open(filename, 'wb') as f:
            data = {'documents': self.documents, 'full_data': self.full_data, 'vectors': self.vectors}
            pickle.dump(data, f)

    def load(self, filename):
        with gzip.open(filename, 'rb') as f:
            data = pickle.load(f)
            self.documents = data['documents']
            self.full_data = data['full_data']
            self.vectors = data['vectors']

db_path = os.path.join(os.path.dirname(__file__), 'public', 'databases')

def extract_keys_from_json(data, parent_key=''):
    keys = {}
    if isinstance(data, list):
        for item in data:
            keys.update(extract_keys_from_json(item, parent_key))
    elif isinstance(data, dict):
        for k, v in data.items():
            full_key = f"{parent_key}.{k}" if parent_key else k
            if isinstance(v, (dict, list)):
                keys.update(extract_keys_from_json(v, full_key))
            else:
                keys[full_key] = type(v).__name__
    return keys

def trim_chat_history():
    total_tokens = sum(len(message['content'].split()) for message in chat_history)
    while total_tokens > 2000:
        removed_message = chat_history.pop(0)
        total_tokens -= len(removed_message['content'].split())

def extract_texts_from_csv(df, keys):
    documents = []
    for _, row in df.iterrows():
        doc = {}
        for key in keys:
            if key in row:
                doc[key] = str(row[key])
            else:
                return jsonify({'error': f'Column "{key}" not found in CSV file'}), 400
        documents.append(doc)
    return documents

def extract_texts_from_json(data, keys):
    documents = []
    for item in data:
        doc = {}
        for key in keys:
            parts = key.split('.')
            value = item
            try:
                for part in parts:
                    value = value[part]
                doc[key] = value
            except (KeyError, TypeError):
                doc[key] = None
        documents.append(doc)
    return documents

@app.route('/preview_document', methods=['POST'])
def preview_document():
    global library
    data = request.get_json()
    file_path = data.get('file_path')
    selected_keys = data.get('selected_keys', [])

    file_path = os.path.join('./public/uploads', os.path.basename(file_path))

    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Invalid file path'}), 400

    if not selected_keys:
        return jsonify({'error': 'No keys provided'}), 400

    if library is None:
        library = MBedFastAF('nomic-ai/nomic-embed-text-v1.5-GGUF', 'euclidean')

    file_extension = os.path.splitext(file_path)[1].lower()

    documents = []
    if file_extension == '.json':
        with open(file_path, 'r') as file:
            json_data = json.load(file)
        documents = extract_texts_from_json(json_data, selected_keys)
    elif file_extension == '.csv':
        df = pd.read_csv(file_path)
        documents = extract_texts_from_csv(df, selected_keys)
    else:
        return jsonify({'error': 'Unsupported file format. Only JSON and CSV are supported.'}), 400

    if not documents:
        return jsonify({'error': 'No documents extracted'}), 400

    document = documents[0]
    print("Generated document: ", document)

    # Ensure document is a dictionary before proceeding
    if not isinstance(document, dict):
        return jsonify({'error': 'Extracted document is not a dictionary'}), 400

    document_values = " ".join(str(value) for value in document.values())
    embeddings = library.get_embeddings([document_values])
    token_count = sum([len(library.tokenizer.tokenize(doc)) for doc in [document_values]])

    return jsonify({"document": document, "embeddings": embeddings.tolist(), "token_count": token_count})

@app.route('/create_vector_database', methods=['POST'])
def create_vector_database():
    global current_progress, library
    current_progress = 0
    data = request.get_json()
    file_path = data.get('file_path')
    selected_keys = data.get('selected_keys', [])    
    
    file_path = os.path.join('./public/uploads', os.path.basename(file_path))
    
    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Invalid file path'}), 400
    
    print("File path exists: ", os.path.exists(file_path))
    print("Selected keys: ", selected_keys)
    print("File path: ", file_path)

    file_extension = os.path.splitext(file_path)[1].lower()

    documents = []
    full_data = []
    if file_extension == '.json':
        with open(file_path, 'r') as file:
            json_data = json.load(file)
        documents = extract_texts_from_json(json_data, selected_keys)
        full_data = json_data
    elif file_extension == '.csv':
        df = pd.read_csv(file_path)
        documents = extract_texts_from_csv(df, selected_keys)
        full_data = df.to_dict(orient='records')
    else:
        return jsonify({'error': 'Unsupported file format. Only JSON and CSV are supported.'}), 400

    # Extract the base name of the file (without extension) to use as the database file name
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    db_filename = os.path.join(db_path, f"{base_name}_vector_database.pkl.gz")

    print(f"Creating {db_filename} with {len(documents)} documents from the selected keys: {selected_keys}...")
    # Create a new instance of MBedFastAF
    library = MBedFastAF('nomic-ai/nomic-embed-text-v1.5-GGUF', 'euclidean')

    def generate_progress():
        global current_progress
        total_docs = len(documents)
        processed_docs = 0

        logger.info(f"Creating vector database using selected keys: {selected_keys}")

        for document, data in zip(documents, full_data):
            library.add_documents([document], [data])
            processed_docs += 1
            current_progress = processed_docs / total_docs * 100
            logger.info(f"Processed {processed_docs} out of {total_docs} documents. Progress: {current_progress:.2f}%")
            yield f"data: {current_progress:.2f}\n\n"

        library.save(db_filename)
        logger.info(f"Created vector database: {db_filename}")
        yield f"data: {db_filename}\n\n"

    return Response(stream_with_context(generate_progress()), mimetype='text/event-stream')

@app.route('/check_vector_db', methods=['GET'])
def check_vector_db():
    global db_filename
    if os.path.exists(db_filename):
        return jsonify({'message': 'Valid Vector DB found'}), 200
    else:
        return jsonify({'error': 'No Vector DB found. Please create one!'}), 404

@app.route('/db_stats', methods=['GET'])
def db_stats():
    global library, db_filename
    if not os.path.exists(db_filename):
        return jsonify({'error': 'Database not found'}), 404
    
    library.load(db_filename)
    total_documents = len(library.documents)
    avg_vector_length = np.mean([len(vector) for vector in library.vectors])
    
    return jsonify({
        'total_documents': total_documents,
        'avg_vector_length': avg_vector_length
    }), 200

@app.route('/backup_db', methods=['POST'])
def backup_db():
    global db_filename
    if not os.path.exists(db_filename):
        return jsonify({'error': 'Database not found'}), 404
    
    backup_filename = f"{db_filename}.bak"
    with open(db_filename, 'rb') as f:
        with open(backup_filename, 'wb') as backup_f:
            backup_f.write(f.read())
    
    return '', 200

@app.route('/delete_db', methods=['POST'])
def delete_db():
    global db_filename
    if os.path.exists(db_filename):
        os.remove(db_filename)
        return '', 200
    else:
        return jsonify({'error': 'Database not found'}), 404

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        file_path = os.path.join('./public/uploads/', file.filename)
        file.save(file_path)
        return jsonify({'file_path': file_path}), 200
    
@app.route('/preview_file', methods=['POST'])
def preview_file():
    data = request.get_json()
    file_path = data.get('file_path')

    # Prepend the upload directory to the file path
    file_path = os.path.join('./public/uploads', os.path.basename(file_path))

    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Invalid file path'}), 400

    file_extension = os.path.splitext(file_path)[1].lower()
    file_size = os.path.getsize(file_path)

    preview_data = {}
    if file_extension == '.json':
        with open(file_path, 'r') as file:
            json_data = json.load(file)
        preview_data = extract_keys_from_json(json_data)
    elif file_extension == '.csv':
        df = pd.read_csv(file_path)
        preview_data = list(df.columns)
    else:
        return jsonify({'error': 'Unsupported file format. Only JSON and CSV are supported.'}), 400

    return jsonify({
        'previewData': preview_data,
        'fileSize': file_size
    }), 200

@app.route('/start_tsne', methods=['POST'])
def start_tsne():
    global library, db_filename
    if not os.path.exists(db_filename):
        return jsonify({'error': 'Database not found'}), 404

    library.load(db_filename)
    vectors = library.vectors

    # Perform t-SNE in 3D
    tsne = TSNE(n_components=3, random_state=42)
    tsne_result = tsne.fit_transform(vectors)

    result = {
        'coordinates': tsne_result.tolist(),
        'documents': library.documents
    }

    # Save the t-SNE result to a file (optional)
    with open('tsne_result.json', 'w') as f:
        json.dump(result, f)

    return '', 200

@app.route('/tsne_progress', methods=['GET'])
def tsne_progress():
    if not os.path.exists('tsne_result.json'):
        return jsonify({'error': 't-SNE result not found'}), 404

    def generate_tsne_progress():
        progress = 0
        while progress < 100:
            progress += 10
            yield f"data: {progress}\n\n"
            time.sleep(1)
        with open('tsne_result.json', 'r') as f:
            result = json.load(f)
        yield f"data: {json.dumps(result)}\n\n"

    return Response(stream_with_context(generate_tsne_progress()), mimetype='text/event-stream')

@app.route('/list_vector_dbs', methods=['GET'])
def list_vector_dbs():
    upload_folder = './public/databases'
    try:
        files = os.listdir(upload_folder)
        file_details = []
        for file in files:
            file_path = os.path.join(upload_folder, file)
            if os.path.isfile(file_path):
                file_info = {
                    'name': file,
                    'size': os.path.getsize(file_path),
                    'upload_date': time.ctime(os.path.getctime(file_path)),
                    'extension': os.path.splitext(file)[1]
                }
                file_details.append(file_info)
        return jsonify(file_details), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/list_uploads', methods=['GET'])
def list_uploads():
    upload_folder = './public/uploads'
    try:
        files = os.listdir(upload_folder)
        file_details = []
        for file in files:
            file_path = os.path.join(upload_folder, file)
            if os.path.isfile(file_path):
                file_info = {
                    'name': file,
                    'size': os.path.getsize(file_path),
                    'upload_date': time.ctime(os.path.getctime(file_path)),
                    'extension': os.path.splitext(file)[1]
                }
                file_details.append(file_info)
        return jsonify(file_details), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/progress', methods=['GET'])
def progress():
    global db_filename
    def generate_progress():
        global current_progress
        while current_progress < 100:
            yield f"data: {current_progress}\n\n"
            time.sleep(1)
        
        if current_progress == 100:
            logger.info(f"Finished creating vector database: {db_filename}")
            yield f"data: 100\n\n"

    return Response(stream_with_context(generate_progress()), mimetype='text/event-stream')
@app.route('/query', methods=['POST'])
def query():
    global library
    data = request.get_json()
    query_text = data.get('query_text')
    similarity_metric = data.get('similarity_metric')
    db_filename = data.get('db_filename')

    if not db_filename:
        return jsonify({'error': 'No database file specified'}), 400

    db_filepath = os.path.join(db_path, db_filename)
    if not os.path.exists(db_filepath):
        return jsonify({'error': 'Database file not found'}), 404

    library = MBedFastAF('nomic-ai/nomic-embed-text-v1.5-GGUF', similarity_metric)
    library.load(db_filepath)

    logger.info(f"Querying with text: {query_text}")
    results = library.query(query_text, top_k=5)
    logger.info("Query complete.")

    # Convert float32 to float for JSON serialization
    results = [(result[0], result[1], float(result[2])) for result in results]

    return jsonify(results)


@app.route('/list_files', methods=['GET'])
def list_files():
    upload_folder = 'uploads'
    files = os.listdir(upload_folder)
    return jsonify(files)

@app.route('/merge_files', methods=['POST'])
def merge_files():
    data = request.get_json()
    files = data.get('files', [])

    if not files:
        return jsonify({'error': 'No files provided'}), 400

    merged_data = []
    for file in files:
        file_path = os.path.join('uploads', file)
        if os.path.exists(file_path):
            file_extension = os.path.splitext(file_path)[1].lower()
            if file_extension == '.json':
                with open(file_path, 'r') as f:
                    merged_data.extend(json.load(f))
            elif file_extension == '.csv':
                df = pd.read_csv(file_path)
                merged_data.extend(df.to_dict(orient='records'))
            else:
                return jsonify({'error': f'Unsupported file format: {file}'}), 400
        else:
            return jsonify({'error': f'File not found: {file}'}), 400

    merged_file = 'merged_dataset.json'
    with open(os.path.join('uploads', merged_file), 'w') as f:
        json.dump(merged_data, f)

    return jsonify({'file': merged_file}), 200

@app.route('/chatbot_format', methods=['POST'])
def chatbot_format():
    data = request.get_json()
    user_query = data.get('query', '')

    if 'file_path' in data:
        file_path = data['file_path']
        if not file_path or not os.path.exists(file_path):
            return jsonify({'error': 'Invalid file path'}), 400

        with open(file_path, 'r') as file:
            raw_data = file.read()

        user_message = {
            "role": "user",
            "content": f"You are an extremely capable data scientist and you excel at finding programmatic solutions to clean up unstructured data. You'll find below an excerpt from the user data and your task is to analyze it and come up with a script that will clean it up and turn it into a nicely formatted dataset like a json, csv, or whatever else you decide, based on your best judgement:\n\n{raw_data}"
        }
    else:
        user_message = {"role": "user", "content": user_query}

    chat_history.append(user_message)
    trim_chat_history()

    def generate():
        completion = client.chat.completions.create(
            model="lmstudio-ai/codeqwen60k",
            messages=chat_history,
            temperature=0.7,
            stream=True,
        )

        assistant_message = {"role": "assistant", "content": ""}
        for chunk in completion:
            if chunk.choices[0].delta.content:
                delta_content = chunk.choices[0].delta.content
                assistant_message["content"] += delta_content
                yield f"data: {delta_content}\n\n"

        chat_history.append(assistant_message)
        trim_chat_history()

    return Response(stream_with_context(generate()), content_type='text/event-stream')

if __name__ == '__main__':
    upload_folder = 'uploads'
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    # start_react_app()
    app.run(debug=True, host='0.0.0.0', port=4000)
