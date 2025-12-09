import { useEffect } from 'react';

export default function Terminal({ code, language, output, setOutput }) {

    useEffect(() => {
        const handleRun = () => {
            // Clear previous output
            setOutput([]);

            if (language === 'javascript') {
                runJS();
            } else {
                setOutput(prev => [...prev, `Execution for ${language} is not supported in browser-only mode yet.`]);
            }
        };

        document.addEventListener('run-code', handleRun);
        return () => document.removeEventListener('run-code', handleRun);
    }, [code, language]);

    const runJS = () => {
        setOutput(prev => [...prev, '> Running...']);

        try {
            const workerCode = `
                self.onmessage = function(e) {
                    const code = e.data;
                    const console = {
                        log: (...args) => self.postMessage({ type: 'log', data: args.join(' ') }),
                        error: (...args) => self.postMessage({ type: 'error', data: args.join(' ') }),
                        warn: (...args) => self.postMessage({ type: 'log', data: '[WARN] ' + args.join(' ') }),
                        info: (...args) => self.postMessage({ type: 'log', data: '[INFO] ' + args.join(' ') })
                    };
                    try {
                        // Capture return value
                        const result = new Function(code)();
                        if (result !== undefined) {
                            self.postMessage({ type: 'log', data: 'Return: ' + result });
                        }
                        self.postMessage({ type: 'done' });
                    } catch (err) {
                        self.postMessage({ type: 'error', data: err.toString() });
                    }
                };
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            worker.onmessage = (e) => {
                const { type, data } = e.data;
                if (type === 'log') {
                    setOutput(prev => [...prev, data]);
                } else if (type === 'error') {
                    setOutput(prev => [...prev, `Error: ${data}`]);
                } else if (type === 'done') {
                    worker.terminate();
                }
            };

            worker.onerror = (e) => {
                setOutput(prev => [...prev, `Worker Error: ${e.message}`]);
                worker.terminate();
            };

            setTimeout(() => {
                worker.terminate();
            }, 5000); // 5s timeout

            worker.postMessage(code);

        } catch (e) {
            setOutput(prev => [...prev, `Error: ${e.message}`]);
        }
    };

    return (
        <div style={{ padding: '10px', backgroundColor: '#1e1e1e', color: '#fff', height: '100%', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', color: '#888' }}>Output</h3>
            <div style={{ borderTop: '1px solid #333', padding: '10px 0' }}>
                {output.map((line, i) => (
                    <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '2px', color: line.startsWith('Error') ? '#ff6b6b' : '#fff' }}>
                        {line}
                    </div>
                ))}
                {output.length === 0 && <span style={{ color: '#555' }}>Run code to see output...</span>}
            </div>
        </div>
    );
}
