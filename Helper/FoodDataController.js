const TextExtractor = require("./TextExtractor");
const AIProcessor = require("./AIProcessor");

class FoodDataController {
    static async processFoodData(imageUrl) {
        try {
            // Extract text from the image
            const extractedText = await TextExtractor.extractFromImage(imageUrl);

            // Updated prompt for AI processing
            const prompt = `
            The input is extracted text from a hotel menu card. Your task is to:
            1. Identify and group all food items under their relevant categories (e.g., 'Biryani', 'Drinks', 'Desserts').
            2. Ensure all food names, categories, and prices are spelled correctly and formatted consistently.
            3. Detect and include the correct price for each item. Retain the original currency format for prices (e.g., '$', '₹', 'rupees').
            4. Assign missing categories based on the context of the input text intelligently.
            5. Ignore irrelevant or non-food-related text.
            6. Include a 'Type' field for each food item as 'veg' or 'Non-veg' based on the dish's type.
            7. Provide a brief 3-5 line description in the 'Info' field to attract customers.
            8. Provide a 'Rating' field with values between 1 to 5 based on the food item's appeal.
            9. Ensure the JSON structure is consistent.

            Structure the output strictly as:
            [
              {
                "category": "category_name",
                "items": [
                  {
                    "food": "food_name",
                    "price": 200,
                    "Type": "veg/Non-veg",
                    "Rating": 1-5,
                    "Info": "Brief description"
                  }
                ]
              }
            ]

            Input text:
            [${extractedText}]

            Important Notes:
            - Return only the JSON response in the specified structure, with no additional text, commentary, or formatting.
            - Ensure that all text adheres to proper grammatical and capitalization rules.
            - Do not include any formatting annotations such as \`\`\`.
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
