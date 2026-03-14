const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

// Curated high-quality DIRECT working links from Unsplash Source / Pexels
// These are tested to be stable
const preciseImages = {
  "headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "smartwatch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  "speaker": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
  "camera": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
  "monitor": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  "keyboard": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80",
  "mouse": "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800",
  "powerbank": "https://images.pexels.com/photos/6095924/pexels-photo-6095924.jpeg?auto=compress&cs=tinysrgb&w=800",
  "tablet": "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80",
  
  "coffee": "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?auto=format&fit=crop&w=800&q=80",
  "knives": "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80",
  "blender": "https://images.unsplash.com/photo-1570275239925-4bd0aa93a0dc?auto=format&fit=crop&w=800&q=80",
  "lamp": "https://images.unsplash.com/photo-1507473885765-e6ed04393661?auto=format&fit=crop&w=800&q=80",
  "airpurifier": "https://images.pexels.com/photos/5857717/pexels-photo-5857717.jpeg?auto=compress&cs=tinysrgb&w=800",

  "yogamat": "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",
  "dumbbells": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  "waterbottle": "https://images.unsplash.com/photo-1602143307185-8c1c55939bb0?auto=format&fit=crop&w=800&q=80",
  "resistancebands": "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80",

  "backpack": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80", // Actually looks like a bag
  "backpack_real": "https://images.pexels.com/photos/1294731/pexels-photo-1294731.jpeg?auto=compress&cs=tinysrgb&w=800",
  "sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
  "wallet": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
  "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
};

async function sync() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for precision image sync");

        const products = await Product.find({});
        console.log(`Analyzing ${products.length} products...`);

        let count = 0;
        for (const p of products) {
            const name = p.name.toLowerCase();
            let finalImg = "";

            // Mapping names to precise images
            if (name.includes("quietcomfort") || name.includes("אוזניות")) finalImg = preciseImages.headphones;
            else if (name.includes("ultra pro") || name.includes("שעון")) finalImg = preciseImages.smartwatch;
            else if (name.includes("היקפי") || name.includes("רמקול")) finalImg = preciseImages.speaker;
            else if (name.includes("פולארויד") || name.includes("מצלמה")) finalImg = preciseImages.camera;
            else if (name.includes("מסך") || name.includes("מוניטור")) finalImg = preciseImages.monitor;
            else if (name.includes("מקלדת")) finalImg = preciseImages.keyboard;
            else if (name.includes("עכבר")) finalImg = preciseImages.mouse;
            else if (name.includes("מטען")) finalImg = preciseImages.powerbank;
            else if (name.includes("טאבלט")) finalImg = preciseImages.tablet;
            
            else if (name.includes("מכונת קפה") || name.includes("אספרסו")) finalImg = preciseImages.coffee;
            else if (name.includes("סכיני שף")) finalImg = preciseImages.knives;
            else if (name.includes("בלנדר")) finalImg = preciseImages.blender;
            else if (name.includes("מנורת שולחן")) finalImg = preciseImages.lamp;
            else if (name.includes("מטהר אוויר")) finalImg = preciseImages.airpurifier;
            
            else if (name.includes("יוגה")) finalImg = preciseImages.yogamat;
            else if (name.includes("משקולות")) finalImg = preciseImages.dumbbells;
            else if (name.includes("מים תרמי")) finalImg = preciseImages.waterbottle;
            else if (name.includes("התנגדות")) finalImg = preciseImages.resistancebands;
            
            else if (name.includes("תרמיל") || name.includes("backpack")) finalImg = preciseImages.backpack_real;
            else if (name.includes("תיק גב") || name.includes("תיק מסנג")) finalImg = preciseImages.backpack;
            else if (name.includes("משקפי שמש") || name.includes("אביאטור")) finalImg = preciseImages.sunglasses;
            else if (name.includes("ארנק") || name.includes("rfid")) finalImg = preciseImages.wallet;
            else if (name.includes("סניקרס") || name.includes("shoes")) finalImg = preciseImages.shoes;

            // Fallback for uncategorized or non-matched
            if (!finalImg) {
                if (p.category === "אלקטרוניקה") finalImg = preciseImages.speaker;
                else if (p.category === "בית ומטבח") finalImg = preciseImages.lamp;
                else if (p.category === "כושר ובריאות") finalImg = preciseImages.yogamat;
                else if (p.category === "אופנה") finalImg = preciseImages.backpack;
                else finalImg = preciseImages.smartwatch;
            }

            if (p.image !== finalImg) {
                p.image = finalImg;
                await p.save();
                count++;
            }
        }

        console.log(`Successfully precision-synced ${count} products!`);
        process.exit(0);
    } catch (error) {
        console.error("Error during sync:", error);
        process.exit(1);
    }
}

sync();
