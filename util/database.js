//$env:GOOGLE_APPLICATION_CREDENTIALS="/credentials/backend-credentials.json"
const Firestore = require("@google-cloud/firestore");

const db = new Firestore({
  projectId: "final-project-348717",
});

module.exports = db;

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
