const TextExtractor = require("./TextExtractor");
const AIProcessor = require("./AIProcessor");
const generatePrompt = require("./prompt");

class FoodDataController {
  static async processFoodData(imageUrl, includeDetails = false) {
    try {
      // Extract text from the image
      const extractedText = await TextExtractor.extractFromImage(imageUrl);

      // Generate the AI prompt dynamically
      const prompt = generatePrompt(extractedText, includeDetails);

      // Process with AI
      const structuredData = await AIProcessor.processWithGenAI(prompt);

      // Clean and parse the response
      const jsonResponse = JSON.parse(
        structuredData.replace(/```json|```/g, "").trim()
      );

      return jsonResponse;
    } catch (error) {
      console.error("Error in FoodDataController:", error);
      throw new Error(error.message || "Failed to process food data.");
    }
  }
}

module.exports =  FoodDataController ;
