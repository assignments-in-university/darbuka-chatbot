export const getEndpoint = () => {
  return import.meta.env.DEV ? 'http://localhost:3000' : 'https://darbuka-chatbot-lepj.vercel.app';
};
