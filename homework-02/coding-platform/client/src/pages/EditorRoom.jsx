import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeEditor from '../components/CodeEditor';
import Terminal from '../components/Terminal';
import QuestionPanel from '../components/QuestionPanel';
import { getRandomQuestions } from '../data/questions';

const SOCKET_URL = 'http://localhost:3000';

export default function EditorRoom() {
    const { roomId } = useParams();
    const [socket, setSocket] = useState(null);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('// Start coding here...');
    const [output, setOutput] = useState([]);

    // Layout & Test Mode State
    const [layout, setLayout] = useState('horizontal');
    const [testMode, setTestMode] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const s = io(SOCKET_URL);
        setSocket(s);

        s.emit('join-room', roomId);

        // Register room if Evaluator
        const role = localStorage.getItem('user_role');
        const name = localStorage.getItem('user_name');
        if (role === 'evaluator' && name) {
            s.emit('register-room', { roomId, creator: name });
        }

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
        console.log('[EditorRoom] Run button clicked. Dispatching run-code event.');
        document.dispatchEvent(new CustomEvent('run-code'));
    };

    const toggleLayout = () => {
        setLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
    };

    const toggleTestMode = () => {
        if (!testMode) {
            // Start Test Mode
            const q = getRandomQuestions(10);
            setQuestions(q);
        }
        setTestMode(!testMode);
    };

    const handleLoadQuestion = (question) => {
        const starter = question.starterCode[language] || '// No starter code for this language';
        setCode(starter);
        socket?.emit('code-change', { roomId, code: starter });
    };

    return (
        <div className="room-container" style={{ position: 'relative' }}>
            <div className="header">
                <div className="header-left">
                    <span className="logo">Interview Platform</span>
                    <span className="room-id">Room: {roomId}</span>
                </div>
                <div className="header-right">
                    <button onClick={toggleTestMode} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: testMode ? '#d32f2f' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
                        {testMode ? 'Exit Test Mode' : 'Enter Test Mode'}
                    </button>
                    <button className="layout-btn" onClick={toggleLayout} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px' }}>
                        Layout: {layout === 'horizontal' ? 'Side-by-Side' : 'Stacked'}
                    </button>
                    <select value={language} onChange={handleLanguageChange} className="lang-select">
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                    <button className="run-btn" onClick={handleRunRequest}>Run Code</button>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {testMode && <QuestionPanel questions={questions} onClose={() => setTestMode(false)} onSelect={handleLoadQuestion} />}
                <div className={`main-area ${layout}`}>
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
        </div>
    );
}
