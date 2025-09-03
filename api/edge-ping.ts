export const config = { runtime: "edge" };
export default () => new Response("EDGE OK " + new Date().toISOString());
