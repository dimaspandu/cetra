import solid from "vite-plugin-solid";

export default {
  server: {
    port: 3173,
  },
  routers: [
    {
      name: "public",
      type: "spa",
      dir: "./src/routes",
      base: "/",
      handler: "./src/entry-client.tsx",
      target: "browser",
      plugins: () => [solid()],
    },
    {
      name: "ssr",
      type: "http",
      dir: "./src/routes",
      base: "/",
      handler: "./src/entry-server.tsx",
      target: "server",
      plugins: () => [solid()],
    },
  ],
};
