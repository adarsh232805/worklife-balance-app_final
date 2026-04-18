const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDY6h15hSp8N6zINY6lDKhzahmwHF2i8k8";

async function test() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("-----------------------------------------");
    console.log("TESTING MODEL: gemini-flash-latest");
    console.log("-----------------------------------------");

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello, are you working?");
        console.log("✅ SUCCESS:");
        console.log(result.response.text());
    } catch (error) {
        console.log("❌ FAIL:");
        console.log(error.message);
    }
}

test();
