import dotenv from "dotenv";
import express from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Check whether API key is loaded
console.log(
  "OPENAI API KEY LOADED:",
  process.env.OPENAI_API_KEY ? "YES" : "NO"
);

const app = express();
const port = process.env.PORT || 5173;

// --------------------------------------------------
// PRODUCT CATALOG
// --------------------------------------------------

const PRODUCTS = [
  {
    id: 1,
    name: "NovaPhone X1",
    category: "Smartphone",
    price: 449,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    description:
      "Fast 5G smartphone with a bright OLED display and all-day battery.",
    features: [
      "5G",
      "OLED display",
      "128GB",
      "5000mAh battery"
    ]
  },

  {
    id: 2,
    name: "PixelEdge Pro",
    category: "Smartphone",
    price: 699,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    description:
      "Premium camera phone with a powerful processor and excellent display.",
    features: [
      "5G",
      "50MP camera",
      "256GB",
      "120Hz display"
    ]
  },

  {
    id: 3,
    name: "AirBeat Wireless",
    category: "Headphones",
    price: 129,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description:
      "Comfortable wireless headphones with active noise cancellation.",
    features: [
      "ANC",
      "Bluetooth 5.3",
      "30-hour battery",
      "Fast charging"
    ]
  },

  {
    id: 4,
    name: "SoundMax Studio",
    category: "Headphones",
    price: 249,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description:
      "Studio-style headphones with rich sound and premium comfort.",
    features: [
      "Hi-Fi audio",
      "ANC",
      "40-hour battery",
      "Multipoint"
    ]
  },

  {
    id: 5,
    name: "FitTrack S3",
    category: "Smartwatch",
    price: 179,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description:
      "Fitness smartwatch with health tracking and a vibrant AMOLED screen.",
    features: [
      "Heart rate",
      "GPS",
      "AMOLED",
      "7-day battery"
    ]
  },

  {
    id: 6,
    name: "ProBook Air 14",
    category: "Laptop",
    price: 799,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description:
      "Slim laptop for coding, study and everyday productivity.",
    features: [
      "16GB RAM",
      "512GB SSD",
      "14-inch display",
      "Wi-Fi 6"
    ]
  },

  {
    id: 7,
    name: "GameCore 15",
    category: "Laptop",
    price: 999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80",
    description:
      "Performance laptop designed for gaming, development and creative work.",
    features: [
      "16GB RAM",
      "1TB SSD",
      "RTX graphics",
      "144Hz display"
    ]
  },

  {
    id: 8,
    name: "TabView 11",
    category: "Tablet",
    price: 329,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight tablet for streaming, reading and productivity.",
    features: [
      "11-inch display",
      "128GB",
      "Stylus support",
      "8000mAh"
    ]
  }
];

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(express.json());

// --------------------------------------------------
// AI RECOMMENDATION API
// --------------------------------------------------

app.post("/api/recommend", async (req, res) => {
  try {
    const { preferences } = req.body || {};

    // Validate user input
    if (!preferences || preferences.trim().length < 3) {
      return res.status(400).json({
        error: "Please enter your product preferences."
      });
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error:
          "OPENAI_API_KEY is missing. Add it to .env.local."
      });
    }

    // Create OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Remove image URLs before sending catalog to AI
    const catalog = PRODUCTS.map(
      ({ image, ...product }) => product
    );

    // --------------------------------------------------
    // CALL OPENAI
    // --------------------------------------------------

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",

      input: [
        {
          role: "developer",
          content:
            "You are a product recommendation assistant. " +
            "Recommend ONLY products that exist in the provided catalog. " +
            "Return a maximum of 3 products. " +
            "Consider the user's category, budget, features, rating " +
            "and other preferences. " +
            "Provide a short explanation for every recommended product."
        },

        {
          role: "user",
          content:
            `User preference:\n${preferences}\n\n` +
            `Available product catalog:\n${JSON.stringify(catalog)}`
        }
      ],

      // --------------------------------------------------
      // STRUCTURED JSON OUTPUT
      // --------------------------------------------------

      text: {
        format: {
          type: "json_schema",

          name: "product_recommendations",

          strict: true,

          schema: {
            type: "object",

            properties: {
              recommendedIds: {
                type: "array",

                items: {
                  type: "integer"
                },

                maxItems: 3
              },

              summary: {
                type: "string"
              },

              reasons: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    id: {
                      type: "integer"
                    },

                    reason: {
                      type: "string"
                    }
                  },

                  required: [
                    "id",
                    "reason"
                  ],

                  additionalProperties: false
                },

                maxItems: 3
              }
            },

            required: [
              "recommendedIds",
              "summary",
              "reasons"
            ],

            additionalProperties: false
          }
        }
      }
    });

    // --------------------------------------------------
    // PARSE AI RESPONSE
    // --------------------------------------------------

    const result = JSON.parse(response.output_text);

    // --------------------------------------------------
    // FILTER AI RESULTS AGAINST OUR PRODUCT CATALOG
    // --------------------------------------------------

    const recommendations = result.recommendedIds
      .filter((id) =>
        PRODUCTS.some((product) => product.id === id)
      )

      .slice(0, 3)

      .map((id) => {
        const product = PRODUCTS.find(
          (product) => product.id === id
        );

        const reasonObject = result.reasons?.find(
          (item) => item.id === id
        );

        return {
          ...product,

          reason:
            reasonObject?.reason ||
            "Good match for your preferences."
        };
      });

    // --------------------------------------------------
    // SEND RESPONSE TO REACT
    // --------------------------------------------------

    res.json({
      recommendations,
      summary: result.summary,
      count: recommendations.length
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Unable to generate recommendations."
    });
  }
});

// --------------------------------------------------
// VITE SERVER
// --------------------------------------------------

const vite = await createViteServer({
  server: {
    middlewareMode: true
  },

  appType: "spa"
});

// Use Vite middleware
app.use(vite.middlewares);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(port, () => {
  console.log(
    `SmartPick AI running at http://localhost:${port}`
  );
});