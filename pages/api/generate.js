import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const text = req.body.text || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter the prompt",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(text),
      temperature: 0.5,
      max_tokens: 60,
      top_p: 1.0,
      presence_penalty: 0.0,
      presence_penalty: 0.0
    });
    const responseText = completion.data.choices[0].text?.trim();
    const responseFields = responseText
    .replaceAll('\n',',')
    .split(',')
    .map(i => i.split(':')
    .map(ii => ii.trim()));
    console.log(responseFields);
    res.status(200).json({ results : { text: responseText, fields: responseFields }} );
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(text) {
  return `Extract information from "${text.replaceAll('\n', ',')}"`
}
