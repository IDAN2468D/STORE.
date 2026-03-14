const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

const electronics = ["1505740420928-5e560c06d30e", "1523275335684-37898b6baf30", "1608043152269-423dbba4e7e1", "1542744094-24638eff58bb", "1609592424109-dd999236f047", "1588872657578-7efd1f1555ed", "1491933382434-500287f9b54b", "1498050108023-c5249f4df085", "1526170375885-4d8ecf77b99f"];
const home = ["1510972527921-ce03766a1cf1", "1593618998160-e34014e67546", "1570275239925-4bd0aa93a0dc", "1507473885765-e6ed04393661", "1585771724684-252702b64428", "1556910103-1c02745aae4d", "1520608421441-df0962ae3be0", "1567620985-64860b00f72a"];
const health = ["1592432678016-e910b452f9a2", "1517836357463-d25dfeac3438", "1602143307185-8c1c55939bb0", "1550345332-09e3ac987658", "1542675234-9721597d62fc", "1571012752251-c165840a424a"];
const accessories = ["1548036328-c9fa89d128fa", "1572635196237-14b3f281503f", "1627123424574-724758594e93", "1584917865442-de89df764f7a", "1591561954937-299d4dc92953"];

function getRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function refresh() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for refresh");

        const products = await Product.find({ image: { $regex: 'unsplash' } });
        console.log(`Refreshing ${products.length} unsplash products.`);

        let count = 0;
        for (const p of products) {
            let id = "";
            let cat = p.category || "";
            
            if (cat === "אלקטרוניקה" || cat === "אביזרים למחשב" || cat === "גיימינג" || cat === "צילום") {
                id = getRand(electronics);
            } else if (cat === "בית ומטבח") {
                id = getRand(home);
            } else if (cat === "כושר ובריאות") {
                id = getRand(health);
            } else {
                id = getRand(accessories);
            }

            p.image = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
            await p.save();
            count++;
        }

        console.log(`Successfully refreshed ${count} products with working images!`);
        process.exit(0);
    } catch (error) {
        console.error("Error refreshing images:", error);
        process.exit(1);
    }
}

refresh();
