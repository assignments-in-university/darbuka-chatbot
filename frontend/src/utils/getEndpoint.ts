export const getEndpoint = () => {
  return import.meta.env.DEV ? 'http://localhost:3000' : 'n/a';
};
