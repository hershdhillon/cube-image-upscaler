import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: "dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
                input: {
                    seed: body.seed || 1337,
                    image: body.image,
                    prompt: body.prompt || "masterpiece, best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>",
                    dynamic: body.dynamic || 6,
                    handfix: "disabled",
                    pattern: false,
                    sharpen: 0,
                    sd_model: body.sd_model || "juggernaut_reborn.safetensors [338b85bc4f]",
                    scheduler: "DPM++ 3M SDE Karras",
                    creativity: body.creativity || 0.35,
                    lora_links: "",
                    downscaling: false,
                    resemblance: body.resemblance || 0.6,
                    scale_factor: body.scale_factor || 2,
                    tiling_width: 112,
                    output_format: "png",
                    tiling_height: 144,
                    custom_sd_model: "",
                    negative_prompt: body.negative_prompt || "(worst quality, low quality, normal quality:2) JuggernautNegative-neg",
                    num_inference_steps: body.num_inference_steps || 18,
                    downscaling_resolution: 768
                }
            }),
        });

        if (response.status !== 201) {
            const error = await response.json();
            console.error("Error response from Replicate API:", error);
            return NextResponse.json(error, { status: response.status });
        }

        const prediction = await response.json();
        return NextResponse.json(prediction, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
    }
}

export async function GET(request) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
            headers: {
                'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            const error = await response.json();
            console.error("Error fetching prediction:", error);
            return NextResponse.json({ detail: error.detail }, { status: 500 });
        }

        const prediction = await response.json();
        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while fetching the prediction' }, { status: 500 });
    }
}