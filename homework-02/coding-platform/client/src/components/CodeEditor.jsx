import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, language }) {
    return (
        <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => onChange(value)}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    );
}
