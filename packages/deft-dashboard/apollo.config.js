module.exports = {
  client: {
    service: {
      name: "deft-nobots",
      // localSchemaFile: "./schema.graphql",
      url: "http://localhost:8000/subgraphs/name/deft/deft",
      skipSSLValidation: true,
    },
    includes: ["./src/graphql/**/*.ts"],
  },
};
