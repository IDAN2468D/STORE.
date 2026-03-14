const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

// High-quality working Pexels images for each category
const categoryImages = {
  "אלקטרוניקה": [
    "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800", // Headphones
    "https://images.pexels.com/photos/5081431/pexels-photo-5081431.jpeg?auto=compress&cs=tinysrgb&w=800", // Smartwatch
    "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=800", // Speaker
    "https://images.pexels.com/photos/632483/pexels-photo-632483.jpeg?auto=compress&cs=tinysrgb&w=800",   // Camera
    "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=800"  // Tech gear
  ],
  "بيت ומטבח": [
    "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800",   // Coffee machine
    "https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?auto=compress&cs=tinysrgb&w=800", // Knife set
    "https://images.pexels.com/photos/3692639/pexels-photo-3692639.jpeg?auto=compress&cs=tinysrgb&w=800", // Kitchen gear
    "https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=800"  // Blender
  ],
  "כושר ובריאות": [
    "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800", // Yoga mat
    "https://images.pexels.com/photos/949132/pexels-photo-949132.jpeg?auto=compress&cs=tinysrgb&w=800",   // Dumbbells
    "https://images.pexels.com/photos/40751/running-shoes-shoes-sport-40751.jpeg?auto=compress&cs=tinysrgb&w=800" // Shoes
  ],
  "אופנה": [
    "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800",   // Shoes
    "https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=800", // Sunglasses
    "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=800",   // Bag
    "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"  // Wallet
  ],
  "אביזרים למחשב": [
    "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800", // Monitor
    "https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg?auto=compress&cs=tinysrgb&w=800", // Workplace
    "https://images.pexels.com/photos/585752/pexels-photo-585752.jpeg?auto=compress&cs=tinysrgb&w=800"    // Laptop
  ]
};

const defaultImages = [
  "https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=800"
];

function getRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function finalFix() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for final image fix");

        const products = await Product.find({});
        console.log(`Processing ${products.length} products...`);

        let count = 0;
        for (const p of products) {
            let cat = p.category || "אופנה";
            let images = categoryImages[cat] || defaultImages;
            
            // For specific items we want special logic or if we want to ensure uniqueness
            // But let's just rotate based on category for now to ensure working images
            const newImg = getRand(images);
            
            p.image = newImg;
            await p.save();
            count++;
        }

        console.log(`Successfully updated ${count} products with Pexels working images!`);
        process.exit(0);
    } catch (error) {
        console.error("Error fixing images:", error);
        process.exit(1);
    }
}

finalFix();
