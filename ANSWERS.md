## 1. How to run
npm install  
npm run dev  

## 2. Stack choice
Next.js + TypeScript + Tailwind
Fast setup, safe types, good UI speed.

Worse choice: Django
Too heavy for simple API consumer.

## 3. Edge case
Empty repo array handled in page.tsx:
reduce() used safely with fallback 0.

Without it app would crash on undefined reduce.

## 4. AI usage
Used AI to scaffold Next.js structure and API layer.
Modified error handling and added rate-limit handling manually.

## 5. Honest gap
No caching layer.
Would improve with SWR or React Query to reduce API calls and handle retries better.