const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

class AIProcessor {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.groqAI = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    async processWithGenAI(prompt, modelName = "gemini-1.5-flash-8b") {
        try {
            const model = this.genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text() || "";
        } catch (error) {
            console.error("Error during GenAI processing:", error);
            throw new Error("Failed to process text with GenAI.");
        }
    }

    async processWithGroqAI(prompt, modelName = "llama3-8b-8192") {
        try {
            const response = await this.groqAI.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: modelName,
            });
            return response.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("Error during GroqAI processing:", error);
            throw new Error("Failed to process text with GroqAI.");
        }
    }
}

module.exports = AIProcessor;
