const db = require("../util/database");



module.exports.findUserById = async function (uid) {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  } else {
    return doc.data();
  }
};

module.exports.postUser = async function (data, uid) {
  try {
    const res = await db.collection('users').doc(uid).set(data);
    return true;
  }
  catch {
    return false;
  }
};

module.exports.uploadImageProfile = async function(imageUrl, uid){
  const docRef = db.collection("users").doc(uid);
  try{
    const res = await docRef.update({imageUrl: imageUrl});
    return true;
  }
  catch{
    return false;
  }
}

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
