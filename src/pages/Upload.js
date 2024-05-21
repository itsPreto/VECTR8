import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import md5 from 'md5';

import csvIcon from '../assets/csv-logo.svg';
import jsonIcon from '../assets/json-logo.svg';
import audioIcon from '../assets/audio-logo.svg';
import codeIcon from '../assets/code-logo.svg';
import excelIcon from '../assets/excel-logo.svg';
import imgIcon from '../assets/img-logo.svg';
import pdfIcon from '../assets/pdf-logo.svg';
import videoIcon from '../assets/video-logo.svg';

const Upload = ({ onPreviewData }) => {
    const [file, setFile] = useState(() => JSON.parse(localStorage.getItem('file')) || null);
    const [fileInfo, setFileInfo] = useState(() => localStorage.getItem('fileInfo') || null);
    const [datasets, setDatasets] = useState(() => JSON.parse(localStorage.getItem('datasets')) || []);
    const [selectedKeys, setSelectedKeys] = useState(() => JSON.parse(localStorage.getItem('selectedKeys')) || []);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(() => JSON.parse(localStorage.getItem('uploadSuccess')) || false);
    const [loading, setLoading] = useState(false);
    const [dataWizardLoading, setDataWizardLoading] = useState(false);
    const [wizardFile, setWizardFile] = useState(null);
    const [wizardFileInfo, setWizardFileInfo] = useState(null);
    const [wizardResponse, setWizardResponse] = useState(null);
    const [chatMessages, setChatMessages] = useState(() => JSON.parse(localStorage.getItem('chatMessages')) || []);
    const [chatInput, setChatInput] = useState(() => localStorage.getItem('chatInput') || "");
    const chatWindowRef = useRef(null);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDatasets();
        const interval = setInterval(fetchDatasets, 30000); // Poll every 30 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (isAutoScrollEnabled && chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [chatMessages]);

    useEffect(() => {
        localStorage.setItem('file', JSON.stringify(file));
    }, [file]);

    useEffect(() => {
        localStorage.setItem('fileInfo', fileInfo);
    }, [fileInfo]);

    useEffect(() => {
        localStorage.setItem('uploadSuccess', JSON.stringify(uploadSuccess));
    }, [uploadSuccess]);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }, [chatMessages]);

    useEffect(() => {
        localStorage.setItem('chatInput', chatInput);
    }, [chatInput]);

    useEffect(() => {
        localStorage.setItem('datasets', JSON.stringify(datasets));
    }, [datasets]);

    useEffect(() => {
        localStorage.setItem('selectedKeys', JSON.stringify(selectedKeys));
    }, [selectedKeys]);

    const fetchDatasets = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://10.0.0.252:4000/list_uploads');
            const newDatasets = await response.json();
            if (response.ok) {
                const newChecksum = md5(JSON.stringify(newDatasets));
                const cachedChecksum = localStorage.getItem('datasetsChecksum');
                
                if (newChecksum !== cachedChecksum) {
                    setDatasets(newDatasets);
                    localStorage.setItem('datasetsChecksum', newChecksum);
                }
            } else {
                alert(newDatasets.error);
            }
        } catch (error) {
            console.error('Error fetching datasets:', error);
        }
        setLoading(false);
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);

        const formData = new FormData();
        formData.append('file', selectedFile);
        setLoading(true);
        try {
            const response = await fetch('http://10.0.0.252:4000/upload_file', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                const filePath = `./public/uploads/${result}`;
                setFileInfo(filePath);
                fetchPreviewData(filePath);
                setUploadSuccess(true);
                setSelectedKeys([]); // Clear selected keys
                localStorage.removeItem('selectedKeys'); // Clear local storage
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        setLoading(false);
    };

    const fetchPreviewData = async (filePath) => {
        console.log("Fetching preview data for file:", filePath);
        try {
            const response = await fetch('http://10.0.0.252:4000/preview_file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_path: filePath })
            });
            const previewData = await response.json();
            if (response.ok) {
                console.log("Preview data:", previewData);
                onPreviewData(previewData, filePath);
                navigate('/preview'); // Navigate to the Preview page
            } else {
                alert(previewData.error);
            }
        } catch (error) {
            console.error('Error fetching preview data:', error);
        }
    };

    const handleDatasetClick = (filePath) => {
        setFileInfo(filePath);
        setSelectedKeys([]); // Clear out the previous list of selected keys
        localStorage.removeItem('selectedKeys'); // Clear out local storage
        fetchPreviewData(filePath);
    };

    const handleWizardFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        setWizardFile(selectedFile);

        const formData = new FormData();
        formData.append('file', selectedFile);
        setDataWizardLoading(true);
        try {
            const response = await fetch('http://10.0.0.252:4000/upload_file', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                setWizardFileInfo(result.file_path);
                const chatResponse = await fetch('http://10.0.0.252:4000/chatbot_format', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file_path: result.file_path })
                });
                const chatData = await chatResponse.json();
                if (chatResponse.ok) {
                    setWizardResponse(chatData.response);
                    setChatMessages([
                        ...chatMessages,
                        { role: 'assistant', content: chatData.response }
                    ]);
                } else {
                    alert(chatData.error);
                }
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error uploading wizard file:', error);
        }
        setDataWizardLoading(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange({ target: { files: [droppedFile] } });
        }
    };

    const handleWizardDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleWizardFileChange({ target: { files: [droppedFile] } });
        }
    };

    const getFileIcon = (extension) => {
        switch (extension) {
            case 'pdf':
                return pdfIcon;
            case 'doc':
            case 'docx':
                return 'fas fa-file-word';
            case 'xls':
            case 'xlsx':
                return excelIcon;
            case 'csv':
                return csvIcon;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return imgIcon;
            case 'json':
                return jsonIcon;
            case 'txt':
                return 'fas fa-file-alt';
            case 'zip':
            case 'rar':
                return 'fas fa-file-archive';
            case 'mp3':
            case 'wav':
                return audioIcon;
            case 'mp4':
            case 'avi':
                return videoIcon;
            case 'html':
            case 'css':
            case 'js':
                return codeIcon;
            default:
                return 'fas fa-file';
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const timeAgo = (date) => {
        const now = new Date();
        const then = new Date(date);
        const seconds = Math.floor((now - then) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) return `${interval} years ago`;
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} months ago`;
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} days ago`;
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} hours ago`;
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} minutes ago`;
        return `${Math.floor(seconds)} seconds ago`;
    };

    const handleSendChat = async () => {
        if (chatInput.trim() === "") return;

        const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
        setChatMessages(newMessages);
        setChatInput("");

        try {
            const response = await fetch('http://10.0.0.252:4000/chatbot_format', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: chatInput })
            });

            if (response.ok) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantMessage = { role: 'assistant', content: '' };

                const streamResponse = async () => {
                    let buffer = '';

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        buffer += chunk;

                        const lines = buffer.split('\n');
                        buffer = lines.pop();

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const deltaContent = line.slice(6);
                                assistantMessage.content += deltaContent;
                                setChatMessages([...newMessages, assistantMessage]);
                            }
                        }
                    }

                    if (buffer.length > 0) {
                        assistantMessage.content += buffer;
                        setChatMessages([...newMessages, assistantMessage]);
                    }
                };

                streamResponse();
            } else {
                const chatData = await response.json();
                alert(chatData.error);
            }
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && chatInput.trim() !== "") {
            event.preventDefault();
            handleSendChat();
        }
    };

    const handleScroll = () => {
        if (chatWindowRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
            const isScrolledToBottom = scrollHeight - scrollTop === clientHeight;
            setIsAutoScrollEnabled(isScrolledToBottom);
        }
    };

    return (
        <section id="upload" className="active">
            <div id="upload-container">
                <div id="leftPanel">
                    <h2>Available Datasets</h2>
                    {loading && <p>Loading datasets...</p>}
                    <ul id="fileList" style={{
                        display: 'grid',
                        minHeight: "40vh",
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        {datasets.map((dataset, index) => {
                            const fileExtension = dataset.name.split('.').pop().toLowerCase();
                            return (
                                <li 
                                    className={`datasetListItem ${fileInfo != null && dataset.name === fileInfo ? 'selected' : ''}`}
                                    key={index}
                                    onClick={() => handleDatasetClick(dataset.name)}
                                >
                                    {['csv', 'json', 'mp3', 'wav', 'mp4', 'avi', 'jpg', 'jpeg', 'png'].includes(fileExtension) ? (
                                        <img src={getFileIcon(fileExtension)} style={{ marginRight: '8px', fontSize: '1.5em', width: '24px', height: '24px' }} alt={`${fileExtension} icon`} />
                                    ) : (
                                        <i className={getFileIcon(fileExtension)} style={{ marginRight: '8px', fontSize: '1.5em' }}></i>
                                    )}
                                    <div>
                                        <span style={{ fontWeight: 'bold', color: '#1a73e8' }}>{dataset.name}</span>
                                        <div style={{ fontSize: '0.8em', color: '#555' }}>
                                            <p style={{ color: '#e8711a' }}>Size: {formatBytes(dataset.size)}</p>
                                            <p style={{ color: '#34a853' }}>Uploaded: {timeAgo(dataset.upload_date)}</p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div
                        id="uploadContainer"
                        style={{
                            background: uploadSuccess ? '#39dc7578' : (isDragging ? '#4848e878' : '#fff'),
                            borderRadius: '16px',
                            marginTop: '8px',
                            transition: 'all 0.3s ease'
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
                        <label htmlFor="fileInput" style={{ display: 'block', cursor: 'pointer' }}>
                            <div id="fileInfo" style={{
                                textAlign: "-webkit-center", padding: "16px",
                                marginRight: "8px",
                                background: "#f1f1f1",
                                marginBottom: "16px",
                                borderBottomRightRadius: "8px",
                                borderBottomLeftRadius: "8px",
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                                width: "100%"
                            }}>
                                <p>{fileInfo ? `File Name: ${fileInfo}` : 'No file selected'}</p>
                            </div>
                            <i className="fa fa-file-upload" style={{ fontSize: '1.5em', marginTop: '10px', marginBottom: '10px' }}></i>
                            <p style={{ marginTop: '10px' }}>Drag and drop a file here, or click to select a file</p>
                        </label>
                    </div>
                    <button id="mergeFiles" className="button" style={{ marginTop: '8px' }}>Merge Selected Files</button>
                </div>
                <div id="rightPanel">
                    <h2>Data Wizard</h2>
                    <div
                        id="wizardUploadContainer"
                        style={{
                            background: wizardFileInfo ? '#39dc7578' : (isDragging ? '#4848e878' : '#fff'),
                            borderRadius: '16px',
                            padding: '16px',
                            transition: 'all 0.3s ease',
                            textAlign: 'center'
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleWizardDrop}
                    >
                        <input type="file" id="wizardFileInput" onChange={handleWizardFileChange} style={{ display: 'none' }} />
                        <label htmlFor="wizardFileInput" style={{ display: 'block', cursor: 'pointer' }}>
                            <div id="wizardFileInfo" style={{
                                textAlign: "-webkit-center", padding: "16px",
                                marginRight: "8px",
                                background: "#f1f1f1",
                                marginBottom: "16px",
                                borderBottomRightRadius: "8px",
                                borderBottomLeftRadius: "8px",
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                                width: "100%"
                            }}>
                                <p>{wizardFileInfo ? `File Name: ${wizardFileInfo}` : 'No file selected'}</p>
                            </div>
                            <i className="fa fa-file-upload" style={{ fontSize: '1.5em', marginTop: '10px', marginBottom: '10px' }}></i>
                            <p style={{ marginTop: '10px' }}>Drag and drop a file here, or click to select a file</p>
                        </label>
                    </div>
                    <div>
                        {dataWizardLoading && <p>Loading...</p>}
                        {wizardResponse && (
                            <div>
                                <h3>Chatbot Response:</h3>
                                <pre>{wizardResponse}</pre>
                            </div>
                        )}
                    </div>
                    <div
                        id="chatWindow"
                        ref={chatWindowRef}
                        style={{
                            border: '1px solid #333',
                            borderRadius: '8px',
                            padding: '16px',
                            height: '300px',
                            overflowY: 'auto',
                            backgroundColor: '#1c1c1e',
                            marginBottom: '16px',
                            wordBreak: 'break-word',
                            color: '#e4e4e6'
                        }}
                        onScroll={handleScroll}
                    >
                        {chatMessages.map((message, index) => (
                            <div key={index} className={`message ${message.role}`} style={{ display: 'flex', flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div
                                    className={`message-content ${message.role}`}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        textAlignLast: "start",
                                        backgroundColor: message.role === 'user' ? '#3a3a3c' : 'rgb(72 72 74 / 0%)',
                                        color: '#e4e4e6',
                                        maxWidth: '100%',
                                        wordBreak: 'auto-phrase',
                                        whiteSpace: 'break-spaces'
                                    }}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <textarea
                            id="chatInput"
                            style={{
                                width: "100%",
                                height: "50px",
                                marginTop: "16px",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid #333",
                                resize: "none",
                                backgroundColor: '#2c2c2e',
                                color: '#e4e4e6'
                            }}
                            placeholder="Ask the chatbot..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        ></textarea>
                        <button
                            id="sendButton"
                            style={{ marginLeft: '8px', marginTop: '16px', padding: '8px 16px', background: '#444444', color: '#e4e4e6', border: 'none', borderRadius: '8px' }}
                            onClick={handleSendChat}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Upload;
