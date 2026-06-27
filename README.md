# SnapCart AI

SnapCart AI is an intelligent shopping co-pilot that helps users make informed purchasing decisions. By analyzing screenshots of product listings from any e-commerce platform (Amazon, Flipkart, Myntra, etc.), it detects fake reviews, evaluates deal quality, and provides a clear verdict on whether to buy or skip.

## Features

- Platform Agnostic: Works with any e-commerce website or app via screenshots.
- Instant Analysis: Evaluates product deals, pricing, and seller reputation in seconds.
- Deal Scoring: Provides a quantitative score based on discount validity and review authenticity.
- Risk Assessment: Flags potential red flags such as suspicious reviews or unverified sellers.
- Local History: Maintains a persistent history of your analyzed products directly in the browser.

## Architecture

SnapCart AI uses a modern, lightweight architecture designed for speed and reliability.

- Frontend: Next.js 15, React, Tailwind CSS, Framer Motion
- Backend: FastAPI, Python
- AI Engine: Google Gemini 2.5 Flash (Vision)

The system is entirely stateless on the backend. The frontend handles image uploads, displays the analysis via a dynamic sleek UI, and stores scan history in local storage. The backend acts as a fast, secure proxy to the Gemini Vision API.

## Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Google Gemini API Key

### Backend Setup

1. Navigate to the root directory and install the required Python packages:
   pip install -r requirements.txt

2. Create a `.env` file in the project root and add your API key:
   GEMINI_API_KEY=your_api_key_here

3. Start the FastAPI server:
   python -m uvicorn backend.main:app --reload --port 8000

### Frontend Setup

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

4. Open http://localhost:3000 in your browser.

## Usage

1. Take a screenshot of any product listing.
2. Drag and drop the image into the SnapCart AI upload zone.
3. Wait a few seconds for the Gemini Vision model to analyze the listing.
4. Review the Deal Score, verdict, and AI brief to make your purchasing decision.
