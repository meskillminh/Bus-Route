module.exports = {
  friendlyName: "Getstoproutes",

  description: "Getstoproutes something.",

  inputs: {
    stop: {
      type: "string"
    }
  },

  exits: {
    success: {
      description: "All done."
    }
  },

  fn: async function(inputs) {
    var result = Place.find({ Name: inputs }).populateAll();
    // .exec(function(err, result) {
    //   if (err) {
    //     console.log("error");

    //   }//
    console.log(aaa);
    // return result;

    //});
  }
};
