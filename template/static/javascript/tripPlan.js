// input-invite event listener
const invite = document.getElementById("invite");
const div_invite = document.getElementById("input-invite");
const select_invite_privilege = document.getElementById("invite-privilege");

const arrow = document.getElementById("arrow");
const modal_invite = document.getElementById("modal-invite")
const share_view = document.getElementById("share-view");



invite.addEventListener("input", (e) => {
    invite.style.width = "75%";
    select_invite_privilege.style.display = "inline-block";
    div_invite.style.display = "flex";
    
    arrow.style.display = "block";
    modal_invite.style.display = "flex";
    share_view.style.display = "none";
});

// EditModal
const modal = document.getElementById("editModal");
const openBtn = document.getElementById("openEdit");
const closeBtn = document.getElementById("closeModal");

openBtn.onclick = () => modal.style.display = "flex";
closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
}

// ShareModal
const modalShare = document.getElementById("shareModal");
const openBtnShare = document.getElementById("openShare");
const closeBtnShare = document.getElementById("closeModalShare");

openBtnShare.onclick = () => modalShare.style.display = "flex";
closeBtnShare.onclick = () => modalShare.style.display = "none";

window.onclick = (e) => {
    if (e.target == modal) {
        modalShare.style.display = "none";
    }
}

//shareOption
const select = document.getElementById("shareOption");
const sharePic = document.getElementById("sharePic");
const shareText = document.getElementById("shareText");
const sharePrivilege = document.getElementById("sharePrivilege");
const wrapper = select.parentElement;

select.addEventListener("change", () => {
if (select.value === "public") {
    wrapper.style.setProperty("--arrow-right", "85px");
    shareText.textContent = "ผู้ใช้อินเทอร์เน็ตทุกคนที่มีลิงก์นี้จะดูได้"
    sharePrivilege.style.display = "inline-block"
    sharePic.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQho-wuA1ELDvUgdgXUT7DzgL6EqW79ZyG2QExII9_0dwsf7YYP-PDV8AvrKZ2tU8mcbno&usqp=CAU"
} else {
    wrapper.style.setProperty("--arrow-right", "40px");
    shareText.textContent = "เฉพาะคนที่มีสิทธิ์เข้าถึงเท่านั้นที่เปิดด้วยลิงก์นี้ได้"
    sharePrivilege.style.display = "none"
    sharePic.src = "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5f8d164d8269cffacc89422054b94c70/roblox.png";
}
});


const monthsTH = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
];
//เลือกวันที่ เริ่ม - สิ้นสุด
flatpickr("#tripRange", {
    mode: "range",
    dateFormat: "Y-m-d", // ค่าเก็บจริง (hidden value)
    minDate: "today",
    locale: "th",
    onClose: function(selectedDates, dateStr, instance) {
        if (selectedDates.length === 2) {
            const start = selectedDates[0];
            const end = selectedDates[1];

            const dayStart = start.getDate();
            const monthStart = monthsTH[start.getMonth()];
            const yearStart = start.getFullYear() + 543; // แปลงเป็น พ.ศ.

            const dayEnd = end.getDate();
            const monthEnd = monthsTH[end.getMonth()];
            const yearEnd = end.getFullYear() + 543;

            let displayText = "";

            if (monthStart === monthEnd && yearStart === yearEnd) {
                // กรณีอยู่เดือนเดียวกัน เช่น 1 - 4 กันยายน 2568
                displayText = `${dayStart} - ${dayEnd} ${monthStart} ${yearStart}`;
            } else {
                // กรณีต่างเดือน/ต่างปี
                displayText = `${dayStart} ${monthStart} ${yearStart} - ${dayEnd} ${monthEnd} ${yearEnd}`;
            }

            instance.input.value = displayText;
        }
    }

});

// change invite to share
function changeToShare() {
    const invite = document.getElementById("invite");
    const arrow = document.getElementById("arrow");
    const invite_privilege = document.getElementById("invite-privilege");
    const modal_invite = document.getElementById("modal-invite")
    
    const share_view = document.getElementById("share-view");

    invite.style.width = "100%";
    arrow.style.display = "none";
    invite_privilege.style.display = "none";
    modal_invite.style.display = "none";

    share_view.style.display = "block";
}

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