import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditorRoom from './EditorRoom';
import { BrowserRouter } from 'react-router-dom';

// Mock Socket.io
vi.mock('socket.io-client', () => ({
    io: () => ({
        emit: vi.fn(),
        on: vi.fn(),
        disconnect: vi.fn(),
    }),
}));

// Mock Child Components
vi.mock('../components/CodeEditor', () => ({
    default: () => <div data-testid="code-editor">CodeEditor</div>
}));

vi.mock('../components/Terminal', () => ({
    default: ({ onValidationResult }) => {
        // Expose a button to simulate validation callback for testing
        return (
            <div data-testid="terminal">
                Terminal
                <button data-testid="sim-pass" onClick={() => onValidationResult && onValidationResult('PASSED')}>Sim Pass</button>
            </div>
        );
    }
}));

vi.mock('../components/QuestionPanel', () => ({
    default: ({ onValidate, validationResult }) => (
        <div data-testid="question-panel">
            QuestionPanel
            <button onClick={onValidate}>Validate Answer</button>
            {validationResult && <div data-testid="validation-result">{validationResult}</div>}
        </div>
    )
}));

describe('EditorRoom Validation Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <BrowserRouter>
                <EditorRoom />
            </BrowserRouter>
        );
        expect(screen.getByText(/Interview Platform/i)).toBeInTheDocument();
    });

    it('enters test mode and shows QuestionPanel', () => {
        render(
            <BrowserRouter>
                <EditorRoom />
            </BrowserRouter>
        );

        const testBtn = screen.getByText('Enter Test Mode');
        fireEvent.click(testBtn);

        expect(screen.getByTestId('question-panel')).toBeInTheDocument();
    });

    it('clicking Validate Answer dispatches run-code event', () => {
        render(
            <BrowserRouter>
                <EditorRoom />
            </BrowserRouter>
        );

        // Enter test mode
        fireEvent.click(screen.getByText('Enter Test Mode'));

        const dispatchSpy = vi.spyOn(document, 'dispatchEvent');
        // Click validate in the mocked QuestionPanel
        fireEvent.click(screen.getByText('Validate Answer'));

        expect(dispatchSpy).toHaveBeenCalled();
        const event = dispatchSpy.calls.find(c => c[0].type === 'run-code')[0];
        expect(event.detail).toEqual({ validate: true });
    });

    it('updates validation state when Terminal triggers callback', () => {
        render(
            <BrowserRouter>
                <EditorRoom />
            </BrowserRouter>
        );

        // Enter test mode
        fireEvent.click(screen.getByText('Enter Test Mode'));

        // Initially no result
        expect(screen.queryByTestId('validation-result')).not.toBeInTheDocument();

        // Trigger callback from Mocked Terminal
        fireEvent.click(screen.getByTestId('sim-pass'));

        // Check if Child Component received the prop
        expect(screen.getByTestId('validation-result')).toHaveTextContent('PASSED');
    });
});
