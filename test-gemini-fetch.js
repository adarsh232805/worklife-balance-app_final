const fs = require('fs');

const API_KEY = "AIzaSyDY6h15hSp8N6zINY6lDKhzahmwHF2i8k8";
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    console.log("Fetching models...");
    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (data.models) {
            const names = data.models.map(m => m.name).join('\n');
            fs.writeFileSync('models.txt', names);
            console.log("Written to models.txt");
        } else {
            console.log("Error:", JSON.stringify(data));
        }
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

listModels();
