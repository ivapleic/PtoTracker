//selektori za kalendar za odabir početnog datuma
const mth_start = document.getElementById('mth-start');
const next_mth_start = document.getElementById('next-mth-start');
const prev_mth_start = document.getElementById('prev-mth-start');
const days_el_start = document.getElementById('days-start');
const selected_date_start_el = document.getElementById('selected-date-start');

//selektori za kalendar za odabir zavrsnog datuma
const mth_end = document.getElementById('mth-end');
const next_mth_end = document.getElementById('next-mth-end');
const prev_mth_end = document.getElementById('prev-mth-end');
const days_el_end = document.getElementById('days-end');
const selected_date_end_el = document.getElementById('selected-date-end');

//svaki kalendar ima svoj niz mjeseci
const months_start = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const months_end = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const hiddenStartDateInput = document.getElementById('hidden-start-date');
const hiddenEndDateInput = document.getElementById('hidden-end-date');

document.addEventListener('DOMContentLoaded', function () {

    const startCalendar = {
        date: new Date(),
        year: null,
        month: null,
        day: null,
        selectedDate: null
    }

    const endCalendar = {
        date: new Date(),
        year: null,
        month: null,
        day: null,
        selectedDate: null
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

    function handleDateClick(event, currentDate, hiddenDateInput, selectedDateEl, days_element) {
        const dayClicked = parseInt(event.target.textContent);
        const newDate = new Date(currentDate.year, currentDate.month, dayClicked);

        newDate.setHours(23, 59, 59, 999);
        currentDate.selectedDate = newDate;

        selectedDateEl.textContent = formatDate(currentDate.selectedDate);

        hiddenDateInput.value = currentDate.selectedDate.toISOString().split('T')[0];

        const allDays = days_element.querySelectorAll('.day');
        for (let day of allDays) {
            day.classList.remove('selected');
        }

        event.target.classList.add('selected');
    }

    function goToNextMonth(mth_element, months_array, days_element, currentDate, selectedDateObj, selectedDateEl) {

        currentDate.month++;

        if (currentDate.month > 11) {
            currentDate.month = 0;
            currentDate.year++;
        }

        mth_element.textContent = months_array[currentDate.month] + ' ' + currentDate.year;

        populateDates(days_element, currentDate, selectedDateEl);

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

        populateDates(days_element, currentDate, selectedDateEl);

        selectedDateObj.month = currentDate.month;
        selectedDateObj.year = currentDate.year;

        selectedDateEl.textContent = formatDate(selectedDateObj.date);
        selectedDateEl.dataset.value = selectedDateObj.date;
    }

    initializeDate(startCalendar);
    initializeDate(endCalendar);

    mth_start.textContent = months_start[startCalendar.month] + ' ' + startCalendar.year;
    mth_end.textContent = months_end[endCalendar.month] + ' ' + endCalendar.year;

    selected_date_start_el.textContent = formatDate(startCalendar.date);
    selected_date_end_el.textContent = formatDate(endCalendar.date);

    populateDates(days_el_start, startCalendar);
    populateDates(days_el_end, endCalendar);


    //EVENT LISTENERI ZA LISTANJE MJESECI
    next_mth_start.addEventListener('click', () => {
        goToNextMonth(mth_start, months_start, days_el_start, startCalendar, startCalendar.selectedDate, selected_date_start_el);
    })

    prev_mth_start.addEventListener('click', () => {
        goToPrevMonth(mth_start, months_start, days_el_start, startCalendar, startCalendar.selectedDate, selected_date_start_el);
    })

    next_mth_end.addEventListener('click', () => {
        goToNextMonth(mth_end, months_end, days_el_end, endCalendar, endCalendar.selectedDate, selected_date_end_el);
    });

    prev_mth_end.addEventListener('click', () => {
        goToPrevMonth(mth_end, months_end, days_el_end, endCalendar, endCalendar.selectedDate, selected_date_end_el);
    });

    //EVENT LISTENERI ZA KLIK NA DAN U KALENDARU
    days_el_start.addEventListener('click', (event) => {
        handleDateClick(event, startCalendar, hiddenStartDateInput, selected_date_start_el, days_el_start);
    });

    days_el_end.addEventListener('click', (event) => {
        handleDateClick(event, endCalendar, hiddenEndDateInput, selected_date_end_el, days_el_end);
    });
});

function initializeDate(dateObject) {
    dateObject.day = dateObject.date.getDate();
    dateObject.month = dateObject.date.getMonth();
    dateObject.year = dateObject.date.getFullYear();

    dateObject.date.setHours(0, 0, 0, 0);

    dateObject.selectedDate = dateObject.date;
}

function populateDates(days_element, currentDate) {
    days_element.innerHTML = '';

    const today = new Date();

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    for (let dayOfWeek of daysOfWeek) {
        const dayOfWeekElement = document.createElement('div');
        dayOfWeekElement.classList.add('day-of-week');
        dayOfWeekElement.textContent = dayOfWeek;
        days_element.appendChild(dayOfWeekElement);
    }

    const amount_days = getDaysInMonth(currentDate.month, currentDate.year);
    const startingDay = getStartingDayOfMonth(currentDate.year, currentDate.month);

    for (let i = 0; i < startingDay; i++) {
        const empty_day_element = document.createElement('div');
        empty_day_element.classList.add('day', 'empty');
        days_element.appendChild(empty_day_element);
    }

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

function getStartingDayOfMonth(year, month) {
    const firstDayOfMonth = new Date(year, month, 1);

    let startingDay = firstDayOfMonth.getDay();
    startingDay = (startingDay - 1 + 7) % 7;

    return startingDay;
}

function getDaysInMonth(month, year) {
    if (month === 1) {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }

    if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
        return 31;
    }

    return 30;
}