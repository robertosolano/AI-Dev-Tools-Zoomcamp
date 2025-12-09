import '@testing-library/jest-dom';

// Mock Worker
class Worker {
    constructor(stringUrl) {
        this.url = stringUrl;
        this.onmessage = () => { };
    }
    postMessage(msg) {
        // Simulate simple echo or log for testing
        this.onmessage({ data: { type: 'log', data: 'Worker Output' } });
        this.onmessage({ data: { type: 'done' } });
    }
    terminate() { }
}
global.Worker = Worker;

// Mock Pyodide
global.loadPyodide = async () => ({
    runPythonAsync: async () => { },
    setStdout: () => { },
});

// Mock URL.createObjectURL
global.URL.createObjectURL = () => 'blob:mock';
