// Initialize Firebase
var config = {
  apiKey: "AIzaSyAdZfpVylZElE1XexfOTSfvGyDs3qCOeJ8",
  authDomain: "macromanagement-ad4bb.firebaseapp.com",
  databaseURL: "https://macromanagement-ad4bb.firebaseio.com",
  projectId: "macromanagement-ad4bb",
  storageBucket: "macromanagement-ad4bb.appspot.com",
  messagingSenderId: "189857585183"
};
firebase.initializeApp(config);

// Global Tooltip.
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Reference to the DB we want to read from.
var tasFileDB = firebase.database().ref('macromanagement');

// Listen for submit.
document.getElementById('DataTableDBForm').addEventListener('submit', submitForm);

// When a submit is triggered, push data through the main form.
function submitForm(e) {
  e.preventDefault();

  // Global DB variables.
  var authDev = getInputVal('authDev');
  var macLink = getInputVal('macLink');
  var macName = getInputVal('macName');
  var uploadBy = getInputVal('uploadBy');
  var dateModified = getInputVal('dateModified');
  var accessDM = getInputVal('accessDM');
  var fileSize = getInputVal('fileSize');
  var mailTo = getInputVal('mailTo');

  // Push file data into a save.
  saveFile(authDev, macLink, macName, uploadBy, dateModified, accessDM, fileSize, mailTo);
}

// Listen for form data.
function getInputVal(id) {
  return document.getElementById(id).value;
}

// Save file to the DB.
function saveFile(authDev, macLink, macName, uploadBy, dateModified, accessDM, fileSize, mailTo) {
  var newMessageRef = tasFileDB.push();
  newMessageRef.set({
    authDev: authDev,
    macLink: macLink,
    macName: macName,
    uploadBy: uploadBy,
    dateModified: dateModified,
    accessDM: accessDM,
    fileSize: fileSize,
    mailTo: mailTo
  });
}

// Populate the table with each new entry.
var userDataRef = firebase.database().ref("macromanagement").orderByKey();
userDataRef.once("value")
  .then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();

      var authDev = childSnapshot.val().authDev;
      var macLink = childSnapshot.val().macLink;
      var macName = childSnapshot.val().macName;
      var uploadBy = childSnapshot.val().uploadBy;
      var dateModified = childSnapshot.val().dateModified;
      var accessDM = childSnapshot.val().accessDM;
      var fileSize = childSnapshot.val().fileSize;
      var mailTo = childSnapshot.val().mailTo;

      // Error Detection.
      if (macName === "") {
        F = document.getElementById("file").value
        authDev = "-";
        uploadBy = "-";
        dateModified = "-"
        macName = "Untitled File";
      } else if (authDev === "", uploadBy === "", dateModified === "") {
        authDev = "-";
        uploadBy = "-";
        dateModified = "-"
      }
      if (macLink === "") {
        macName = "<strike class='text-danger'>" + macName + "</strike>";
        authDev = "-";
        uploadBy = "-";
        dateModified = "-"
        macLink = "./404.html";
        // accessDM = "badge badge-pill badge-danger";
        var faVariant = '<span class="badge badge-pill badge-danger"><i class="fa fa-exclamation"></i></span>';
      } else if ("#accessDM option: badge badge-pill badge-success") {
        var faVariant = '<span class="badge badge-pill badge-success"><i class="fa fa-check"></i></span>';
      }
      // If no file is selected, handle it like this.
      if (fileSize === "Upload File") {
        fileSize = "0 KB";
        // Problematic sound data.
        var audio = new Audio('./audio/success.mp3');
        // problematic file notification.
        $.notify({
          // Notify Settings.
          icon: 'fa fa-refresh',
          title: '<b>File Integrity:</b> ',
          message: 'One or more files in your sync table have stopped functioning properly.',
        })
        // Trigger notification sound.
        audio.play();
      } else if (fileSize != "Upload File") {
        fileSize = fileSize;
      }

      // Get the the values from our Dropdown and populate the pill aka (accessDM).
      var pill = $('#accessDM option:selected').text();  // Will display using BS format ---> "badge badge-pill badge-success";

      // If mailTo contains nothing, handle this.
      var ifContainsNothingDoWarn = "text-primary"; // We define our data object to avoid a definition error.
      var mailTo = "mailto:" + mailTo;

      // Do handle condition.
      if (mailTo === "mailto:" + "") {
        // If 'mailTo' is empty, disable icon.
        ifContainsNothingDoWarn = "d-none";
      } else {
        // If a string returns valid data, do regular activity.
        mailTo = mailTo;
        ifContainsNothingDoWarn = "text-primary";
      }

      // Format our DB snapshots into readable HTML.
      var buildTD = "";

      // *******************************************************************SYNC TABLE**********************************************************************************************************************************************
      buildTD += "<tr data-toggle='collapse' data-target='#demo' style='font-size: 180%;'>"
      // File Name.
      buildTD += "<td class='tableItem'>" + "<a class='text-info' href='" + macLink + "'>" + macName + "</a></td>"
      // File Size.
      buildTD += "<td class='tableItem'><span id='fileSize'>" + fileSize + "</span></td>"
      // Developer Emails.
      buildTD += "<td class='tableItem'><a id='mailDev' href=" + mailTo + "><i disabled class='fa fa-envelope text-primary animated pulse infinite " + ifContainsNothingDoWarn + "' aria-hidden='true'></i></a> " + authDev + "</td>"
      // Upload By.
      buildTD += "<td class='tableItem'>" + uploadBy + "</td>"
      // Uploaded On.
      buildTD += "<td class='tableItem'>" + dateModified + "</td>"
      // Special IDs.
      buildTD += "<td class='tableItem' contenteditable spellcheck='false'><span class='text-warning'><b>" + childSnapshot.key + "</b></span></td>"
      buildTD += "</tr>"
      // *******************************************************************SYNC TABLE**********************************************************************************************************************************************

      // Attach the above data to our table for population.
      $(".syncTableContent").append(buildTD);

      // Append Dropdown color.
      $("#tableItem").append(pill);
    });
  });

// Upload files to folder 'Macros/'.
function fileChange(ev) {
  // Process file....
  document.getElementById("save-data").style.display = "none";
  document.getElementById("btnProcessing").style.display = "block";
  var target = ev.target;
  var file = target.files[0];
  var storageRef = firebase.storage().ref();
  var thisRef = storageRef.child("Macros/" + file.name);

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
  document.getElementById('dateModified').value = today;

  // Populate #macLink with downloadURL....
  thisRef.put(file).then(function (snapshot) {
    snapshot.ref.getDownloadURL().then(function (downloadURL) {
      // Append downloadURL to #macLink.
      $("#macLink").append(downloadURL);
      // Let the user know the file is ready to be synced.
      document.getElementById("btnProcessing").style.display = "none";
      document.getElementById("save-data").style.display = "block";
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
//  setTimeout(() => {
  //  location.reload();
  //}, 4800);

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
// Listen for 'Special ID'.
function specialID() {
  SF = document.getElementById('SI').value
}

// Toggle authDev email.
function toggleAuthEmail() {
  $("#authMail").toggle();
}
 
// Update macName.
function changeMacName() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  macName = document.getElementById('fileName').value
  data = { macName }
  // Do the update.
  userId = SF;
  fireDB.child('/macromanagement/' + userId).update(data);
}
// Update authDev.
function changeAuthDev() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  authDev = document.getElementById('authName').value
  data = { authDev }
  // Do the update.
  userId = SF;
  fireDB.child('/macromanagement/' + userId).update(data);
}
// Update uploadBy.
function changeUploadBy() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  uploadBy = document.getElementById('upload').value
  data = { uploadBy }
  // Do the update.
  userId = SF;
  fireDB.child('/macromanagement/' + userId).update(data);
}
// Update uploadBy.
function changeUploadedDate() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  dateModified = document.getElementById('dateUploaded').value
  data = { dateModified }
  // Do the update.
  userId = SF;
  fireDB.child('/macromanagement/' + userId).update(data);
}
// Update macLink.
function changeLink() {
  // Hook Event Listener.
  const fireDB = firebase.database().ref()
  macLink = document.getElementById('macLinkNew').value
  data = { macLink }
  // Do the update.
  userId = SF;
  fireDB.child('/macromanagement/' + userId).update(data);
}
// Delete a single file.
function delMac() {
  const fireDB = firebase.database().ref()
  // Do delete.
  specialFile = document.getElementById('SI').value
  fireDB.child("/macromanagement/" + specialFile).remove();
  // Clear input.
  document.getElementById('SI').value = '';
  // Let the user know the file has been successfully removed from the table.

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
}
// File Size Calculator.
$(document).ready(function () {
  $("#file").change(function () {
    var iSize = ($("#file")[0].files[0].size / 1024);
    if (iSize / 1024 > 1) {
      if (((iSize / 1024) / 1024) > 1) {
        iSize = (Math.round(((iSize / 1024) / 1024) * 100) / 100);
        $("#fileSize").val(iSize + " GB");
      }
      else {
        iSize = (Math.round((iSize / 1024) * 100) / 100)
        $("#fileSize").val(iSize + " MB");
      }
    }
    else {
      iSize = (Math.round(iSize * 100) / 100)
      $("#fileSize").val(iSize + " KB");
    }
  });
});
// Temporary security for wiping the database. (Pre-production)
function wipeDB() {
  auth = prompt("This action will remove all data within this repository. You will need the security code to continue this action.")
  if (auth === "45100") {
    firebase.database().ref().remove();
    alert("Success, the database has been wiped!");
  }
  else {
    alert("Invalid security code!")
  }
}
