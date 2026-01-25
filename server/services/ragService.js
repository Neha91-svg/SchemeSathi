import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const processRAG = async (text) => {
    console.log("RAG function called with text length:", text.length);

    try {
        const summary = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "Summarize this government scheme in 3 bullets" },
                { role: "user", content: text },
            ],
        });

        const eli10 = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "Explain the scheme like I'm 10, in simple terms" },
                { role: "user", content: text },
            ],
        });

        return {
            summary: summary.choices[0].message.content,
            eli10: eli10.choices[0].message.content,
        };
    } catch (error) {
        console.error("Error in processRAG:", error);
        throw error;
    }
};
