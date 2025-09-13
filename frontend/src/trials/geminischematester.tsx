import React, { useState } from "react";

interface QuoteData {
  quote: string;
  author: string;
  fontFamily: string;
  backgroundImage: string;
  fontSize: number;
  fontColor: string;
}

const QuoteGenerator: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(5); // default number of quotes

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/batch-quotejson-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setQuotes(data.phrase);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center gap-6">
      {/* Input + Button */}
      <div className="flex gap-3">
        <input
          type="number"
          value={quantity}
          min={1}
          max={20}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="px-3 py-2 rounded border border-gray-300"
        />
        <button
          onClick={fetchQuotes}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Quotes"}
        </button>
      </div>

      {/* Quotes display */}
      <div className="w-full flex flex-col gap-6">
        {quotes.map((q, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-md"
            style={{
              backgroundImage: `url(${q.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              fontFamily: q.fontFamily,
              color: q.fontColor,
              fontSize: q.fontSize,
            }}
          >
            <p className="italic">“{q.quote}”</p>
            <p className="mt-4 font-bold text-right">— {q.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteGenerator;
