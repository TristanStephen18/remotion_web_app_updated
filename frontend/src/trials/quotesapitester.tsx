// src/QuoteTester.tsx
import React, { useState } from "react";

interface Quote {
  text: string;
  author: string;
  book?: string;
  source: string;
}

const QuoteTester: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch multiple from Quotable
 // quotesapitester.tsx (or App.tsx)

const fetchQuotable = async (count: number = 1) => {
  try {
    setLoading(true);
    // Use /random endpoint count times, since list/limit isn't supported as before
    const promises = Array.from({ length: count }, () =>
      fetch("https://api.quotable.io/random").then(r => {
        if (!r.ok) throw new Error(`Quotable error ${r.status}`);
        return r.json();
      })
    );
    const results = await Promise.all(promises);
    const formatted = results.map((q: any) => ({
      text: q.content,
      author: q.author,
      source: "Quotable",
    }));
    setQuotes(formatted);
  } catch (err) {
    console.error("fetchQuotable error:", err);
    alert("Failed to fetch from Quotable");
  } finally {
    setLoading(false);
  }
};

const fetchRecite = async (count: number = 1) => {
  try {
    setLoading(true);
    const promises = Array.from({ length: count }, () =>
      fetch("https://recite.onrender.com/api/v1/random").then(r => {
        if (!r.ok) throw new Error(`Recite error ${r.status}`);
        return r.json();
      })
    );
    const results = await Promise.all(promises);
    const formatted = results.map((q: any) => ({
      text: q.quote,
      author: q.author,
      book: q.book,
      source: "Recite",
    }));
    setQuotes(formatted);
  } catch (err) {
    console.error("fetchRecite error:", err);
    alert("Failed to fetch from Recite");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1>📚 Literature Quotes</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => fetchQuotable(3)} disabled={loading}>
          Get 3 from Quotable
        </button>{" "}
        <button onClick={() => fetchRecite(10)} disabled={loading}>
          Get 3 from Recite
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {quotes.map((q, idx) => (
        <div
          key={idx}
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "1.2rem", fontStyle: "italic" }}>"{q.text}"</p>
          <p>
            — <strong>{q.author}</strong>
            {q.book && <span> (from {q.book})</span>}
          </p>
          <small>Source: {q.source}</small>
        </div>
      ))}
    </div>
  );
};

export default QuoteTester;
