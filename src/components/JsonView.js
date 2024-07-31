export default function JsonView({ result }) {
    return (
        <pre className="overflow-auto max-h-96 text-sm">
            {JSON.stringify(result, null, 2)}
        </pre>
    );
}