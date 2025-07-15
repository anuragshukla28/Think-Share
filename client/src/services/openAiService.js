// openAiService.js (rename if you want)
export const getAIHelp = async (prompt) => {
    const res = await fetch("http://localhost:8001/api/v1/gemini/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  
    const data = await res.json();
    return data.data;
  };
  