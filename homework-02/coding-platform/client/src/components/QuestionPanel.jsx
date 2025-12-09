import { useState } from 'react';

export default function QuestionPanel({ questions, onClose, onSelect, onValidate, validationResult }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentQuestion = questions[currentIndex];

    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(curr => curr + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(curr => curr - 1);
    };

    const handleLoad = () => {
        onSelect(currentQuestion);
    };

    const handleValidate = () => {
        onValidate();
    };

    return (
        <div style={{ width: '300px', backgroundColor: '#252526', borderRight: '1px solid #333', color: 'white', padding: '15px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Test Mode</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>X</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <h4 style={{ color: '#61dafb' }}>Question {currentIndex + 1} / {questions.length}</h4>
                <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>{currentQuestion.title}</h2>
                <span style={{
                    backgroundColor: currentQuestion.difficulty === 'Easy' ? '#28a745' : currentQuestion.difficulty === 'Medium' ? '#ffc107' : '#dc3545',
                    color: 'black', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                }}>
                    {currentQuestion.difficulty}
                </span>
                <p style={{ marginTop: '15px', lineHeight: '1.5', color: '#ddd' }}>
                    {currentQuestion.description}
                </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={handleLoad} style={{ padding: '8px', backgroundColor: '#0078d4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Load into Editor
                </button>

                {validationResult && (
                    <div style={{
                        padding: '10px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: validationResult === 'PASSED' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                        color: validationResult === 'PASSED' ? '#28a745' : '#dc3545',
                        border: validationResult === 'PASSED' ? '1px solid #28a745' : '1px solid #dc3545'
                    }}>
                        {validationResult === 'PASSED' ? '✅ Did it Pass? YES!' : '❌ Did it Pass? NO'}
                    </div>
                )}

                <button onClick={handleValidate} style={{ padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Validate Answer
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={handlePrev} disabled={currentIndex === 0} style={{ padding: '5px 10px', opacity: currentIndex === 0 ? 0.5 : 1 }}>Prev</button>
                    <button onClick={handleNext} disabled={currentIndex === questions.length - 1} style={{ padding: '5px 10px', opacity: currentIndex === questions.length - 1 ? 0.5 : 1 }}>Next</button>
                </div>
            </div>
        </div>
    );
}
