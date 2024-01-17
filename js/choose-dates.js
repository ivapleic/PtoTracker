//selektori za kalendar za odabir početnog datuma
const date_picker_start=document.getElementById('start-date-picker');
const dates_el_start = document.getElementById('dates-start');
const mth_start = document.getElementById('mth-start');
const next_mth_start = document.getElementById('next-mth-start');
const prev_mth_start = document.getElementById('prev-mth-start');
const days_el_start = document.getElementById('days-start');
const selected_date_start_el = document.getElementById('selected-date-start');

//selektori za kalendar za odabir zavrsnog datuma
const date_picker_end=document.getElementById('end-date-picker');
const dates_el_send = document.getElementById('dates-end');
const mth_end = document.getElementById('mth-end');
const next_mth_end= document.getElementById('next-mth-end');
const prev_mth_end = document.getElementById('prev-mth-end');
const days_el_end= document.getElementById('days-end');
const selected_date_end_el = document.getElementById('selected-date-end');

//svaki kalendar ima svoj niz mjeseci
const months_start = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const months_end = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


let date = new Date();
let day = date.getDate(); 
let month = date.getMonth();
let year = date.getFullYear();

let selected_date_start = date;  // initialize with current date
let selected_day_start = day;
let selected_month_start = month;
let selected_year_start = year;

let selected_date_end = date;
 let selected_day_end = day;
 let selected_month_end = month;
 let selected_year_end = year;

// Popunjavanje početnih podataka
mth_start.textContent = months_start[month] + ' ' + year;
mth_end.textContent = months_end[month] + ' ' + year;

selected_date_start_el.textContent = formatDate(selected_date_start);
selected_date_start_el.dataset.value = selected_date_start;

selected_date_end_el.textContent = formatDate(selected_date_end);
selected_date_end_el.dataset.value = selected_date_end;
 
// EVENT LISTENERS

//za prvi kalendar mijenjanje mjeseci
next_mth_start.addEventListener('click', function() {
    goToNextMonth(mth_start, days_el_start, selected_date_start, months_start);
});

prev_mth_start.addEventListener('click', function() {
    goToPrevMonth(mth_start, days_el_start, selected_date_start, months_start);
});

//za drugi kalendar mijenjanje mjeseci
next_mth_end.addEventListener('click', function() {
    goToNextMonth(mth_end, days_el_end, selected_date_end, months_end);
});

prev_mth_end.addEventListener('click', function() {
    goToPrevMonth(mth_end, days_el_end, selected_date_end, months_end);
});

//Zajednicke funkcije za mijenjanje mjeseci
function goToNextMonth(mth_element, days_element, selected_date_element, months_array) {
    let currentMonth = months_array.indexOf(mth_element.textContent.split(' ')[0]);
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        year++;
    }
    mth_element.textContent = months_array[currentMonth] + ' ' + year;
    populateDates(days_element, selected_date_element, currentMonth);
}

function goToPrevMonth(mth_element, days_element, selected_date_element, months_array) {
    let currentMonth = months_array.indexOf(mth_element.textContent.split(' ')[0]);
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        year--;
    }
    mth_element.textContent = months_array[currentMonth] + ' ' + year;
    populateDates(days_element, selected_date_element, currentMonth);
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
*/

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
  