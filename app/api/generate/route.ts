import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    baseUrl: process.env.GEMINI_BASE_URL!
  },
})

interface GenerateRequest {
  prompt: string
  negativePrompt?: string
  aspectRatio?: string
  resolution?: string
  style?: string
  mode?: "image" | "avatar"
}

// 红包封面生成系统提示词
const SYSTEM_PROMPT = `Generate a single WeChat Red Envelope Cover image (微信红包封面).

CRITICAL REQUIREMENTS:
- Output exactly ONE complete image, no variations or multiple outputs
- The image MUST fill the entire canvas with NO white space, NO margins, NO borders
- Full-bleed design that extends to all edges
- Vertical orientation optimized for mobile red envelope display

Design requirements:
- Festive, celebratory, and auspicious atmosphere
- Chinese cultural celebration themes (Spring Festival, New Year, birthdays, weddings)
- Vibrant colors: red, gold, warm tones as primary palette
- Traditional Chinese elements: lanterns, auspicious clouds, flowers, lucky symbols, koi fish, dragons, phoenixes
- Professional quality illustration suitable for WeChat red envelope cover
- Rich details filling the entire composition
- Modern aesthetic with traditional Chinese touches
- Safe for all ages

Composition:
- Design fills 100% of the canvas
- No empty space or blank areas
- Background extends to all edges
- Decorative elements reach the borders`

const NEGATIVE_PROMPT_BASE = "white space, blank areas, margins, borders, empty background, white background, multiple images, image variations, blurry, low quality, distorted, inappropriate content, violence, gore, nudity, offensive symbols, text, letters, words, watermark, signature, poorly drawn, cropped, partial image"

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, negativePrompt, aspectRatio = "9:16", style, mode = "image" } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Build the full prompt with system context
    let fullPrompt = `${SYSTEM_PROMPT}\n\nUser request: ${prompt}`

    if (style) {
      fullPrompt = `${fullPrompt}\nStyle: ${style}`
    }
    if (mode === "avatar") {
      fullPrompt = `${fullPrompt}\nFormat: 3D avatar style character illustration`
    }

    // Combine negative prompts
    const combinedNegativePrompt = negativePrompt
      ? `${NEGATIVE_PROMPT_BASE}, ${negativePrompt}`
      : NEGATIVE_PROMPT_BASE
    fullPrompt = `${fullPrompt}\n\nAvoid: ${combinedNegativePrompt}`

    const model = process.env.GEMINI_IMAGE_MODEL || "imagen-4.0-generate-001"

    const response = await ai.models.generateImages({
      model,
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio,
      },
    })

    // Extract image from response
    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes
    if (!imageBytes) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBytes}`,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    )
  }
}
