import { GoogleGenerativeAI } from "@google/generative-ai";

async function testGeminiAPI() {
  try {
    // Initialize the API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // Test model availability
    console.log("Testing Gemini API connection...");

    // Try to get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Successfully accessed gemini-pro model");

    // Try a simple test message
    const result = await model.generateContent(
      "Hello, this is a test message."
    );
    const response = await result.response;
    console.log("Test response:", response.text());

    console.log("API key verification successful!");
  } catch (error) {
    console.error("Error testing Gemini API:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
    }
  }
}

// Run the test
testGeminiAPI();
