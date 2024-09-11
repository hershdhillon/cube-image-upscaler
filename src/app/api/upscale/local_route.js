import axios from 'axios';

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await axios.post('http://localhost:5000/predictions', {
            input: body
        });
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while processing the image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}