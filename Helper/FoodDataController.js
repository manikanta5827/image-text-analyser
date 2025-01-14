const TextExtractor = require("./TextExtractor");
const AIProcessor = require("./AIProcessor");

class FoodDataController {
  static async processFoodData(imageUrl, includeDetails = false) {
    try {
      // Extract text from the image
      const extractedText = await TextExtractor.extractFromImage(imageUrl);

      // Updated prompt for AI processing
      const prompt = `
      The input is extracted text from a hotel menu card. Your task is to:
      1. Identify and group all food items strictly under the categories explicitly mentioned in the input text. 
      2. Do not create or include any new categories that are not present in the input text, even if they seem relevant.
      3. Ensure all food names and categories are grammatically correct and formatted consistently, preserving the exact names from the menu text wherever possible.
      4. Assign each food item to the most relevant category explicitly mentioned in the menu. If a food item does not have a clear category, omit it from the output rather than assigning it to a new or undefined category.
      5. Include the correct price for each item. Retain the original currency format for prices (e.g., '$', '₹', 'rupees').
      6. Exclude any irrelevant or non-food-related text, ensuring the data is specific to the menu card provided.
      7. Include a 'diet' field for each food item with values 'veg' or 'Non-veg' based on the item's type.
      8. Provide a detailed and engaging description (3-5 sentences) for each food item in the 'description' field, highlighting its ingredients, taste, and appeal.
      
      Additional details:
      - If 'includeDetails' is true, add 'ingredients', 'nutrition', and 'spiceLevel' for each item. For items served cold, ensure 'spiceLevel' is set to 'null'.
      - If 'includeDetails' is false, exclude 'ingredients', 'nutrition', and 'spiceLevel' fields.
      
      Structure the output strictly as:
      {
        "categories": ["category1", "category2"],
        "items": [
          {
            "name": "food_name",
            "category": "category_name",
            "description": "Detailed and engaging description",
            "price": "price",
            "diet": "veg/Non-veg",
            ${includeDetails ? `
            "ingredients": ["ingredient1", "ingredient2"],
            "nutrition": {
              "fats": "value",
              "proteins": "value",
              "carbs": "value",
              "calories": "value"
            },
            "spiceLevel": spiceLevel_value` : ""}
          }
        ]
      }
      includeDetails: [${includeDetails}],
      Input text:
      [${extractedText}]
      
      Important Notes:
      - Return only the JSON response in the specified structure, without additional text, commentary, or formatting.
      - Ensure the food names, prices, and categories match exactly as they appear in the menu text.
      - Do not include any external or unrelated food item names or category names.
      - Do not exclude any food items that are clearly mentioned in the menu text and have a corresponding category.
      - Ensure grammatical and capitalization accuracy throughout.
      - Avoid using any formatting annotations such as \`\`\`.
      `;
      



      // Process with AI
      const aiProcessor = new AIProcessor();
      const structuredData = await aiProcessor.processWithGenAI(prompt);

      // Clean and parse the response
      const jsonResponse = JSON.parse(structuredData.replace(/```json|```/g, "").trim());

      return jsonResponse;
    } catch (error) {
      console.error("Error in FoodDataController:", error);
      throw new Error(error.message || "Failed to process food data.");
    }
  }
}

module.exports = FoodDataController;
