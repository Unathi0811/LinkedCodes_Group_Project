const { collection, getDocs, query } = require("firebase/firestore");
const {db} = require("./fb");

const q = query(collection(db, "reports"));

const REPORT_TYPE = ["ROAD", "BRIDGE"];
const ACCIDENT_REPORT = [true, false];

getDocs(q).then((snapshot) => {
  snapshot.forEach((doc) => {
    const R_T_R = Math.floor(Math.random() * REPORT_TYPE.length)
    const A_R_R = Math.floor(Math.random() * ACCIDENT_REPORT.length)
    console.log(doc.id, R_T_R, A_R_R);
  });
});