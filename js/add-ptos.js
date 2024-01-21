document.addEventListener('DOMContentLoaded', function () {
    const addDataBtn = document.getElementById('addDataBtn');
    const listOfPtos = document.querySelector('.list-of-ptos');
    const employeeDropdown = document.getElementById('employeeDropdown');

    // Dohvati zaposlenike
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            // Popuni dropdown s imenima zaposlenika
            data.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = employee.name;
                employeeDropdown.appendChild(option);
            });
        });

    addDataBtn.addEventListener('click', function () {
        // Dohvati odabrane informacije iz dropdown-a
        const selectedEmployeeId = employeeDropdown.value;

        // Dohvati ostale podatke o odabranom zaposleniku
        fetch(`https://jsonplaceholder.typicode.com/users/${selectedEmployeeId}`)
            .then(response => response.json())
            .then(selectedEmployee => {
                const noteInput = document.getElementById('note');
                const startDateDisplay = document.getElementById('selected-date-start');
                const endDateDisplay = document.getElementById('selected-date-end');

                // Dohvati unos korisnika
                const noteValue = noteInput.value;
                const startDateValue = startDateDisplay.innerText;
                const endDateValue = endDateDisplay.innerText;

                // Kreiraj HTML element za prikaz unosa
                const entryElement = document.createElement('div');
                entryElement.innerHTML = `
                    <p>Employee: ${selectedEmployee.name}</p>
                    <p>Start Date: ${startDateValue}</p>
                    <p>End Date: ${endDateValue}</p>
                    <p>Note: ${noteValue}</p>
                    <hr>
                `;

                // Dodaj HTML element odmah ispod gumba
                listOfPtos.appendChild(entryElement);

                // Ovdje možeš dodati logiku za spremanje unosa na serveru ili bazi podataka
            });
    });
});
