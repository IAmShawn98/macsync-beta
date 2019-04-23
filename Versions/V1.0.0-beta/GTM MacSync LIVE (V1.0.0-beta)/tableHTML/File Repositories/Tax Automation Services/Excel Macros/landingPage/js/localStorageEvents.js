// This is our local storage event for ID object '#alertVersionWarning'.

// Variable to hold our storage event.
var showMsg = localStorage.getItem('showMsg');

// Hide the alert for the client.
$('#alertVersionWarning').on('click', function(){
  // Do standard session hide request.
  document.getElementById("alertVersionWarning").style.display = "none";
  // Set our storage event so the browser knows to keep it hidden later.
  localStorage.setItem('showMsg', 'false');
});

// if the storage event exists, keep the warning hidden.
if(showMsg === 'false'){
  document.getElementById("alertVersionWarning").style.display = "none";
}

