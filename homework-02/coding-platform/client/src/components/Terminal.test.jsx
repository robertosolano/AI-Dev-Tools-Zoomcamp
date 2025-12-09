import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Terminal from './Terminal';

// Mock pyodide globally for this test file just in case
global.loadPyodide = async () => ({
    runPythonAsync: vi.fn(),
    setStdout: vi.fn(),
});

describe('Terminal Component', () => {
    it('triggers onValidationResult("PASSED") when output has success token', async () => {
        const onValidationResult = vi.fn();
        const setOutput = vi.fn();

        const { rerender } = render(
            <Terminal
                code=""
                language="python"
                output={[]}
                setOutput={setOutput}
                onValidationResult={onValidationResult}
            />
        );

        // Update prop
        const passedOutput = ['---VALIDATION---', 'PASSED'];
        rerender(
            <Terminal
                code=""
                language="python"
                output={passedOutput}
                setOutput={setOutput}
                onValidationResult={onValidationResult}
            />
        );

        await waitFor(() => {
            expect(onValidationResult).toHaveBeenCalledWith('PASSED');
        });
    });

    it('triggers onValidationResult("FAILED") when output has failure token', async () => {
        const onValidationResult = vi.fn();
        const setOutput = vi.fn();

        const { rerender } = render(
            <Terminal
                code=""
                language="python"
                output={[]}
                setOutput={setOutput}
                onValidationResult={onValidationResult}
            />
        );

        const failedOutput = ['---VALIDATION---', 'FAILED'];
        rerender(
            <Terminal
                code=""
                language="python"
                output={failedOutput}
                setOutput={setOutput}
                onValidationResult={onValidationResult}
            />
        );

        await waitFor(() => {
            expect(onValidationResult).toHaveBeenCalledWith('FAILED');
        });
    });
});
