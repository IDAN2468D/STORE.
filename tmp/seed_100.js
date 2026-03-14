const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 50 },
  rating: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const categories = [
    "אלקטרוניקה", "בית ומטבח", "כושר ובריאות", "אופנה", "אביזרים למחשב", "טיפוח אישי", "גיימינג", "צילום"
];

const productTemplates = [
    // Electronics
    { name: "אוזניות ביטול רעשים QuietComfort", category: "אלקטרוניקה", basePrice: 1200, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
    { name: "שעון חכם Ultra Pro 2", category: "אלקטרוניקה", basePrice: 1800, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
    { name: "רמקול בלוטות' היקפי 360", category: "אלקטרוניקה", basePrice: 450, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1" },
    { name: "טאבלט גרפי למעצבים", category: "אלקטרוניקה", basePrice: 950, img: "https://images.unsplash.com/photo-1542744094-24638eff58bb" },
    { name: "מטען נייד מהיר 30000mAh", category: "אלקטרוניקה", basePrice: 250, img: "https://images.unsplash.com/photo-1609592424109-dd999236f047" },
    
    // Home & Kitchen
    { name: "מכונת קפה אספרסו Luxury", category: "בית ומטבח", basePrice: 2200, img: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1" },
    { name: "סט סכיני שף מקצועי", category: "בית ומטבח", basePrice: 850, img: "https://images.unsplash.com/photo-1593618998160-e34014e67546" },
    { name: "בלנדר עוצמתי לשייקים", category: "בית ומטבח", basePrice: 600, img: "https://images.unsplash.com/photo-1570275239925-4bd0aa93a0dc" },
    { name: "מנורת שולחן חכמה", category: "בית ומטבח", basePrice: 320, img: "https://images.unsplash.com/photo-1507473885765-e6ed04393661" },
    { name: "מטהר אוויר HEPA", category: "בית ומטבח", basePrice: 1100, img: "https://images.unsplash.com/photo-1585771724684-252702b64428" },

    // Fitness
    { name: "מזרן יוגה Antislip", category: "כושר ובריאות", basePrice: 180, img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2" },
    { name: "סט משקולות מתכווננות", category: "כושר ובריאות", basePrice: 1400, img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438" },
    { name: "בקבוק מים תרמי חכם", category: "כושר ובריאות", basePrice: 150, img: "https://images.unsplash.com/photo-1602143307185-8c1c55939bb0" },
    { name: "רצועות התנגדות TRX Professional", category: "כושר ובריאות", basePrice: 350, img: "https://images.unsplash.com/photo-1550345332-09e3ac987658" },
    
    // Fashion/Accessories
    { name: "תיק גב מעור נאפה", category: "אופנה", basePrice: 550, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa" },
    { name: "משקפי שמש Classic Aviator", category: "אופנה", basePrice: 420, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f" },
    { name: "ארנק עור דק חוסם RFID", category: "אופנה", basePrice: 160, img: "https://images.unsplash.com/photo-1627123424574-724758594e93" },
    
    // Computer Accessories
    { name: "מקלדת מכנית RGB", category: "אביזרים למחשב", basePrice: 480, img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae" },
    { name: "עכבר גיימינג אלחוטי", category: "אביזרים למחשב", basePrice: 350, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf" },
    { name: "מסך קעור 34 אינץ'", category: "אביזרים למחשב", basePrice: 2800, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf" }, // Duplicate for now
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const products = [];
        for (let i = 1; i <= 100; i++) {
            const template = productTemplates[Math.floor(Math.random() * productTemplates.length)];
            const suffix = i > productTemplates.length ? ` (גרסה ${i})` : "";
            
            products.push({
                name: `${template.name}${suffix}`,
                description: `מוצר פרימיום מקטגוריית ${template.category}. מעוצב בקפידה לשימוש יומיומי עם דגש על איכות ועמידות לאורך זמן. חוויה יוצאת דופן לכל משתמש.`,
                price: template.basePrice + Math.floor(Math.random() * 50) - 25,
                image: `${template.img}?auto=format&fit=crop&w=800&q=80`,
                category: template.category,
                stock: Math.floor(Math.random() * 100) + 10,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                numReviews: Math.floor(Math.random() * 200) + 5
            });
        }

        await Product.insertMany(products);
        console.log(`Successfully added 100 products!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
}

seed();
