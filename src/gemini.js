import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const analyzeProduct = async (product) => {
  const { brand, productTitle, reviews } = product;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    // The response is a string, so we need to find the JSON part and parse it.
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonString);
    return json;
  } catch (error) {
    console.error("Error analyzing product:", error);
    return {
      error: "Failed to analyze product. Please check the console for more details.",
    };
  }
};
