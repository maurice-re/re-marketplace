import { Handler } from "@netlify/functions";

const checkout: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};

export { checkout };
