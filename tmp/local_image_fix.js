const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

const localImages = {
  "אלקטרוניקה": "/images/headphones.png",
  "אביזרים למחשב": "/images/smartwatch.png",
  "גיימינג": "/images/headphones.png",
  "צילום": "/images/smartwatch.png", // Or generic tech
  "בית ומטבח": "/images/bag.png", // Closest fit if limited
  "כושר ובריאות": "/images/sneakers.png",
  "אופנה": "/images/bag.png",
  "טיפוח אישי": "/images/bag.png"
};

const imageMap = {
  "backpack": "/images/backpack.png",
  "bag": "/images/bag.png",
  "headphones": "/images/headphones.png",
  "smartwatch": "/images/smartwatch.png",
  "sneakers": "/images/sneakers.png",
  "sunglasses": "/images/sunglasses.png"
};

async function fix() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for local fallback fix");

        const products = await Product.find({});
        console.log(`Processing ${products.length} products...`);

        let count = 0;
        for (const p of products) {
            const name = p.name.toLowerCase();
            let newImg = "";

            // Keyword based matching for better relevancy
            if (name.includes("backpack") || name.includes("תרמיל") || name.includes("תיק גב")) newImg = imageMap.backpack;
            else if (name.includes("bag") || name.includes("תיק") || name.includes("ארנק")) newImg = imageMap.bag;
            else if (name.includes("headphones") || name.includes("אוזניות") || name.includes("רמקול")) newImg = imageMap.headphones;
            else if (name.includes("watch") || name.includes("שעון") || name.includes("מטען") || name.includes("טאבלט") || name.includes("מסך")) newImg = imageMap.smartwatch;
            else if (name.includes("shoes") || name.includes("sneakers") || name.includes("סניקרס") || name.includes("מזרן") || name.includes("משקולות")) newImg = imageMap.sneakers;
            else if (name.includes("sunglasses") || name.includes("משקפי שמש") || name.includes("אופטיקה")) newImg = imageMap.sunglasses;
            
            // Category fallback if no keyword match
            if (!newImg) {
                newImg = localImages[p.category] || "/images/hero.png";
            }

            // Special case for the "Polaroid" camera which failed significantly
            if (name.includes("פולארויד") || name.includes("camera")) newImg = "/images/smartwatch.png"; // Tech replacement

            p.image = newImg;
            await p.save();
            count++;
        }

        console.log(`Successfully updated ${count} products with LOCAL working images!`);
        process.exit(0);
    } catch (error) {
        console.error("Error fixing images:", error);
        process.exit(1);
    }
}

fix();
