const mongoose = require('mongoose');

const uri = "mongodb+srv://adarshsingh097singh_db_user:070809aSs@worklife.pjcrlll.mongodb.net/?appName=Worklife";

console.log("Attempting to connect to MongoDB...");

mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:");
        console.error(err);
        process.exit(1);
    });
