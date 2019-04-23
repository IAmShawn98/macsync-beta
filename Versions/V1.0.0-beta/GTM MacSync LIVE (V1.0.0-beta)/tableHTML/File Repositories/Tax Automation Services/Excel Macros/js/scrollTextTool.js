// MacSync Tips.

// Tip fade 1.
$(document).ready(function() {
    function fade1() {
        $("#one").fadeIn(6000,function() {
            $("#one").fadeOut(6000).delay();
            setTimeout(fade2,6000);
        });
    }
    // Tip fade 2.
    function fade2() {
        $("#two").fadeIn(6000,function() {
            $("#two").fadeOut(6000).delay();
            setTimeout(fade3,6000);
        });
    }
    // Tip fade 3.
    function fade3() {
        $("#three").fadeIn(6000,function() {
            $("#three").fadeOut(6000).delay();
            setTimeout(fade1,6000);
        });
    }
    // Initalize Tip Cycle.
    fade1();
});