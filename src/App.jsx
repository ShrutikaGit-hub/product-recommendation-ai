import { useMemo, useState } from "react";

const PRODUCTS = [
  { id: 1, name: "NovaPhone X1", category: "Smartphone", price: 449, rating: 4.6, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", description: "Fast 5G smartphone with a bright OLED display and all-day battery.", features: ["5G", "OLED display", "128GB", "5000mAh battery"] },
  { id: 2, name: "PixelEdge Pro", category: "Smartphone", price: 699, rating: 4.8, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80", description: "Premium camera phone with a powerful processor and excellent display.", features: ["5G", "50MP camera", "256GB", "120Hz display"] },
  { id: 3, name: "AirBeat Wireless", category: "Headphones", price: 129, rating: 4.5, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", description: "Comfortable wireless headphones with active noise cancellation.", features: ["ANC", "Bluetooth 5.3", "30-hour battery", "Fast charging"] },
  { id: 4, name: "SoundMax Studio", category: "Headphones", price: 249, rating: 4.7, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80", description: "Studio-style headphones with rich sound and premium comfort.", features: ["Hi-Fi audio", "ANC", "40-hour battery", "Multipoint"] },
  { id: 5, name: "FitTrack S3", category: "Smartwatch", price: 179, rating: 4.4, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", description: "Fitness smartwatch with health tracking and a vibrant AMOLED screen.", features: ["Heart rate", "GPS", "AMOLED", "7-day battery"] },
  { id: 6, name: "ProBook Air 14", category: "Laptop", price: 799, rating: 4.7, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", description: "Slim laptop for coding, study and everyday productivity.", features: ["16GB RAM", "512GB SSD", "14-inch display", "Wi-Fi 6"] },
  { id: 7, name: "GameCore 15", category: "Laptop", price: 999, rating: 4.8, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80", description: "Performance laptop designed for gaming, development and creative work.", features: ["16GB RAM", "1TB SSD", "RTX graphics", "144Hz display"] },
  { id: 8, name: "TabView 11", category: "Tablet", price: 329, rating: 4.5, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80", description: "Lightweight tablet for streaming, reading and productivity.", features: ["11-inch display", "128GB", "Stylus support", "8000mAh"] }
];

const EXAMPLES = [
  "I want a phone under $500 with a good display and 5G",
  "I need headphones under $200 with noise cancellation",
  "I want a laptop for coding under $900",
];

function ProductCard({ product, index }) {
  return (
    <article className="product-card">
      <div className="image-wrap">
        <img src={product.image} alt={product.name} />
        {index === 0 && <span className="match-badge">Top match</span>}
      </div>
      <div className="product-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>★ {product.rating}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="features">
          {product.features.map(feature => <span key={feature}>{feature}</span>)}
        </div>
        <div className="card-bottom">
          <strong>${product.price}</strong>
          <span className="reason">{product.reason}</span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [preferences, setPreferences] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => [...new Set(PRODUCTS.map(p => p.category))],
    []
  );

  async function getRecommendations(event) {
    event?.preventDefault();
    if (!preferences.trim()) {
      setError("Tell me what you are looking for first.");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);
    setSummary("");

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Recommendation failed.");

      setRecommendations(data.recommendations || []);
      setSummary(data.summary || "Here are the products that best match your request.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function useExample(text) {
    setPreferences(text);
    setError("");
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <strong>SmartPick</strong>
            <span>AI Product Advisor</span>
          </div>
        </div>
        <div className="nav-pill">Powered by AI</div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">SMART SHOPPING</span>
            <h1>Find the right product <em>in seconds.</em></h1>
            <p>
              Tell SmartPick what you need in your own words. Our AI compares
              your preferences with the available catalog and recommends the best matches.
            </p>

            <form className="search-box" onSubmit={getRecommendations}>
              <div className="input-row">
                <span className="sparkle">✦</span>
                <input
                  value={preferences}
                  onChange={e => setPreferences(e.target.value)}
                  placeholder="e.g. I want a phone under $500 with 5G..."
                  aria-label="Product preferences"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Finding...</> : <>Get recommendations <span>→</span></>}
              </button>
            </form>

            <div className="examples">
              <span>Try:</span>
              {EXAMPLES.map(example => (
                <button key={example} onClick={() => useExample(example)}>
                  {example}
                </button>
              ))}
            </div>

            {error && <div className="error">⚠ {error}</div>}
          </div>

          <div className="hero-visual">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="ai-card">
              <div className="ai-card-head">
                <span className="live-dot" />
                AI recommendation engine
              </div>
              <div className="mini-result">
                <div className="mini-icon">📱</div>
                <div>
                  <strong>NovaPhone X1</strong>
                  <small>Great match • $449</small>
                </div>
                <span>96%</span>
              </div>
              <div className="mini-result">
                <div className="mini-icon">🎧</div>
                <div>
                  <strong>AirBeat Wireless</strong>
                  <small>Great match • $129</small>
                </div>
                <span>91%</span>
              </div>
              <div className="ai-line"><span /> Analyzing your preferences...</div>
            </div>
          </div>
        </section>

        <section className="catalog-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PRODUCT CATALOG</span>
              <h2>Explore the available products</h2>
            </div>
            <div className="catalog-count">{PRODUCTS.length} products · {categories.length} categories</div>
          </div>
          <div className="catalog-grid">
            {PRODUCTS.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>

        {recommendations.length > 0 && (
          <section className="recommendation-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">AI RESULTS</span>
                <h2>Your personalized recommendations</h2>
                <p className="summary">{summary}</p>
              </div>
              <div className="result-count">{recommendations.length} matches</div>
            </div>
            <div className="recommendation-grid">
              {recommendations.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <span>SmartPick AI</span>
        <span>React + OpenAI API</span>
      </footer>
    </div>
  );
}