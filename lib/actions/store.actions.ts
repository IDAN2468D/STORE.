"use server";

import { connectToDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import User from "@/models/User";

// Utility to serialize Mongoose documents to plain objects safely
const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

// === SEED — Enhanced products with categories, colors, sizes, gallery ===
export async function seedStoreData() {
  try {
    await connectToDB();

    // Ensure demo user exists atomically
    const user = await User.findOneAndUpdate(
      { email: "demo@user.com" },
      { $setOnInsert: { name: "Demo User", email: "demo@user.com" } },
      { upsert: true, returnDocument: "after" }
    );



    // Cleanup existing English categories if any (to avoid duplicates in filters)
    await Product.deleteMany({ category: { $in: ["Accessories", "Bags", "Electronics", "Footwear"] } });

    // Enhanced products with full details
    const productsData = [
      {
        name: "אוזניות אלחוטיות פרימיום",
        description: "סאונד עשיר עם ביטול רעשים פעיל. סוללה ל-30 שעות.",
        longDescription: "חוו סאונד כפי שמעולם לא חוויתם עם אוזניות הפרימיום האלחוטיות שלנו. טכנולוגיית ביטול רעשים מתקדמת, חיי סוללה של 30 שעות, וכריות אוזניים זיכרון רכות במיוחד לנוחות מקסימלית. דרייברים מותאמים אישית בקוטר 40 מ\"מ מספקים צליל עשיר ומפורט בכל התדרים. חיבור באמצעות Bluetooth 5.2 או כבל 3.5 מ\"מ המצורף.",
        price: 349.99,
        stock: 25,
        image: "/images/headphones.png",
        gallery: ["/images/headphones.png"],
        category: "אלקטרוניקה",
        colors: ["שחור מט", "כסף", "רוז גולד"],
        sizes: [],
        specifications: { "גודל דרייבר": "40 מ\"מ", "סוללה": "30 שעות", "קישוריות": "Bluetooth 5.2", "משקל": "265 גרם", "ביטול רעשים": "פעיל (ANC)" },
        rating: 4.8,
        reviewCount: 142,
        isFeatured: true,
      },
      {
        name: "שעון חכם פרו",
        description: "עקבו אחר הכושר שלכם, הישארו מחוברים. עמיד במים עד 50 מטר.",
        longDescription: "השעון החכם פרו משלב ניטור בריאות מתקדם עם עיצוב אלגנטי. מעקב אחר דופק, חמצן בדם, איכות שינה, ומעל 100 מצבי אימון. תצוגת AMOLED תמיד דולקת, בהירה וקריאה גם באור שמש ישיר. עם סוללה ל-7 ימים ועמידות במים עד 50 מטר, הוא נבנה כדי לעמוד בקצב החיים הפעיל שלכם.",
        price: 279.99,
        stock: 18,
        image: "/images/smartwatch.png",
        gallery: ["/images/smartwatch.png"],
        category: "אלקטרוניקה",
        colors: ["כסף", "שחור", "כחול נייבי"],
        sizes: ["40 מ\"מ", "44 מ\"מ"],
        specifications: { "תצוגה": "1.4\" AMOLED", "סוללה": "7 ימים", "עמידות במים": "50 מטר (5ATM)", "חיישנים": "דופק, SpO2, GPS", "תאימות": "iOS ו-Android" },
        rating: 4.6,
        reviewCount: 89,
        isFeatured: true,
      },
      {
        name: "תיק מסנג'ר מעור",
        description: "עבודת יד מעור איטלקי. מתאים למחשב נייד עד 15 אינץ'.",
        longDescription: "תיק מסנג'ר עשוי מעור איטלקי איכותי המשתבח עם הזמן. התא הראשי המרווח מתאים למחשב נייד עד 15 אינץ' בקלות, בעוד כיסים פנימיים מרובים שומרים על החפצים שלכם מאורגנים. רצועת הכתף המתכווננת מספקת נוחות לאורך כל היום, ואביזרי הפליז המוצקים מוסיפים נגיעה של יוקרה.",
        price: 189.99,
        stock: 12,
        image: "/images/bag.png",
        gallery: ["/images/bag.png"],
        category: "תיקים",
        colors: ["חום קוניאק", "חום כהה", "שחור"],
        sizes: [],
        specifications: { "חומר": "עור איטלקי משובח", "מחשב נייד": "עד 15 אינץ'", "מידות": "40×30×10 ס\"מ", "אביזרים": "פליז מוצק", "בטנה": "קנבס כותנה" },
        rating: 4.9,
        reviewCount: 67,
        isFeatured: false,
      },
      {
        name: "סניקרס מינימליסטיות",
        description: "נוחות קלה בשילוב עיצוב נצחי. זמש ועור איכותי.",
        longDescription: "הסניקרס המינימליסטיות האלו הן השילוב המושלם של סטייל ונוחות. עשויות מזמש ועור משובח עם סוליה פנימית מרופדת לנוחות לאורך כל היום. העיצוב הנקי והמינימלי משתלב ללא מאמץ עם כל לבוש, מג'ינס יומיומי ועד מכנסי צ'ינו אלגנטיים. סוליית הגומי העמידה מספקת אחיזה מצוינת.",
        price: 129.99,
        stock: 40,
        image: "/images/sneakers.png",
        gallery: ["/images/sneakers.png"],
        category: "הנעלה",
        colors: ["לבן", "שחור", "אפור"],
        sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
        specifications: { "חלק עליון": "זמש ועור", "סוליה": "גומי", "סוליה פנימית": "קצף זיכרון מרופד", "סגירה": "שרוכים", "משקל": "340 גרם לכל נעל" },
        rating: 4.7,
        reviewCount: 203,
        isFeatured: true,
      },
      {
        name: "משקפי שמש אביאטור",
        description: "עדשות פולורייזד UV400 עם מסגרת טיטניום מוזהבת. אופטיקה פרימיום.",
        longDescription: "סגנון אביאטור קלאסי פוגש טכנולוגיית עדשות מודרנית. משקפי שמש אלו כוללים עדשות פולורייזד UV400 המפחיתות סנוור ומגנות על העיניים מפני קרני UV מזיקות. מסגרת הטיטניום הקלה היא גם עמידה וגם נוחה ללבישה לאורך כל היום. מגיע עם נרתיק קשיח פרימיום ומטלית ניקוי מיקרופייבר.",
        price: 159.99,
        stock: 30,
        image: "/images/sunglasses.png",
        gallery: ["/images/sunglasses.png"],
        category: "אביזרים",
        colors: ["זהב/ירוק", "כסף/כחול", "שחור/אפור"],
        sizes: [],
        specifications: { "מסגרת": "טיטניום", "עדשות": "פולורייזד UV400", "הגנה": "100% UVA/UVB", "משקל": "28 גרם", "כולל": "נרתיק קשיח + מטלית" },
        rating: 4.5,
        reviewCount: 98,
        isFeatured: false,
      },
      {
        name: "תרמיל גב עירוני",
        description: "עמיד במים עם תא מרופד למחשב נייד. קיבולת של 28 ליטר.",
        longDescription: "מעוצב עבור הנוסע המודרני, תרמיל גב עירוני זה משלב סטייל עם פונקציונליות. הבד העמיד במים מגן על החפצים שלך מגשם קל, בעוד התא המרופד למחשב נייד בגודל 15.6 אינץ' שומר על הטכנולוגיה שלך בטוחה. כיסי ארגון מרובים, כיס נסתר נגד גניבה, ורצועות ארגונומיות נוחות הופכים אותו לתיק המושלם לשימוש יומיומי.",
        price: 99.99,
        stock: 35,
        image: "/images/backpack.png",
        gallery: ["/images/backpack.png"],
        category: "תיקים",
        colors: ["פחם", "נייבי", "זית"],
        sizes: [],
        specifications: { "חומר": "ניילון עמיד במים", "קיבולת": "28 ליטר", "מחשב נייד": "עד 15.6 אינץ'", "משקל": "680 גרם", "תכונות": "כיס נגד גניבה, יציאת USB" },
        rating: 4.4,
        reviewCount: 156,
        isFeatured: false,
      },
    ];

    // Upsert each product
    const products = [];
    for (const productData of productsData) {
      const existing = await Product.findOne({ name: productData.name });
      if (existing) {
        Object.assign(existing, productData);
        await existing.save();
        products.push(existing);
      } else {
        const newProduct = await Product.create(productData);
        products.push(newProduct);
      }
    }

    return {
      success: true,
      user: user ? parseStringify(user) : null,
      products: parseStringify(products),
    };
  } catch (error: unknown) {
    console.error("Failed to seed store data", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === GET ALL PRODUCTS with optional filters ===
export async function getAllProducts(params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sortBy?: string;
  search?: string;
}) {
  try {
    await connectToDB();

    // Build query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (params?.category && params.category !== "All") {
      filter.category = params.category;
    }
    if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
      filter.price = {};
      if (params?.minPrice !== undefined) filter.price.$gte = params.minPrice;
      if (params?.maxPrice !== undefined) filter.price.$lte = params.maxPrice;
    }
    if (params?.colors && params.colors.length > 0) {
      filter.colors = { $in: params.colors };
    }
    if (params?.search) {
      filter.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
        { category: { $regex: params.search, $options: "i" } },
      ];
    }

    // Build sort
    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (params?.sortBy === "price-asc") sort = { price: 1 };
    else if (params?.sortBy === "price-desc") sort = { price: -1 };
    else if (params?.sortBy === "rating") sort = { rating: -1 };
    else if (params?.sortBy === "name") sort = { name: 1 };

    const products = await Product.find(filter).sort(sort);
    return { success: true, data: parseStringify(products) };
  } catch (error: unknown) {
    console.error("Failed to fetch products", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === GET PRODUCT BY ID ===
export async function getProductById(productId: string) {
  try {
    await connectToDB();
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    return { success: true, data: parseStringify(product) };
  } catch (error: unknown) {
    console.error("Failed to fetch product", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === GET RELATED PRODUCTS ===
export async function getRelatedProducts(productId: string, category: string) {
  try {
    await connectToDB();
    const products = await Product.find({
      category,
      _id: { $ne: productId },
    }).limit(4);
    return { success: true, data: parseStringify(products) };
  } catch (error: unknown) {
    console.error("Failed to fetch related products", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === GET ALL CATEGORIES ===
export async function getCategories() {
  try {
    await connectToDB();
    const categories = await Product.distinct("category");
    return { success: true, data: categories as string[] };
  } catch (error: unknown) {
    console.error("Failed to fetch categories", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === SEARCH SUGGESTIONS (Autocomplete) ===
export async function getSearchSuggestions(query: string) {
  try {
    await connectToDB();
    if (!query || query.length < 2) return { success: true, data: [] };

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .select("name price image category")
      .limit(5);

    return { success: true, data: parseStringify(products) };
  } catch (error: unknown) {
    console.error("Failed to get suggestions", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
