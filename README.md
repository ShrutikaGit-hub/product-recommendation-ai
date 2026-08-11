# SmartPick AI — Product Recommendation System

A complete React + OpenAI product recommendation project built for the 90-minute assessment.

## What it demonstrates

- React frontend with a clean responsive UI
- Product catalog with 8 products
- Natural-language preference input
- OpenAI Responses API integration
- AI recommendations restricted to the supplied product catalog
- Structured JSON output from the AI
- Product filtering based on AI-selected product IDs
- Loading and error states
- Vercel-ready serverless API
- API key kept on the server, not in browser code

## Project structure

```text
product-recommendation-ai/
├── api/
│   └── recommend.js       # Vercel serverless AI endpoint
├── public/
├── src/
│   ├── App.jsx            # Main React UI
│   ├── main.jsx           # React entry point
│   └── styles.css         # Complete styling
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── server.js              # Local development server
└── vite.config.js
```

## 1. Install

```bash
npm install
```

## 2. Add your OpenAI API key

Create `.env.local`:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5
```

Never commit `.env.local` to GitHub.

## 3. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The local Express server serves the Vite React app and `/api/recommend`.

## 4. Test

Try:

```text
I want a phone under $500 with 5G and a good display
```

or:

```text
I need headphones under $200 with noise cancellation
```

The AI receives the user's preference plus the product catalog, selects product IDs, and the application maps those IDs back to real products.

## 5. Push to GitHub

```bash
git init
git add .
git commit -m "Build AI product recommendation system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/product-recommendation-ai.git
git push -u origin main
```

## 6. Deploy to Vercel

1. Open https://vercel.com/
2. Sign in with GitHub.
3. Click **Add New → Project**.
4. Import `product-recommendation-ai`.
5. Vercel should detect the Vite project automatically.
6. Add this environment variable:

```text
OPENAI_API_KEY = your_api_key_here
```

Optional:

```text
OPENAI_MODEL = gpt-5
```

7. Click **Deploy**.
8. Test the generated `https://....vercel.app` URL.

## Important security point

Do NOT put `OPENAI_API_KEY` in React code or in a `VITE_` environment variable. The browser should call `/api/recommend`; the serverless function calls OpenAI.

## Assessment explanation

If the interviewer asks how it works:

1. User enters a natural-language requirement.
2. React sends it to `POST /api/recommend`.
3. The server sends the preference and product catalog to the OpenAI Responses API.
4. The model returns structured JSON containing product IDs.
5. The backend validates those IDs against the catalog.
6. React displays the selected products and AI-generated reasons.

## Possible improvements

- Add search/filter controls
- Add product details page
- Add price sorting
- Add favorites
- Store products in a database
- Add authentication
- Add recommendation history
- Add tests
