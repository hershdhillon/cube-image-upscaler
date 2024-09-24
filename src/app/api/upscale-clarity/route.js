import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await axios.post('http://localhost:5000/predictions', {
            version: "latest",
            input: {
                seed: body.seed || 1337,
                image: body.image,
                prompt: body.prompt || "masterpiece, the best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>",
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
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the image' }, { status: 500 });
    }
}

export async function GET(request) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 });
    }

    try {
        const response = await axios.get(`http://localhost:5000/predictions/${id}`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while fetching the prediction' }, { status: 500 });
    }
}