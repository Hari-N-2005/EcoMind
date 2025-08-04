import OpenAI from "openai";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const analyzeProduct = async (product) => {
  const { brand, productTitle, reviews } = product;

  const prompt = `
    Analyze the following product for its sustainability, labor ethics, and animal welfare.
    Product Title: ${productTitle}
    Brand: ${brand}
    Reviews:
    ${reviews.join("\n- ")}

    Based on the information above, provide a score from 1 to 10 (1 being poor, 10 being excellent) for each of the following categories:
    - Sustainability
    - Labor Ethics
    - Animal Welfare

    Also, provide a brief one-sentence summary for each score.

    The output should be in JSON format like this:
    {
      "sustainability": {
        "score": 8,
        "summary": "The product is made with recycled materials."
      },
      "labor_ethics": {
        "score": 7,
        "summary": "The company has a public commitment to fair labor practices."
      },
      "animal_welfare": {
        "score": 9,
        "summary": "The product is certified cruelty-free."
      }
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error analyzing product:", error);
    return {
      error: "Failed to analyze product. Please check the console for more details.",
    };
  }
};
