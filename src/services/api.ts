import axios from 'axios';

const N8N_TRIGGER_URL = 'https://elvis04.app.n8n.cloud/webhook/09564c37-d5b4-4a9d-9503-6bbaa700b312/chat';
const password = "SoyUnTanque";
const username = "Elvis";
const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
export const sendMessageToHcatTrigger = async (message: string, sessionId:string|null): Promise<{message: string, sessionId: string|null}> => {

  try {
    const data =
    {
      "sessionId":sessionId,
      "action":
        "sendMessage",
      "chatInput":
        message,
    };

    return await axios.post(
      N8N_TRIGGER_URL,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth
        }
      }
    ).then(response => {
      console.log('response', response);
      console.log('response.data', response.data);
      console.log('response.data.output', response.data['output']);
      return {message: response.data['output'], sessionId: response.data['sessionId']};
    });
  } catch (error) {
    // throw new Error('Error enviando mensaje al trigger de n8n');
    return { message: `Error enviando mensaje al trigger de n8n: ${error}`, sessionId: 'sdfsdf' };
  }
};