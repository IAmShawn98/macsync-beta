// Tree View Logic.
var toggler = document.getElementsByClassName("caret");
var i;

// Dropdown functionality.
for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
  });
}