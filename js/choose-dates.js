const date_picker_element = document.querySelector('.date-picker');
const dates_element = document.querySelector('.date-picker .dates');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');

const mth_element_start = document.querySelector('#start-date-picker .dates .month .mth');
const next_mth_element_start = document.querySelector('#start-date-picker .dates .month .next-mth');
const prev_mth_element_start = document.querySelector('#start-date-picker .dates .month .prev-mth');

const mth_element_end = document.querySelector('#end-date-picker .dates .month .mth');
const next_mth_element_end = document.querySelector('#end-date-picker .dates .month .next-mth');
const prev_mth_element_end = document.querySelector('#end-date-picker .dates .month .prev-mth');

const selected_date_el_start = document.querySelector('.date-picker .selected-date-start');
const selected_date_el_end = document.querySelector('.date-picker .selected-date-end');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate_start = date;
let selectedDay_start = day;
let selectedMonth_start = month;
let selectedYear_start = year;

let selectedDate_end = date;
let selectedDay_end = day;
let selectedMonth_end = month;
let selectedYear_end = year;

mth_element_start.textContent = months[month] + ' ' + year;
mth_element_end.textContent = months[month] + ' ' + year;

selected_date_el_start.textContent = formatDate(selectedDate_start);
selected_date_el_start.dataset.value = selectedDate_start;

selected_date_el_end.textContent = formatDate(selectedDate_end);
selected_date_el_end.dataset.value = selectedDate_end;

populateDates();

// EVENT LISTENERS
next_mth_element.addEventListener('click', function() {
    goToNextMonth(mth_element_start);
  });
prev_mth_element.addEventListener('click', function() {
    goToPrevMonth(mth_element_start);
  });

  function goToNextMonth(mth_element) {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    mth_element.textContent = months[month] + ' ' + year;
    populateDates();
  }
  
  function goToPrevMonth(mth_element) {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    mth_element.textContent = months[month] + ' ' + year;
    populateDates();
  }


function populateDates () {
	days_element.innerHTML = '';
	let amount_days = getDaysInMonth(month);

	for (let i = 0; i < amount_days; i++) {
		const day_element = document.createElement('div');
		day_element.classList.add('day');
		day_element.textContent = i + 1;

		if (selectedDay_start == (i + 1) && selectedYear_start == year && selectedMonth_start == month) {
			day_element.classList.add('selected');
		}

		day_element.addEventListener('click', function () {
			selectedDate_start = new Date(year + '-' + (month + 1) + '-' + (i + 1));
			selectedDay_start = (i + 1);
			selectedMonth_start = month;
			selectedYear_start = year;

			selected_date_el_start.textContent = formatDate(selectedDate_start);
			selected_date_el_start.dataset.value = selectedDate_start;

			populateDates();
		});

		days_element.appendChild(day_element);
	}
}

function formatDate (d) {
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
  