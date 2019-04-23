// When the user scrolls down 20px show scroll button.
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks the button scroll back to the top.
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}