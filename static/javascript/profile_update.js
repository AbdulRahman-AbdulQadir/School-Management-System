// Profile image preview
document
.getElementById("profileImageInput")
.addEventListener("change", function (e) {
    const preview = document.getElementById("profileImagePreview");
    const file = e.target.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
        preview.src = evt.target.result;
        preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
    } else {
    preview.classList.add("hidden");
    preview.src = "";
    }
});
// National ID image preview
document
.getElementById("nationalIdImageInput")
.addEventListener("change", function (e) {
    const preview = document.getElementById("nationalIdImagePreview");
    const file = e.target.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
        preview.src = evt.target.result;
        preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
    } else {
    preview.classList.add("hidden");
    preview.src = "";
    }
});