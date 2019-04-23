// When the user scrolls down 20px show scroll button.
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("btnScrollTop").style.display = "block";
  } else {
    document.getElementById("btnScrollTop").style.display = "none";
  }
}

// When the user clicks the button scroll back to the top.
function topFunction() {
  $('html,body').animate({ scrollTop: 0 }, 'slow');
}