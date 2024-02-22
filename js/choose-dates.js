document.addEventListener('DOMContentLoaded', function () {

//selektori za kalendar za odabir početnog datuma
const date_picker_start = document.getElementById('start-date-picker');
const dates_el_start = document.getElementById('dates-start');
const mth_start = document.getElementById('mth-start');
const next_mth_start = document.getElementById('next-mth-start');
const prev_mth_start = document.getElementById('prev-mth-start');
const days_el_start = document.getElementById('days-start');
const selected_date_start_el = document.getElementById('selected-date-start');

//selektori za kalendar za odabir zavrsnog datuma
const date_picker_end = document.getElementById('end-date-picker');
const dates_el_send = document.getElementById('dates-end');
const mth_end = document.getElementById('mth-end');
const next_mth_end = document.getElementById('next-mth-end');
const prev_mth_end = document.getElementById('prev-mth-end');
const days_el_end = document.getElementById('days-end');
const selected_date_end_el = document.getElementById('selected-date-end');

//ostali selektori
const employeeDropdown = document.getElementById('employeeDropdown');
const addDataBtn = document.getElementById('addDataBtn');

//svaki kalendar ima svoj niz mjeseci
const months_start = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const months_end = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const startDate = {
    date: new Date(),
    year: null,
    month: null,
    day: null,
    selectedDate: null
}

const endDate = {
    date: new Date(),
    year: null,
    month: null,
    day: null,
    selectedDate: null
}

function initializeDate(dateObject) {
    dateObject.day = dateObject.date.getDate();
    dateObject.month = dateObject.date.getMonth();  //u javascriptu krece od 0
    dateObject.year = dateObject.date.getFullYear();
    dateObject.selectedDate = dateObject.date;
}

initializeDate(startDate);
initializeDate(endDate);

mth_start.textContent = months_start[startDate.month] + ' ' + startDate.year;
mth_end.textContent = months_end[endDate.month] + ' ' + endDate.year;

selected_date_start_el.textContent = formatDate(startDate.date);
selected_date_start_el.dataset.value = startDate.date;


selected_date_end_el.textContent = formatDate(endDate.date);
selected_date_end_el.dataset.value = endDate.date;

populateDates(days_el_start, startDate);
populateDates(days_el_end, endDate);

// Popunjavanje padajućeg izbornika s zaposlenicima
fetch('https://jsonplaceholder.typicode.com/users')
.then(response => response.json())
.then(data => {
    // Popunjavanje dropdowna s imenima zaposlenika
    data.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = employee.name;
        employeeDropdown.appendChild(option);
    });
})
.catch(error => console.error('Error fetching employees:', error));

//FUNKCIJA ZA PRIKAZ DANA U MJESECU 
function populateDates(days_element, currentDate,selectedDateEl) {
    days_element.innerHTML = '';

    const today = new Date();

    const amount_days = getDaysInMonth(currentDate.month, currentDate.year);
    const startingDay = getStartingDayOfMonth(currentDate.year, currentDate.month);

    // Dodaj prazne dane do prvog dana u tjednu
    for (let i = 0; i < startingDay; i++) {
        const empty_day_element = document.createElement('div');
        empty_day_element.classList.add('day', 'empty');
        days_element.appendChild(empty_day_element);
    }

    // Dodaj dane u mjesecu
    for (let i = 0; i < amount_days; i++) {
        const day_element = document.createElement('div');
        day_element.classList.add('day');
        day_element.textContent = i + 1;

        if (
            currentDate.year === today.getFullYear() &&
            currentDate.month === today.getMonth() &&
            i + 1 === today.getDate()
        ) {
            day_element.classList.add('today');
        }

        days_element.appendChild(day_element);
    }
}

function handleDateClick(event, currentDate, selectedDateEl, days_element) {
    const dayClicked = parseInt(event.target.textContent);
    const newDate = new Date(currentDate.year, currentDate.month, dayClicked);

    //console.log('New Date:', newDate);  // Dodajte ovu liniju

    // Update the selected date for the specific calendar
    currentDate.selectedDate = newDate;

    //console.log('Selected Date:', currentDate.selectedDate);  // Dodajte ovu liniju

    // Update the display of the selected date
    selectedDateEl.textContent = formatDate(currentDate.selectedDate);
    selectedDateEl.dataset.value = currentDate.selectedDate;

    // Remove 'selected' class from all days
    const allDays = days_element.querySelectorAll('.day');
    for (let day of allDays) {
        day.classList.remove('selected');
    }

    // Add 'selected' class to the clicked day
    event.target.classList.add('selected');
}


//EVENT HANDLERI za startDate
next_mth_start.addEventListener('click', function () {
    goToNextMonth(mth_start, months_start, days_el_start, startDate, startDate.selectedDate, selected_date_start_el);
})

prev_mth_start.addEventListener('click', function () {
    goToPrevMonth(mth_start, months_start, days_el_start, startDate, startDate.selectedDate, selected_date_start_el);
})

//EVENT HANDLERI za endDate
next_mth_end.addEventListener('click', function () {
    goToNextMonth(mth_end, months_end, days_el_end, endDate, endDate.selectedDate, selected_date_end_el);
});

prev_mth_end.addEventListener('click', function () {
    goToPrevMonth(mth_end, months_end, days_el_end, endDate, endDate.selectedDate, selected_date_end_el);
});

// Event listener za klik na dan u početnom kalendaru
days_el_start.addEventListener('click', function (event) {
    handleDateClick(event, startDate, selected_date_start_el, days_el_start);
});

// Event listener za klik na dan u završnom kalendaru
days_el_end.addEventListener('click', function (event) {
    handleDateClick(event, endDate, selected_date_end_el, days_el_end);
});


//FUNKCIJE ZA TRAZENJE MJESECI
function goToNextMonth(mth_element, months_array, days_element, currentDate, selectedDateObj, selectedDateEl) {
    // Create a copy of the currentDate object


    currentDate.month++;

    if (currentDate.month > 11) {
        currentDate.month = 0;
        currentDate.year++;
    }

    mth_element.textContent = months_array[currentDate.month] + ' ' + currentDate.year;

    populateDates(days_element,currentDate,selectedDateEl);

    // Update the selectedDateObj object with the new values
    selectedDateObj.month = currentDate.month;
    selectedDateObj.year = currentDate.year;

    selectedDateEl.textContent = formatDate(selectedDateObj.date);
    selectedDateEl.dataset.value = selectedDateObj.date;
}


function goToPrevMonth(mth_element, months_array, days_element, currentDate, selectedDateObj, selectedDateEl) {
    currentDate.month--;

    if (currentDate.month < 0) {
        currentDate.month = 11;
        currentDate.year--;
    }

    mth_element.textContent = months_array[currentDate.month] + ' ' + currentDate.year;

    populateDates(days_element,currentDate,selectedDateEl);

    // Update the selectedDateObj object with the new values
    selectedDateObj.month = currentDate.month;
    selectedDateObj.year = currentDate.year;

    selectedDateEl.textContent = formatDate(selectedDateObj.date);
    selectedDateEl.dataset.value = selectedDateObj.date;
}

//neke funkcije

function getStartingDayOfMonth(year, month) {
    const firstDayOfMonth = new Date(year, month, 1);

    let startingDay = firstDayOfMonth.getDay();

    // Prilagodi startingDay kako bi nedjelja bila zadnji dan u tjednu
    startingDay = (startingDay - 1 + 7) % 7;

    return startingDay;
}

// Funkcija koja dobiva broj dana u određenom mjesecu i godini
function getDaysInMonth(month, year) {
    // Veljača je posebna, pa je potrebno dodatno provjeriti prijestupnu godinu
    if (month === 1) {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }

    // Mjeseci s 31 danom
    if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
        return 31;
    }

    // Mjeseci s 30 dana
    return 30;
}

function formatDate(d) {
    let day = d.getDate();
    if (day < 10) {
        day = '0' + day;
    }

    let month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }

    let year = d.getFullYear();

    return day + ' / ' + month + ' / ' + year;
}
});