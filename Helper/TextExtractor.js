const tesseract = require("tesseract.js");
const { Jimp } = require("jimp");

class TextExtractor {

    static async preprocessImage(imagePath) {
        try {

            let processedImagePath = imagePath.replace(/(\.\w+)$/, "_processed$1");
            // Load the image into Jimp
            const image = await Jimp.read(imagePath);

            // Preprocess the image
            await image
                .greyscale() // Convert to grayscale
                .contrast(0.5) // Adjust contrast
                .normalize() // Normalize brightness and contrast
                .write(processedImagePath); // Save the processed image

            console.log(`Preprocessed image saved at: ${processedImagePath}`);
            return processedImagePath;
        } catch (error) {
            console.error("Error during image preprocessing:", error);
            throw new Error("Failed to preprocess the image.");
        }
    }


    static async extractFromImage(imageUrl) {
        try {
            // Preprocess the image
            // const processedImagePath = await this.preprocessImage(imageUrl);

            // Perform OCR using Tesseract.js
            const { data: { text } } = await tesseract.recognize(imageUrl, "eng");
            return text;
        } catch (error) {
            console.error("Error during OCR:", error);
            throw new Error("Failed to extract text from the image.");
        }
    }
}

module.exports = TextExtractor;
