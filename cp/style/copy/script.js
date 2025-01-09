document.addEventListener('DOMContentLoaded', function() {
    loadGrades();
    checkNotificationStatus();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/GPA/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    });
}

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
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let totalUnits = 0;
    let totalPoints = 0;

    Array.from(rows).forEach(row => {
        const grade = parseFloat(row.getElementsByTagName('input')[1].value);
        const units = parseFloat(row.getElementsByTagName('input')[2].value);
        if (!isNaN(units) && !isNaN(grade)) {
            totalUnits += units;
            totalPoints += units * grade;
        }
    });

    const gpa = totalPoints / totalUnits;
    document.getElementById('gpaResult').innerText = `* RESUALT:\n\t${gpa.toFixed(2)}`;
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



function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 2000);
}

window.addEventListener('scroll', function() {
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