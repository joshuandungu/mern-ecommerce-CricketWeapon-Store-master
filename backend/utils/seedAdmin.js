const User = require("../models/userModel");
const dotenv = require("dotenv");

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            return;
        }

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: process.env.ADMIN_NAME || "Admin",
                email: adminEmail,
                password: process.env.ADMIN_PASSWORD || "admin@123",
                role: "admin",
                avatar: {
                    public_id: "admin_avatar",
                    url: "https://res.cloudinary.com/demo/image/upload/v131234567/sample.jpg"
                }
            });
            console.log("Admin account created automatically.");
        }
    } catch (error) {
        console.log(`Error seeding admin user: ${error.message}`);
    }
};

module.exports = seedAdmin;