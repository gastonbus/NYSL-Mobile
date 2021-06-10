
function updatePage(page) {
    document.getElementById("teams").style.display = "none";
    document.getElementById("locations").style.display = "none";
    document.getElementById("times").style.display = "none";
    document.getElementById("home").style.display = "none";
    document.getElementById(page).style.display = "block";
}