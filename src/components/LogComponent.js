import React, { useEffect, useRef } from 'react';

export default function LogComponent({ logs }) {
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Processing Logs:</h3>
            <pre
                ref={logRef}
                className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-sm"
            >
                {logs || 'Waiting for logs...'}
            </pre>
        </div>
    );
}