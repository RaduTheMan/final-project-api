const db = require("../util/database");

module.exports.createPost = async function (uid, data) {
  try {
    console.log(data);
    const res = await db
      .collection("users")
      .doc(uid)
      .collection("posts")
      .add(data);
    return true;
  } catch {
    return false;
  }
};

module.exports.findPostsByUserId = async function (uid, lastDate) {
  console.log(uid, lastDate);
  let first;
  if (lastDate) {
    first = db
      .collection(`users/${uid}/posts`)
      .orderBy("date", "desc")
      .startAt(lastDate)
      .limit(10);
  } else {
    console.log("HERE in else");
    first = db
      .collection(`users/${uid}/posts`)
      .orderBy("date", "desc")
      .limit(10);
  }
  try {
    const snapshot = await first.get();
    console.log(snapshot.docs.map((doc) => doc.data()));
    return snapshot.docs.map((doc) => doc.data());
  } catch {
    // console.log("Error getting posts");
    return null;
  }
};
