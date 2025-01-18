const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

class AIProcessor {

   static async processWithGenAI(prompt, modelName = "gemini-1.5-flash-8b") {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text() || "";
        } catch (error) {
            console.error("Error during GenAI processing:", error);
            throw new Error("Failed to process text with GenAI.");
        }
    }
}

module.exports = AIProcessor;
