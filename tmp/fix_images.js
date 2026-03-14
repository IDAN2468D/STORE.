const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

async function fix() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const products = await Product.find({ image: { $regex: 'unsplash' } });
        console.log(`Found ${products.length} products with unsplash images.`);

        let count = 0;
        for (const product of products) {
            const baseUrl = product.image.split('?')[0];
            const newUrl = `${baseUrl}?auto=format&fit=crop&w=800&q=80`;
            if (product.image !== newUrl) {
                product.image = newUrl;
                await product.save();
                count++;
            }
        }

        console.log(`Successfully updated ${count} products!`);
        process.exit(0);
    } catch (error) {
        console.error("Error fixing images:", error);
        process.exit(1);
    }
}

fix();
