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

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  }