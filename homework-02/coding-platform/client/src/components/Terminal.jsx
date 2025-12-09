import { useEffect, useRef } from 'react';

export default function Terminal({ code, language, output, setOutput, validationScript, onValidationResult }) {
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
                    // Redirect stdout
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
        const handleRun = (e) => {
            const shouldValidate = e.detail && e.detail.validate;

            // Clear previous output
            setOutput([]);
            // Reset validation result
            if (onValidationResult) onValidationResult(null);

            const codeToRun = (shouldValidate && validationScript) ? (code + '\n' + validationScript) : code;

            if (language === 'javascript') {
                runJS(codeToRun, shouldValidate);
            } else if (language === 'python') {
                runPython(codeToRun, shouldValidate);
            } else {
                setOutput(prev => [...prev, `Execution for ${language} is not supported in browser-only mode yet.`]);
            }
        };

        document.addEventListener('run-code', handleRun);
        return () => document.removeEventListener('run-code', handleRun);
    }, [code, language, validationScript, onValidationResult]);

    // Monitor output for tokens to trigger callback
    useEffect(() => {
        const fullOutput = output.join('\n');
        if (fullOutput.includes('---VALIDATION---')) {
            if (fullOutput.includes('PASSED')) {
                const lastLine = output[output.length - 1];
                // Simple loose check to allow async updates to settle
                if (lastLine && ((typeof lastLine === 'string' && lastLine.includes('PASSED')) || output.some(l => typeof l === 'string' && l.includes('PASSED')))) {
                    if (onValidationResult) onValidationResult('PASSED');
                }
            } else if (fullOutput.includes('FAILED') || fullOutput.includes('ERROR')) {
                if (onValidationResult) onValidationResult('FAILED');
            }
        }
    }, [output, onValidationResult]);

    const runPython = async (codeToRun, isValidation) => {
        if (!pyodideRef.current) {
            setOutput(prev => [...prev, '> Python environment loading...']);
            return;
        }

        setOutput(prev => [...prev, isValidation ? '> Validating solution...' : '> Running Python...']);
        try {
            await pyodideRef.current.runPythonAsync(codeToRun);
        } catch (err) {
            console.error('[Terminal] Python error:', err);
            setOutput(prev => [...prev, `Error: ${err.message}`]);
        }
    };

    const runJS = (codeToRun, isValidation) => {
        setOutput(prev => [...prev, isValidation ? '> Validating solution...' : '> Running JS...']);

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
                        new Function('console', code)(console);
                        self.postMessage({ type: 'done' });
                    } catch (err) {
                        self.postMessage({ type: 'error', data: err.toString() });
                    }
                };
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            let isDone = false;

            worker.onmessage = (e) => {
                const { type, data } = e.data;
                if (type === 'log') setOutput(prev => [...prev, data]);
                else if (type === 'error') setOutput(prev => [...prev, `Error: ${data}`]);
                else if (type === 'done') { isDone = true; worker.terminate(); }
            };

            worker.onerror = (e) => {
                setOutput(prev => [...prev, `Worker Error: ${e.message}`]);
                worker.terminate();
            };

            setTimeout(() => {
                if (!isDone) {
                    setOutput(prev => [...prev, '> Execution timed out.']);
                    worker.terminate();
                }
            }, 5000);

            worker.postMessage(codeToRun);

        } catch (e) {
            setOutput(prev => [...prev, `Error: ${e.message}`]);
        }
    };

    const getLineColor = (line) => {
        if (typeof line !== 'string') return '#000';
        if (line.includes('PASSED')) return '#28a745';
        if (line.includes('FAILED')) return '#d32f2f';
        if (line.startsWith('Error') || line.startsWith('Worker Error')) return '#d32f2f';
        if (line.startsWith('>')) return '#666';
        return '#000';
    };

    const getLineWeight = (line) => {
        if (typeof line === 'string' && (line.includes('PASSED') || line.includes('FAILED'))) return 'bold';
        return 'normal';
    };

    return (
        <div style={{ padding: '10px', backgroundColor: '#fff', color: '#000', height: '100%', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', color: '#333' }}>Output</h3>
            <div style={{ borderTop: '1px solid #ccc', padding: '10px 0' }}>
                {output.map((line, i) => (
                    <div key={i} style={{
                        whiteSpace: 'pre-wrap',
                        marginBottom: '2px',
                        color: getLineColor(line),
                        fontWeight: getLineWeight(line)
                    }}>
                        {line}
                    </div>
                ))}
                {output.length === 0 && <span style={{ color: '#888' }}>Run code to see output...</span>}
            </div>
        </div>
    );
}
