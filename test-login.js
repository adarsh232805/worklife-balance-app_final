require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;
    const users = await db.collection('users').find({}).toArray();
    console.log("Users in DB:", users.map(u => ({ email: u.email, pwdLen: u.password?.length })));
    process.exit(0);
}
test().catch(console.error);
