import { useEffect, useRef } from 'react';

export default function Terminal({ code, language, output, setOutput }) {
    const pyodideRef = useRef(null);
    const isPyodideLoading = useRef(false);

    useEffect(() => {
        // Initialize Pyodide if needed
        async function loadPyodideEnv() {
            if (!pyodideRef.current && !isPyodideLoading.current && window.loadPyodide) {
                isPyodideLoading.current = true;
                console.log('[Terminal] Loading Pyodide...');
                try {
                    setOutput(prev => [...prev, '> Initializing Python environment...']);
                    const pyodide = await window.loadPyodide();
                    // Redirect stdout using setCloud (custom) or just capture it per run?
                    // Pyodide's runPython doesn't easily return printed output unless captured.
                    // We can override standard out.
                    pyodide.setStdout({
                        batched: (msg) => {
                            console.log('[Terminal] Pyodide stdout:', msg);
                            setOutput(prev => [...prev, msg]);
                        }
                    });
                    pyodideRef.current = pyodide;
                    console.log('[Terminal] Pyodide ready.');
                    setOutput(prev => [...prev, '> Python environment ready.']);
                } catch (e) {
                    console.error('[Terminal] Pyodide load failed:', e);
                    setOutput(prev => [...prev, '> Failed to load Python environment. Check console.']);
                } finally {
                    isPyodideLoading.current = false;
                }
            } else if (!window.loadPyodide) {
                console.warn('[Terminal] window.loadPyodide is not defined. Script might not be loaded.');
            }
        }

        if (language === 'python') {
            loadPyodideEnv();
        }
    }, [language, setOutput]);

    useEffect(() => {
        const handleRun = () => {
            console.log('[Terminal] Received run-code event for language:', language);
            // Clear previous output
            setOutput([]);

            if (language === 'javascript') {
                runJS();
            } else if (language === 'python') {
                runPython();
            } else {
                setOutput(prev => [...prev, `Execution for ${language} is not supported in browser-only mode yet.`]);
            }
        };

        document.addEventListener('run-code', handleRun);
        return () => document.removeEventListener('run-code', handleRun);
    }, [code, language]);

    const runPython = async () => {
        console.log('[Terminal] runPython called');
        if (!pyodideRef.current) {
            console.warn('[Terminal] Pyodide not ready yet.');
            setOutput(prev => [...prev, '> Python environment is causing issues or loading... wait a moment.']);
            return;
        }

        setOutput(prev => [...prev, '> Running Python...']);
        try {
            console.log('[Terminal] Executing Python code:', code);
            // We use runPythonAsync to ensure async code works if needed, 
            // though for simple prints synchronous runPython is fine.
            // stdout is captured by setStdout in init.
            await pyodideRef.current.runPythonAsync(code);
            console.log('[Terminal] Python execution completed (async).');
        } catch (err) {
            console.error('[Terminal] Python error:', err);
            setOutput(prev => [...prev, `Error: ${err.message}`]);
        }
    };

    const runJS = () => {
        console.log('[Terminal] runJS called');
        setOutput(prev => [...prev, '> Running JS...']);

        try {
            const workerCode = `
                self.onmessage = function(e) {
                    const code = e.data;
                    // Native log for debugging the worker itself
                    const nativeLog = self.console.log;
                    nativeLog('Worker received code');

                    const console = {
                        log: (...args) => self.postMessage({ type: 'log', data: args.join(' ') }),
                        error: (...args) => self.postMessage({ type: 'error', data: args.join(' ') }),
                        warn: (...args) => self.postMessage({ type: 'log', data: '[WARN] ' + args.join(' ') }),
                        info: (...args) => self.postMessage({ type: 'log', data: '[INFO] ' + args.join(' ') })
                    };
                    
                    try {
                        // Capture return value
                        // We use 'console' as an argument to shadow the global one
                        const result = new Function('console', code)(console);
                        
                        if (result !== undefined) {
                            self.postMessage({ type: 'log', data: 'Return: ' + result });
                        }
                        
                        nativeLog('Worker execution done, sending done message');
                        self.postMessage({ type: 'done' });
                    } catch (err) {
                        nativeLog('Worker error', err);
                        self.postMessage({ type: 'error', data: err.toString() });
                    }
                };
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            // Keep track if we finished
            let isDone = false;

            worker.onmessage = (e) => {
                const { type, data } = e.data;
                console.log('[Terminal] Worker message:', type, data);
                if (type === 'log') {
                    setOutput(prev => [...prev, data]);
                } else if (type === 'error') {
                    setOutput(prev => [...prev, `Error: ${data}`]);
                } else if (type === 'done') {
                    isDone = true;
                    worker.terminate();
                }
            };

            worker.onerror = (e) => {
                console.error('[Terminal] Worker error:', e.message);
                setOutput(prev => [...prev, `Worker Error: ${e.message}`]);
                worker.terminate();
            };

            setTimeout(() => {
                if (!isDone) {
                    console.warn('[Terminal] Worker timeout - Force terminating');
                    setOutput(prev => [...prev, '> Execution timed out.']);
                    worker.terminate();
                }
            }, 5000); // 5s timeout

            worker.postMessage(code);

        } catch (e) {
            console.error('[Terminal] Setup error:', e);
            setOutput(prev => [...prev, `Error: ${e.message}`]);
        }
    };

    return (
        <div style={{ padding: '10px', backgroundColor: '#fff', color: '#000', height: '100%', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', color: '#333' }}>Output</h3>
            <div style={{ borderTop: '1px solid #ccc', padding: '10px 0' }}>
                {output.map((line, i) => (
                    <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '2px', color: line.startsWith('Error') || line.startsWith('Worker Error') ? '#d32f2f' : '#000' }}>
                        {line}
                    </div>
                ))}
                {output.length === 0 && <span style={{ color: '#888' }}>Run code to see output...</span>}
            </div>
        </div>
    );
}
