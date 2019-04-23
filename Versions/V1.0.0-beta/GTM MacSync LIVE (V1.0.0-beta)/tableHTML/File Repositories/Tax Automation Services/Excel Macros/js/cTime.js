// Display TimeStamp for Database Connection Checker.
(function () {
    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    function startTime() {
        var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes());
            document.getElementById('time').innerHTML = "As of " + h + ":" + m + ".";
    }
    startTime();
})();