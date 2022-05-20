const db = require("../util/database");



module.exports.findUserById = async function (id) {
  const docRef = db.collection("users").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  } else {
    return doc.data();
  }
};

// const docRef = db.collection("users").doc("Catalin");
// async function createUser() {
//   await docRef.set({
//     name: "Chiriac Catalin",
//     birtdate: "10/05/2005",
//     email: "chiriac13@yahoo.com",
//     address: "Iasi, Iasi, Romania",
//     profileImageUrl: "someUrl"
//   });
// }

// createUser();
