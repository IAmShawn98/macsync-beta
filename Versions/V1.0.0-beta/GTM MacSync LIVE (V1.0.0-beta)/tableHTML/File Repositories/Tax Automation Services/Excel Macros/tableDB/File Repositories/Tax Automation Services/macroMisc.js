// This is the server code for Tax Automation Services 'Test Table' for the purpose of prototyping the production build of all sync tables.

// Init Firebase App.
const app = firebase.initializeApp({
  apiKey: "AIzaSyAt0fcLJvbmKEihoSOGnJCO5RcV5maQ0Qo",
  authDomain: "macromisc.firebaseapp.com",
  databaseURL: "https://macromisc.firebaseio.com",
  projectId: "macromisc",
  storageBucket: "macromisc.appspot.com",
})

// Global ToolTip.
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});


// Reference the DB we are writing to.
var macroMiscDB = firebase.database().ref('macromisc');

// Listen for data submissions to the DB.
document.getElementById('DataTableDBForm').addEventListener('submit', submitForm);

// When a submit is triggered by the user, save the data.
function submitForm(e) {
  e.preventDefault(); // Prevents the usual submit functionality during a save.

  // Global variables used to put our user info into for later table population.
  var fName = getInputVal('fName'); // File Name.
  var fLink = getInputVal('fLink'); // File Link.
  var fAuthor = getInputVal('fAuthor'); // File Author.
  var fUploader = getInputVal('fUploader'); // File Uploader.
  var pubDate = getInputVal('pubDate'); // Date Published.
  var fSize = getInputVal('fSize'); // File Size.
  var mailTo = getInputVal('mailTo'); // Dev Email.
  //var tName = getInputVal('tName'); // Table Name. (Coming Soon)

  // Push file data into a save.
  saveFile(fName, fLink, fAuthor, fUploader, pubDate, fSize, mailTo);
}

// Listen for submit data.
function getInputVal(id) {
  return document.getElementById(id).value;
}

// Save submit data into their respective variables.
function saveFile(fName, fLink, fAuthor, fUploader, pubDate, fSize, mailTo) {
  var newMessageRef = macroMiscDB.push();
  newMessageRef.set({
    fName: fName,
    fLink: fLink,
    fAuthor: fAuthor,
    fUploader: fUploader,
    pubDate: pubDate,
    fSize: fSize,
    mailTo: mailTo,
    //tName: tName
    //cStatusOnline: "Online!",
  });
}

// Populate the Sync Table with each new entry in order by key.
var userDataRef = firebase.database().ref("macromisc").orderByKey();
userDataRef.once("value")
  .then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();

      var fName = childSnapshot.val().fName; // File Name.
      var fLink = childSnapshot.val().fLink; // File Link.
      var fAuthor = childSnapshot.val().fAuthor; // File Authir.
      var fUploader = childSnapshot.val().fUploader; // File Uploader.
      var pubDate = childSnapshot.val().pubDate; // Date Published.
      var fSize = childSnapshot.val().fSize; // File Size.
      var mailTo = childSnapshot.val().mailTo; // Dev Email.
      //var tName = childSnapshot.val().tName; // Table Name. (Coming Soon)

      // Sync Table Error Buffer.
      if (fName === "") {
        F = document.getElementById("file").value
        fAuthor = "-";
        fUploader = "-";
        pubDate = "-"
        fName = "Untitled File";
      } else if (fAuthor === "", fUploader === "", pubDate === "") {
        fAuthor = "-";
        fUploader = "-";
        pubDate = "-"
      }
      if (fLink === "") {
        fName = "<strike class='text-danger'>" + fName + "</strike>";
        fAuthor = "-";
        fUploader = "-";
        pubDate = "-"
        fLink = "./404.html";
      }
      if (fName === "ReadMe") {
        fName = "<span style='color: #6f42c1; cursor: help;'><b>" + fName + "</b></span>";
      }

      // If a file isn't selected, or there is an issue with a file, handle memory and alert the user.
      if (fSize === "Upload File") {
        fSize = "0 KB";
        // Sound Data Path.
        var audio = new Audio('./audio/success.mp3');
        // Notify the user of the persisting error.
        $.notify({
          // Notify Settings.
          icon: 'fa fa-refresh',
          title: '<b>File Integrity:</b> ',
          message: 'One or more files within this repository have been marked as problematic. Please check to make sure the files marked in red are still downloading properly.',
        })
        // Trigger Notification Sound.
        audio.play();
      } else if (fSize != "Upload File") {
        fSize = fSize;
      }

      // If mailTo contains nothing, handle this.
      var ifContainsNothingDoWarn = "text-primary"; // We define our data object to avoid a definition error.
      var mailTo = "mailto:" + mailTo;

      // Correct mailTo issue once found.
      if (mailTo === "mailto:" + "") {
        // If 'mailTo' is empty, disable icon.
        ifContainsNothingDoWarn = "d-none";
      } else {
        // If a string returns valid data, do regular activity.
        mailTo = mailTo;
        ifContainsNothingDoWarn = "text-primary";
      }

      // Format our DB snapshots into readable HTML.
      var repoCustomSyncTable = "";

      // *******************************************************************SYNC TABLE**********************************************************************************************************************************************
      repoCustomSyncTable += "<tr data-toggle='collapse' data-target='#demo' style='font-size: 150%;'>"

      // File Name.
      repoCustomSyncTable += "<td class='tableItem'>" + "<a class='text-info' href='" + fLink + "'>" + fName + "</a></td>"
      // File Size.
      repoCustomSyncTable += "<td class='tableItem'><span id='fSize'>" + fSize + "</span></td>"
      // Developer Emails.
      repoCustomSyncTable += "<td class='tableItem'><a title='Contact This Person?' id='mailDev' href=" + mailTo + "><i disabled class='fa fa-envelope text-primary animated pulse infinite " + ifContainsNothingDoWarn + "' aria-hidden='true'></i></a> " + fAuthor + "</td>"
      // Upload By.
      repoCustomSyncTable += "<td class='tableItem'>" + fUploader + "</td>"
      // Uploaded On.
      repoCustomSyncTable += "<td class='tableItem'>" + pubDate + "</td>"
      // File IDs.
      repoCustomSyncTable += "<td class='tableItem' contenteditable spellcheck='false'><span class='text-warning'><b>" + childSnapshot.key + "</b></span></td>"
      // File Actions
      repoCustomSyncTable += "<td style='font-size: 170%; cursor: pointer;' class='tableItem'><a class='text-warning'><i id='edit' class='fa fa-pencil' data-toggle='modal' data-target='#upEdModal'></i></a> <a class='text-danger' onclick='removeFile();'><i class='fa fa-trash'></i></a></td>"

      repoCustomSyncTable += "</tr>"
      // *******************************************************************SYNC TABLE**********************************************************************************************************************************************

      // Populate our table with the user entered data.
      $("#syncTableContent").append(repoCustomSyncTable);
      $("#cStatusOnline").append(cStatusOnline);
      //$(".tName").append(tName);

      // Let the user know that the Sync Table is ready and online!
      if (fName = "onlineStatus") {
        // pull "Online!" from 'ReadMe' checker....
        var cStatusOnline = childSnapshot.val().cStatusOnline;
        // Append data to the HTML breadcrumb....
        $("#cStatusOnline").append(cStatusOnline);
        // Remove loaders after connection established!
        $("#DBLoadNormal").remove();
        $("#DBLoadLonger").remove();
        $("#cStatusOffline").remove();
        $("#cStatusOfflineResolve").remove();
      }
    });
  });

// File Upload functionality.
function fileChange(ev) {
  // Process file....
  document.getElementById("save-data").style.display = "none";
  document.getElementById("btnProcessing").style.display = "block";

  var target = ev.target;
  var file = target.files[0];
  var storageRef = firebase.storage().ref();
  var thisRef = storageRef.child("Uploads/" + file.name);
  var fNameDefault = file.name;

  // TimeStamp File....
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; // January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  // Date Format.
  var today = mm + '-' + dd + '-' + yyyy;
  // Push data to input for catching submit.

  // Populate form with info from the file you are uploading.
  document.getElementById('fName').value = fNameDefault; // Populate the name of the file.
  document.getElementById('pubDate').value = today; // populate the date it was uploaded.

  // Populate #fLink with downloadURL....
  thisRef.put(file).then(function (snapshot) {
    snapshot.ref.getDownloadURL().then(function (downloadURL) {
      // Append downloadURL to #fLink.
      $("#fLink").append(downloadURL);
      // Let the user know the file is ready to be synced.
      document.getElementById("btnProcessing").style.display = "none";
      document.getElementById("save-data").style.display = "block";
      // Copy the data to clip
      function copyToClipboard(text) {
        var dummy = document.getElementById("fLink");
        dummy.setAttribute('value', text);
        dummy.select();
        document.execCommand("copy");
      }
      copyToClipboard('clipData')
    })
    // Get and store the file path.
    var x = document.getElementById("file").value;
    document.getElementById("file").innerHTML = x;
  });
}
// Listen to the js input 'File' API.
var inputFile = document.getElementById('file');
inputFile.addEventListener('change', fileChange, false);

// Alert the user that their file has been uploaded to the Sync Table.
function pushData() {
  // Notification sound data.
  var audio = new Audio('./audio/success.mp3');
  // Show sync notification.
  $.notify({
    // Notify Settings.
    icon: 'fa fa-exclamation-triangle',
    title: '<b>Sync Table:</b> ',
    message: 'Your files were successfully added to the table!',
  })
  // Trigger notification sound.
  audio.play();

  // Trigger table ReSync.
  document.getElementById("btnReSync").style.display = "block";
  document.getElementById("save-data").style.display = "none";

  // Refresh page.
  setTimeout(() => {
    location.reload();
  }, 2000);

}
// Hide 'Sync Data' when the edit tab is open.
function syncHide() {
  // Hide Sync button.
  $("#save-data").hide("");
  // Show 'Finish Editing' button.
  $("#edit-data").show("");
  // Hide one-click contacting.
  $("#oneClickContacting").hide("");
}
// Hide 'Sync Data' when the edit tab is open.
function syncShow() {
  // show 'Finish Editing' buttn.
  $("#save-data").show("");
  // Hide Sync button.
  $("#edit-data").hide();
  // show one-click contacting
  $("#oneClickContacting").show("");
}
// Listen for 'File ID'.
function fileID() {
  fileID = document.getElementById('fID').value;
}

// Toggle fAuthor email.
function toggleAuthEmail() {
  $("#authMail").toggle();
}

// Update fName.
function changeMacName() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  fName = document.getElementById('fileName').value
  data = { fName }
  // Do the update.
  userId = fileID;
  fireDB.child('/macromisc/' + userId).update(data);
}
// Update fAuthor.
function changeAuthDev() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  fAuthor = document.getElementById('authName').value
  data = { fAuthor }
  // Do the update.
  userId = fileID;
  fireDB.child('/macromisc/' + userId).update(data);
}
// Update fUploader.
function changeUploadBy() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  fUploader = document.getElementById('upload').value
  data = { fUploader }
  // Do the update.
  userId = fileID;
  fireDB.child('/macromisc/' + userId).update(data);
}
// Update pubDate.
function changeUploadedDate() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  pubDate = document.getElementById('dateUploaded').value
  data = { pubDate }
  // Do the update.
  userId = fileID;
  fireDB.child('/macromisc/' + userId).update(data);
}
// Update #fLink.
function changeLink() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  fLink = document.getElementById('macLinkNew').value
  data = { fLink }
  // Do the update.
  userId = fileID;
  fireDB.child('/macromisc/' + userId).update(data);
}

// Delete a single file.
function delMac() {
  const fireDB = firebase.database().ref()
  // Do delete.
  specialFile = document.getElementById('fID').value
  fireDB.child("/macromisc/" + specialFile).remove();
  // Clear input.
  document.getElementById('fID').value = '';

  // Notification sound data.
  var audio = new Audio('./audio/success.mp3');
  // Show deletion notification.
  $.notify({
    // Notify Settings.
    icon: 'fa fa-warning',
    title: '<b>Sync Table:</b> ',
    message: 'You have removed a file from the table.',
  })
  // Trigger notification sound.
  audio.play();

  // Refresh page.
  setTimeout(() => {
    location.reload();
  }, 400);
}

// Delete a single file (Table Actions).
function removeFile() {
  event.preventDefault();
  const fireDB = firebase.database().ref();
  // Do delete.
  delItNow = prompt("In order to delete a file from your Sync Table, you will need to enter the File ID associated with it. Only hit 'OK' if you're ready to delete a file. If you hit this button by mistake hit 'no' to cancel this action. ")
  specialFile = document.getElementById('fID').value = delItNow;
  // Check for and only pass legal deletion requests.
  if (specialFile === "") {
    alert("Please enter a valid File ID.") // Invalid File ID.
  } else {
    fireDB.child("/macromisc/" + specialFile).remove(); // Else Legal Request.

    // Notification sound data.
    var audio = new Audio('./audio/success.mp3');
    // Show deletion notification.
    $.notify({
      // Notify Settings.
      icon: 'fa fa-warning',
      title: '<b>Sync Table:</b> ',
      message: 'You have removed a file from the table.',
    })
    // Trigger notification sound.
    audio.play();

    // Refresh page.
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}
// File Size Calculator.
$(document).ready(function () {
  $("#file").change(function () {
    var iSize = ($("#file")[0].files[0].size / 1024);
    if (iSize / 1024 > 1) {
      if (((iSize / 1024) / 1024) > 1) {
        iSize = (Math.round(((iSize / 1024) / 1024) * 100) / 100);
        $("#fSize").val(iSize + " GB");
      }
      else {
        iSize = (Math.round((iSize / 1024) * 100) / 100)
        $("#fSize").val(iSize + " MB");
      }
    }
    else {
      iSize = (Math.round(iSize * 100) / 100)
      $("#fSize").val(iSize + " KB");
    }
  });
});
// Temporary "security" for wiping the database. (Pre-production)
function wipeDB() {
  auth = prompt("This action will remove all data within this repository. You will need the security code to continue this action.")
  if (auth === "45100") { // Haha, so secure! Yeah, I know your inspecting this, just take it and carry on.
    firebase.database().ref().remove();
    // Well you made it here, what a surprise!
    alert("Success, the database has been wiped!");
    // Refresh page.
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
  else {
    // If you make it here, you're clueless.
    alert("Invalid security code!")
  }
}

// Shortcut to 'File Uploads'.
$(this).on('keypress', function (event) {
  var keyU = 85; // 'U' Key.
  if (event.keyCode == keyU) {
    $("#edit").click();
  }
})