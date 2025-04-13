document.addEventListener('DOMContentLoaded', function () {
    loadGrades();
    checkNotificationStatus();
    type(); // Start typing animation
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/cactus/service-worker.js')
            .then(function (registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(function (error) {
                console.log('Service Worker registration failed:', error);
            });
    });
}

const gradesTable = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
const gpaResult = document.getElementById('gpaResult');
const successMessage = document.getElementById('successMessage');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

function addRow() {
    const table = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const rowIndex = table.rows.length;

    newRow.innerHTML = `
        <td class="row-number">${rowIndex}</td>
        <td><input type="text" name="courseName" placeholder="(اختیاری)"></td>
        <td><input type="number" name="courseGrade" placeholder="از 20 نمره" max="20" min="0"></td>
        <td><input type="number" name="courseUnits" placeholder="مثلا 2 واحد"></td>
        <td><button id="button_x" onclick="removeRow(this)">X</button></td>
    `;
    updateRowNumbers();
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateRowNumbers();
}

function calculateGPA() {
    const rows = gradesTable.getElementsByTagName('tr');
    const totals = Array.from(rows).reduce((acc, row) => {
        const [grade, units] = [
            parseFloat(row.getElementsByTagName('input')[1].value),
            parseFloat(row.getElementsByTagName('input')[2].value)
        ];
        if (!isNaN(grade) && !isNaN(units)) {
            acc.units += units;
            acc.points += units * grade;
        }
        return acc;
    }, { units: 0, points: 0 });

    gpaResult.innerText = (totals.points / totals.units || 0).toFixed(2);
}

function saveGrades() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const courses = Array.from(rows).map(row => {
        return {
            name: row.getElementsByTagName('input')[0].value,
            grade: row.getElementsByTagName('input')[1].value,
            units: row.getElementsByTagName('input')[2].value
        };
    }).filter(course => course.name || course.grade || course.units);

    localStorage.setItem('courses', JSON.stringify(courses));
    showSuccessMessage();
}

function loadGrades() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const tableBody = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    courses.forEach((course, index) => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td class="row-number">${index + 1}</td>
            <td><input type="text" name="courseName" value="${course.name}" placeholder="(اختیاری)"></td>
            <td><input type="number" name="courseGrade" value="${course.grade}" placeholder="از 20 نمره" max="20" min="0"></td>
            <td><input type="number" name="courseUnits" value="${course.units}" placeholder="مثلا 2 واحد"></td>
            <td><button id="button_x" onclick="removeRow(this)">X</button></td>
        `;
    });
    updateRowNumbers();
}

function clearCache() {
    localStorage.clear();
    location.reload();
}

function addRequiredCourses() {
    fetch('requiredCourses.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
            data.forEach(course => {
                const newRow = tableBody.insertRow();
                newRow.innerHTML = `
                    <td class="row-number">${tableBody.rows.length + 1}</td>
                    <td><input type="text" name="courseName" value="${course.name}" placeholder="(اختیاری)" readonly></td>
                    <td><input type="number" name="courseGrade" placeholder="از 20 نمره" max="20" min="0"></td>
                    <td><input type="number" name="courseUnits" value="${course.units}" placeholder="مثلا 2 واحد" readonly></td>
                    <td><button id="button_x" onclick="removeRow(this)">X</button></td>
                `;
            });
            updateRowNumbers();
        })
        .catch(error => console.error('Error loading required courses:', error));
}

function updateRowNumbers() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    Array.from(rows).forEach((row, index) => {
        row.getElementsByClassName('row-number')[0].innerText = index + 1;
    });
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 2000);
}

window.addEventListener('scroll', function () {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (document.documentElement.scrollTop > 200) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const toggle = document.getElementById('dark-mode-toggle');
const themeStyle = document.getElementById('theme-style');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    toggle.checked = false;
    themeStyle.href = './style/light.css';
} else {
    toggle.checked = true;
    themeStyle.href = './style/dark.css';
}

toggle.addEventListener('change', function () {
    if (this.checked) {
        themeStyle.href = './style/dark.css';
        localStorage.setItem('theme', 'dark');
    } else {
        themeStyle.href = './style/light.css';
        localStorage.setItem('theme', 'light');
    }
});

const messages = [
    'Hello, welcom to GeekMind family!',
    'برای اطلاعات بیشتر این جمله رو لمس کن',
    'به گیک‌‌ مایند خوش اومدی!',
    'Touch me to more info 🙋🏻'
];

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_TIME = 3000;
const PAUSE_BETWEEN_MESSAGES = 1000;

let textElement = document.getElementById('text');
let messageIndex = 0;
let isDeleting = false;
let text = '';
let charIndex = 0;

function type() {
    const currentMessage = messages[messageIndex];

    if (isDeleting) {
        text = currentMessage.substring(0, charIndex - 1);
        charIndex--;
    } else {
        text = currentMessage.substring(0, charIndex + 1);
        charIndex++;
    }

    textElement.textContent = text;

    let typeSpeed = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === currentMessage.length) {
        typeSpeed = PAUSE_TIME;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        typeSpeed = PAUSE_BETWEEN_MESSAGES;
    }

    setTimeout(type, typeSpeed);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/cactus/service-worker.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}

window.onload = function () {
    type();
};

function exportToXLSX() {
    const table = document.getElementById('gradesTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const data = [['نام درس', 'نمره', 'واحد']]; // Header row

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('input');
        const courseName = cells[0].value;
        const courseGrade = cells[1].value;
        const courseUnits = cells[2].value;
        // Only include rows where at least one field has a value
        if (courseName || courseGrade || courseUnits) {
             data.push([courseName || '', courseGrade || '', courseUnits || '']);
        }
    }

    // Add GPA row if calculated
    const gpaValue = gpaResult.innerText;
    if (gpaValue !== '0.0' && gpaValue !== 'NaN') {
        data.push([]); // Add an empty row for spacing
        data.push(['معدل کل:', gpaValue]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "نمرات");

    // Trigger file download
    XLSX.writeFile(workbook, "Cactus_Grades.xlsx");
}