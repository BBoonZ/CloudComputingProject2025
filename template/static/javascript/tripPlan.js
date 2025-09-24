// add-activity
function openActivityModal() {
    const openAddActivityModal = document.getElementById("addActivityModal");

    openAddActivityModal.style.display = "flex";
}

function addActivity  () {
    const container = document.getElementById("activityDetails"); // div หลักที่เก็บทุกแถว
    const rows = container.querySelectorAll(".activityDeatilsInput"); // หาแถวทั้งหมด

    const div_main = document.getElementById("activityDetails");
    const div = document.createElement("div");
    div.className = "activityDeatilsInput";
    div.innerHTML = `
    <input type="text" class="activityLocationLink" placeholder="รายละเอียดกิจกรรม">
    <button type="button" class="btn-delete" style="border:none;" onclick="deleteActivityDetails(this)">
        <i class="fa-solid fa-trash"></i>
    </button>`;

    div_main.appendChild(div);

    const text = document.getElementById("activityDetailsText");
    if(rows.length === 0){
        text.style.display = "block";
    }
}

function deleteActivityDetails(btn) {
    const row = btn.closest(".activityDeatilsInput"); // หา div แถว

    const text = document.getElementById("activityDetailsText");
    if(row) {
        row.remove(); // ลบแถวออกจาก DOM
        text.style.display = "block";
    }

    const container = document.getElementById("activityDetails"); // div หลักที่เก็บทุกแถว
    const rows = container.querySelectorAll(".activityDeatilsInput"); // หาแถวทั้งหมด

    if(rows.length === 0){
        text.style.display = "none";
    }
}

// edit-activity
function editActivityModal() {
    const editAddActivityModal = document.getElementById("editActivityModal");

    editAddActivityModal.style.display = "flex";
}

function editAddActivity  () {
    const container = document.getElementById("editactivityDetails"); // div หลักที่เก็บทุกแถว
    const rows = container.querySelectorAll(".editactivityDeatilsInput"); // หาแถวทั้งหมด

    const div_main = document.getElementById("editactivityDetails");
    const div = document.createElement("div");
    div.className = "editactivityDeatilsInput";
    div.innerHTML = `
    <input type="text" class="editactivityLocationLink" placeholder="รายละเอียดกิจกรรม">
    <button type="button" class="btn-delete" style="border:none;" onclick="editDeleteActivityDetails(this)">
        <i class="fa-solid fa-trash"></i>
    </button>`;

    div_main.appendChild(div);

    const text = document.getElementById("editactivityDetailsText");
    if(rows.length === 0){
        text.style.display = "block";
    }
}

function editDeleteActivityDetails(btn) {
    const row = btn.closest(".editactivityDeatilsInput"); // หา div แถว

    const text = document.getElementById("editactivityDetailsText");
    if(row) {
        row.remove(); // ลบแถวออกจาก DOM
        text.style.display = "block";
    }

    const container = document.getElementById("editactivityDetails"); // div หลักที่เก็บทุกแถว
    const rows = container.querySelectorAll(".editactivityDeatilsInput"); // หาแถวทั้งหมด

    if(rows.length === 0){
        text.style.display = "none";
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  }