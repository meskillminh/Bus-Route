module.exports = {
  friendlyName: "Get current date",
  description: "Creates a new Date object and returns it",
  inputs: {},
  exits: {
    success: {
      outputFriendlyName: "Current date",
      outputType: "ref"
    }
  },
  fn: async function(inputs, exits) {
    return exits.success(new Date());
  }
};
