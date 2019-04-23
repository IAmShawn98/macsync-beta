// Initialize Firebase
var config = {
    apiKey: "AIzaSyDUpML5zoQkrOHrGlVIQfsM7k0lwOhyWXI",
    authDomain: "bugreports-7446b.firebaseapp.com",
    databaseURL: "https://bugreports-7446b.firebaseio.com",
    projectId: "bugreports-7446b",
    storageBucket: "bugreports-7446b.appspot.com",
    messagingSenderId: "746899429215"
};

firebase.initializeApp(config);

// Reference to the DB we want to read from.
var reportsDB = firebase.database().ref('bugreports');

// Listen for submit.
document.getElementById('brForm').addEventListener('submit', submitReport);

// When a submit is triggered, push data through the main form.
function submitReport(e) {
    e.preventDefault();
    // Global DB variables.
    var ReportDescription = getInputVal('ReportDescription');
    var sendersName = getInputVal('sendersName');
    alert();
    // Push file data into a save.
    saveFile(sendersName, ReportDescription);

}
// Listen for form data.
function getInputVal(id) {
    return document.getElementById(id).value;
}
// Save file to the DB.
function saveFile(sendersName, ReportDescription) {
    var newMessageRef = reportsDB.push();
    newMessageRef.set({
        sendersName: sendersName,
        ReportDescription: ReportDescription,
    });
}