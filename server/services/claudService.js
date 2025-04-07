import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';

const anthropic = new Anthropic({
  apiKey: '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', // defaults to process.env["ANTHROPIC_API_KEY"],
  dangerouslyAllowBrowser: true,
});

export const handleClaudService = async ({
    prompt,
    systemPrompt,
}) => {
  try {
    const stream = await anthropic.messages.stream({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 64000,
      system: systemPrompt,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }).on('text', (text) => {
      // console.log(text);
    });

    const message = await stream.finalMessage();
    return message.content;
    
    // return msg;

    // const response = await axios.post('https://api.anthropic.com/v1/messages', {
    //   model: "claude-3-7-sonnet-20250219",
    //   max_tokens: 1024,
    //   system: systemPrompt,
    //   messages: [{ role: "user", content: prompt }],
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key':
    //       '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',
    //     'anthropic-version': '2023-06-01'
    //   }
    // })
    // return response.data.content;
  } catch (error) {
    console.error('Error in handleClaudService:', error);
    return {
      error
    };
    // throw new Error('Failed to get message from Claude');
  }
}