import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    console.log(
      "Testing Gemini API Key:",
      process.env.GEMINI_API_KEY ? "Key exists" : "Key missing"
    );

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY environment variable is missing" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Say hello in JSON format with a 'message' field";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      success: true,
      response: text,
      apiKeyStatus: "Valid",
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      {
        error: error.message,
        apiKeyStatus: "Invalid or Error",
      },
      { status: 500 }
    );
  }
}
