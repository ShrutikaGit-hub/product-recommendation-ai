import OpenAI from "openai";

const PRODUCTS = [
  {
    id: 1,
    name: "NovaPhone X1",
    category: "Smartphone",
    price: 449,
    rating: 4.6,
    description: "Fast 5G smartphone with a bright OLED display and all-day battery.",
    features: ["5G", "OLED display", "128GB", "5000mAh battery"]
  },
  {
    id: 2,
    name: "PixelEdge Pro",
    category: "Smartphone",
    price: 699,
    rating: 4.8,
    description: "Premium camera phone with a powerful processor and excellent display.",
    features: ["5G", "50MP camera", "256GB", "120Hz display"]
  },
  {
    id: 3,
    name: "AirBeat Wireless",
    category: "Headphones",
    price: 129,
    rating: 4.5,
    description: "Comfortable wireless headphones with active noise cancellation.",
    features: ["ANC", "Bluetooth 5.3", "30-hour battery", "Fast charging"]
  },
  {
    id: 4,
    name: "SoundMax Studio",
    category: "Headphones",
    price: 249,
    rating: 4.7,
    description: "Studio-style headphones with rich sound and premium comfort.",
    features: ["Hi-Fi audio", "ANC", "40-hour battery", "Multipoint"]
  },
  {
    id: 5,
    name: "FitTrack S3",
    category: "Smartwatch",
    price: 179,
    rating: 4.4,
    description: "Fitness smartwatch with health tracking and a vibrant AMOLED screen.",
    features: ["Heart rate", "GPS", "AMOLED", "7-day battery"]
  },
  {
    id: 6,
    name: "ProBook Air 14",
    category: "Laptop",
    price: 799,
    rating: 4.7,
    description: "Slim laptop for coding, study and everyday productivity.",
    features: ["16GB RAM", "512GB SSD", "14-inch display", "Wi-Fi 6"]
  },
  {
    id: 7,
    name: "GameCore 15",
    category: "Laptop",
    price: 999,
    rating: 4.8,
    description: "Performance laptop designed for gaming, development and creative work.",
    features: ["16GB RAM", "1TB SSD", "RTX graphics", "144Hz display"]
  },
  {
    id: 8,
    name: "TabView 11",
    category: "Tablet",
    price: 329,
    rating: 4.5,
    description: "Lightweight tablet for streaming, reading and productivity.",
    features: ["11-inch display", "128GB", "Stylus support", "8000mAh"]
  }
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { preferences } = req.body || {};

    if (!preferences || preferences.trim().length < 3) {
      return res.status(400).json({
        error: "Please enter your product preferences."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured."
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",

      input: `
You are a product recommendation assistant.

The user will describe what they want.

Choose ONLY products from the catalog.

Return ONLY JSON in exactly this format:

{
  "recommendedIds": [1, 3],
  "summary": "Short explanation"
}

Do not include markdown.
Do not include any other fields.
Choose maximum 3 products.

USER REQUEST:
${preferences}

PRODUCT CATALOG:
${JSON.stringify(PRODUCTS)}
`
    });

    const text = response.output_text.trim();

    console.log("AI RESPONSE:", text);

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        error: "AI returned an invalid JSON response."
      });
    }

    const ids = Array.isArray(result.recommendedIds)
      ? result.recommendedIds
      : [];

    const recommendations = ids
      .filter((id) =>
        PRODUCTS.some((product) => product.id === id)
      )
      .slice(0, 3)
      .map((id) => {
        const product = PRODUCTS.find(
          (product) => product.id === id
        );

        return {
          ...product,
          reason:
            result.summary ||
            "This product matches your preferences."
        };
      });

    return res.status(200).json({
      recommendations,
      summary:
        result.summary ||
        "These products best match your preferences.",
      count: recommendations.length
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Unable to generate recommendations."
    });
  }
}