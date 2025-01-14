const tesseract = require("tesseract.js");

class TextExtractor {
    static async extractFromImage(imageUrl) {
        try {
            const { data: { text } } = await tesseract.recognize(imageUrl, "eng");
            return text;
        } catch (error) {
            console.error("Error during OCR:", error);
            throw new Error("Failed to extract text from the image.");
        }
    }
} 

module.exports = TextExtractor;
