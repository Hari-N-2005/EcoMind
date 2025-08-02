export class OpenAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async analyzeBrand(brandName, productInfo) {
    const prompt = `Analyze the brand "${brandName}" for the following product: ${productInfo.title}. 

    Provide a comprehensive analysis covering:
    1. Environmental Impact (sustainability practices, carbon footprint, eco-friendly materials)
    2. Labor Practices (worker conditions, fair wages, supply chain transparency)
    3. Animal Welfare (cruelty-free status, animal testing policies)
    4. Overall Transparency (public reporting, certifications, third-party audits)

    Rate each category from 1-10 and provide a brief explanation for each score.
    
    Format the response as JSON:
    {
      "scores": {
        "environmental": number,
        "labor": number,
        "animalWelfare": number,
        "transparency": number
      },
      "summary": "brief overall summary",
      "details": {
        "environmental": "explanation",
        "labor": "explanation", 
        "animalWelfare": "explanation",
        "transparency": "explanation"
      }
    }`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in corporate sustainability, labor practices, and ethical business analysis. Provide accurate, factual information based on publicly available data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async answerQuestion(question, brandName, brandAnalysis) {
    const prompt = `Based on the following brand analysis for ${brandName}, answer this question: "${question}"

    Brand Analysis:
    ${JSON.stringify(brandAnalysis, null, 2)}

    Provide a clear, factual answer based on the analysis data.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that answers questions about brand ethics and sustainability based on provided analysis data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}
