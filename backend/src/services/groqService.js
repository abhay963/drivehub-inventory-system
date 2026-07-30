import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are AutoBot AI, an intelligent vehicle dealership assistant.

Your responsibilities:
- Recommend vehicles.
- Compare vehicles.
- Explain specifications.
- Answer dealership questions.
- ONLY recommend vehicles from the inventory provided.
- Never invent vehicles that are not in the inventory.
- If the user asks for unavailable vehicles, politely say they are unavailable.
- Keep responses friendly and concise.
`;

export const askGroq = async ({
  message,
  inventory = [],
  chatHistory = [],
}) => {
  try {
    // Convert MongoDB vehicles into readable text
    const inventoryText =
      inventory.length > 0
        ? inventory
            .map(
              (vehicle, index) => `
${index + 1}.
Brand: ${vehicle.brand}
Model: ${vehicle.model}
Category: ${vehicle.category}
Year: ${vehicle.year}
Price: ₹${vehicle.price}
Stock: ${vehicle.quantity}
`
            )
            .join("\n")
        : "No vehicles available.";

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },

      ...chatHistory,

      {
        role: "user",
        content: `
Available Inventory:

${inventoryText}

Customer Question:
${message}
        `,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.5,
      max_tokens: 800,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};