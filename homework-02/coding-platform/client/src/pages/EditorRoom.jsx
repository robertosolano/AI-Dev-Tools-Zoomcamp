import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeEditor from '../components/CodeEditor';
import Terminal from '../components/Terminal';

const SOCKET_URL = 'http://localhost:3000';

export default function EditorRoom() {
    const { roomId } = useParams();
    const [socket, setSocket] = useState(null);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('// Start coding here...');
    const [output, setOutput] = useState([]);

    useEffect(() => {
        const s = io(SOCKET_URL);
        setSocket(s);

        s.emit('join-room', roomId);

        s.on('code-update', (newCode) => {
            setCode(newCode);
        });

        s.on('language-update', (newLang) => {
            setLanguage(newLang);
        });

        return () => {
            s.disconnect();
        };
    }, [roomId]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket?.emit('code-change', { roomId, code: newCode });
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        socket?.emit('language-change', { roomId, language: newLang });
    };

    const handleRunRequest = () => {
        // Trigger execution in Terminal component
        // Using a custom event or passing a trigger prop would work.
        // A simple way is to pass a "runTrigger" timestamp or similar to Terminal, or expose a ref.
        // But adhering to React flow, I'll use a specific CustomEvent or just manage the run logic here?
        // Actually, Terminal having the run logic is slightly inverted.
        // Let's keep run logic in Terminal for now as designed in thought.
        document.dispatchEvent(new CustomEvent('run-code'));
    };

    return (
        <div className="room-container">
            <div className="header">
                <div className="header-left">
                    <span className="logo">Interview Platform</span>
                    <span className="room-id">Room: {roomId}</span>
                </div>
                <div className="header-right">
                    <select value={language} onChange={handleLanguageChange} className="lang-select">
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                    <button className="run-btn" onClick={handleRunRequest}>Run Code</button>
                </div>
            </div>
            <div className="main-area">
                <div className="editor-pane">
                    <CodeEditor
                        code={code}
                        onChange={handleCodeChange}
                        language={language}
                    />
                </div>
                <div className="terminal-pane">
                    <Terminal code={code} language={language} output={output} setOutput={setOutput} />
                </div>
            </div>
        </div>
    );
}
