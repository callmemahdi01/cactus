function toggleList(id) {
    const list = document.getElementById(id);
    if (list.style.display === "none") {
        list.style.display = "block";
    } else {
        list.style.display = "none";
    }
}