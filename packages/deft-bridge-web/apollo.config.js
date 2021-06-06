module.exports = {
  client: {
    service: {
      name: "deft-bridge",
      url: "http://localhost:8000/subgraphs/name/deft/deft-bridge-ropsten",
      skipSSLValidation: true,
    },
    includes: ["./src/graphql/**/*.ts"],
  },
};
