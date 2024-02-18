document.addEventListener('DOMContentLoaded', async function () {
    const employeeDropdown = document.getElementById('employeeDropdown');
    const startDateInput = document.getElementById('selected-date-start');
    const endDateInput = document.getElementById('selected-date-end');
    const employeesDiv = document.getElementById('employeesDiv');
    
    let employees = getEmployeesFromLocalStorage();

    if (!employees || employees.length === 0) {
        employees = await fetchEmployees();
        saveEmployeesToLocalStorage(employees);
    }

    displayEmployees(employees);
    populateEmployeeDropdown(employees);

    const addDataBtn = document.getElementById('addDataBtn');

    addDataBtn.addEventListener('click', function () {
        const employeeId = employeeDropdown.value;
        const startDate = startDateInput.innerHTML;
        const endDate = endDateInput.innerHTML;

        if (endDate < startDate) {
            alert('Invalid date range. End date must be greater than or equal to start date.');
            return;
        }

        const selectedEmployee = employees.find(employee => employee.id === parseInt(employeeId));

        if (selectedEmployee) {
            selectedEmployee.ptoHistory = selectedEmployee.ptoHistory || [];
            const ptoEntry = {
                id: generateUniqueId(),
                startDate: startDate,
                endDate: endDate
            };
            selectedEmployee.ptoHistory.push(ptoEntry);

            saveEmployeesToLocalStorage(employees);
            updateEmployeePto(selectedEmployee);
            displayEmployees(employees);
        } else {
            console.error('Employee not found');
        }
    });

    function updateEmployeePto(employee) {
        const employeeDiv = document.querySelector(`.employee-${employee.id}`);

        if (employeeDiv) {
            const ptoContainer = employeeDiv.querySelector('.pto-container');

            if (ptoContainer) {
                ptoContainer.innerHTML = '';
                employee.ptoHistory.forEach(pto => {
                    const ptoData = createPtoDiv(pto);
                    ptoContainer.appendChild(ptoData);
                });
            } else {
                console.error('PTO container not found within employee div');
            }
        } else {
            console.error('Employee div not found');
        }
    }

    function saveEmployeesToLocalStorage(employees) {
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    function getEmployeesFromLocalStorage() {
        const storedEmployees = localStorage.getItem('employees');
        return storedEmployees ? JSON.parse(storedEmployees) : null;
    }

    async function fetchEmployees() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const employees = await response.json();
            return employees.map(employee => ({ ...employee, ptoHistory: [] }));
        } catch (error) {
            console.error('Error fetching employees:', error);
            return [];
        }
    }

    function displayEmployees(employees) {
        employeesDiv.innerHTML = '';
        employees.forEach(employee => {
            const employeeDiv = createEmployeeDiv(employee);
            employeesDiv.appendChild(employeeDiv);
        });
    }

    function createEmployeeDiv(employee) {
        const employeeDiv = document.createElement('div');
        employeeDiv.classList.add('employee-item', `employee-${employee.id}`);

        const userId = createParagraph('userId', `${employee.id}`);
        const name = createParagraph('name', `${employee.name}`);
        const username = createParagraph('username', `Username: ${employee.username}`);
        const email = createParagraph('email', `Email: ${employee.email}`);
        const address = createParagraph('address', `Address: ${employee.address.street}, ${employee.address.suite}, ${employee.address.city}, ${employee.address.zipcode}`);
        const phone = createParagraph('phone', `Phone: ${employee.phone}`);
        const website = createParagraph('website', `Website: ${employee.website}`);
        const company = createParagraph('company', `Company: ${employee.company.name}`);
        
        const ptoContainer = document.createElement('div');
        ptoContainer.classList.add('pto-container');

        if (employee.ptoHistory && employee.ptoHistory.length > 0) {
            employee.ptoHistory.forEach(pto => {
                const ptoData = createPtoDiv(pto);
                ptoContainer.appendChild(ptoData);
            });
        }

        employeeDiv.appendChild(userId);
        employeeDiv.appendChild(name);
        employeeDiv.appendChild(username);
        employeeDiv.appendChild(email);
        employeeDiv.appendChild(address);
        employeeDiv.appendChild(phone);
        employeeDiv.appendChild(website);
        employeeDiv.appendChild(company);
        employeeDiv.appendChild(ptoContainer);

        return employeeDiv;
    }

    function populateEmployeeDropdown(employees) {
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.text = employee.name;
            employeeDropdown.appendChild(option);
        });
    }

    function createParagraph(className, text) {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        paragraph.classList.add(className);
        return paragraph;
    }

   function createPtoDiv(pto) {
        const ptoData = document.createElement('div');
        ptoData.classList.add('ptoData');

        const selectedStartDate = pto.startDate;
        const selectedEndDate = pto.endDate;
        const today = formatDate(new Date());

        // Initialize flags to false
        let pastPto = false, inTheMomentPto = false, futurePto = false;

        if (selectedEndDate < today) {
            // Past PTO
            if (!pastPto) {
                const pastPtoContainer = document.createElement('div');
                pastPtoContainer.classList.add('pto-section', 'past-ptos');
                const pastPtoDiv = createPtoSectionDiv('Past PTOS', pto);
                pastPtoContainer.appendChild(pastPtoDiv);
                ptoData.appendChild(pastPtoContainer);
                pastPto = true;
            } else {
                const pastPtoDiv = createPtoSectionDiv('Past PTOS', pto);
                ptoData.querySelector('.past-ptos').appendChild(pastPtoDiv);
            }
        } else if (selectedStartDate <= today && today <= selectedEndDate) {
            // In the moment PTO
            if (!inTheMomentPto) {
                const inTheMomentPtoContainer = document.createElement('div');
                inTheMomentPtoContainer.classList.add('pto-section', 'in-the-moment-ptos');
                const inTheMomentPtoDiv = createPtoSectionDiv('In the moment PTOS', pto);
                inTheMomentPtoContainer.appendChild(inTheMomentPtoDiv);
                ptoData.appendChild(inTheMomentPtoContainer);
                inTheMomentPto = true;
            } else {
                const inTheMomentPtoDiv = createPtoSectionDiv('In the moment PTOS', pto);
                ptoData.querySelector('.in-the-moment-ptos').appendChild(inTheMomentPtoDiv);
            }
        } else if (selectedStartDate > today) {
            // Future PTO
            if (!futurePto) {
                const futurePtoContainer = document.createElement('div');
                futurePtoContainer.classList.add('pto-section', 'future-ptos');
                const futurePtoDiv = createPtoSectionDiv('Future PTOS', pto);
                futurePtoContainer.appendChild(futurePtoDiv);
                ptoData.appendChild(futurePtoContainer);
                futurePto = true;
            } else {
                const futurePtoDiv = createPtoSectionDiv('Future PTOS', pto);
                ptoData.querySelector('.future-ptos').appendChild(futurePtoDiv);
            }
        }

        return ptoData;
    }
    
    
    function createPtoSectionDiv(sectionTitle, pto) {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('pto-section');
    
        const headingPto = document.createElement('p');
        headingPto.innerText = sectionTitle;

        const PtoRange=document.createElement('p');
        PtoRange.innerText=`${pto.startDate} to ${pto.endDate}`;

        sectionDiv.appendChild(headingPto);
        sectionDiv.appendChild(PtoRange);
    
        return sectionDiv;
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
    

    function generateUniqueId() {
        return new Date().getTime();
    }
});




/*
document.addEventListener('DOMContentLoaded', async function () {

    const employeeDropdown = document.getElementById('employeeDropdown');
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.text = employee.name;
        employeeDropdown.appendChild(option);
    });


    // Dohvati zaposlenike iz localStorage ili API-ja
    let employees = getEmployeesFromLocalStorage();
    if (!employees || employees.length === 0) {
        employees = await fetchEmployees();
        saveEmployeesToLocalStorage(employees);
    }

    // Prikazi zaposlenike
    displayEmployees(employees);

    const addDataBtn = document.getElementById('addDataBtn');

    addDataBtn.addEventListener('click', function () {
        const employeeDropdown = document.getElementById('employeeDropdown');
        const startDate = document.getElementById('selected-date-start').innerHTML;
        const endDate = document.getElementById('selected-date-end').innerHTML;
        const employeeId = employeeDropdown.value;

        // Provjeri jesu li datumi ispravni

        if (endDate < startDate) {
            alert('Invalid date range. End date must be greater than or equal to start date.');
            return;
        }

        // Pronađi odgovarajućeg zaposlenika prema ID-u
        const selectedEmployee = employees.find(employee => employee.id === parseInt(employeeId));

        if (selectedEmployee) {

            // Ažuriraj PTO podatke zaposlenika
            selectedEmployee.ptoHistory = selectedEmployee.ptoHistory || [];
            const ptoEntry = {
                id: generateUniqueId(),  // Generiraj jedinstveni identifikator za PTO unos
                startDate: startDate,
                endDate: endDate
            };
            selectedEmployee.ptoHistory.push(ptoEntry);

            // Spremi ažurirane podatke o zaposlenicima u localStorage
            saveEmployeesToLocalStorage(employees);

            // Pozovi funkciju za ažuriranje PTO podataka za određenog zaposlenika
            updateEmployeePto(selectedEmployee);

            // Prikazi ažurirane zaposlenike
            displayEmployees(employees);
        } else {
            console.error('Employee not found');
        }
    });

    function updateEmployeePto(employee) {
        const employeeDiv = document.querySelector(`.employee-${employee.id}`);

        if (employeeDiv) {
            // Ažuriraj PTO podatke unutar postojećeg diva zaposlenika
            const ptoContainer = employeeDiv.querySelector('.pto-container');
            if (ptoContainer) {
                // Očisti prikaz prije dodavanja novih PTO podataka
                ptoContainer.innerHTML = '';

                // Dodaj sve PTO podatke
                employee.ptoHistory.forEach(pto => {
                    const ptoData = createPtoDiv(pto);
                    ptoContainer.appendChild(ptoData);
                });
            } else {
                console.error('PTO container not found within employee div');
            }
        } else {
            console.error('Employee div not found');
        }
    }

    function saveEmployeesToLocalStorage(employees) {
        // Spremi ažurirane podatke o zaposlenicima u localStorage
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    function getEmployeesFromLocalStorage() {
        // Dohvati podatke o zaposlenicima iz localStorage
        const storedEmployees = localStorage.getItem('employees');
        return storedEmployees ? JSON.parse(storedEmployees) : null;
    }

    async function fetchEmployees() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const employees = await response.json();
            // Dodaj prazan PTO objekt za svakog zaposlenika
            return employees.map(employee => ({ ...employee, ptoHistory: [] }));
        } catch (error) {
            console.error('Error fetching employees:', error);
            return [];
        }
    }

    function displayEmployees(employees) {
        const employeesDiv = document.getElementById('employeesDiv');
        // Očisti prikaz prije nego što se prikažu ažurirani zaposlenici
        employeesDiv.innerHTML = '';

        employees.forEach(employee => {
            const employeeDiv = document.createElement('div');
            employeeDiv.classList.add('employee-item', `employee-${employee.id}`);

            const userId = document.createElement('p');
            userId.textContent = `${employee.id}`;
            userId.classList.add('userId');

            const name = document.createElement('p');
            name.textContent = `${employee.name}`;
            name.classList.add('name');

            const username = document.createElement('p');
            username.textContent = `Username: ${employee.username}`;
            username.classList.add('username');

            const email = document.createElement('p');
            email.textContent = `Email: ${employee.email}`;
            email.classList.add('email');

            const address = document.createElement('p');
            address.textContent = `Address: ${employee.address.street}, ${employee.address.suite}, ${employee.address.city}, ${employee.address.zipcode}`;
            address.classList.add('address');

            const phone = document.createElement('p');
            phone.textContent = `Phone: ${employee.phone}`;
            phone.classList.add('phone');

            const website = document.createElement('p');
            website.textContent = `Website: ${employee.website}`;
            website.classList.add('website');

            const company = document.createElement('p');
            company.textContent = `Company: ${employee.company.name}`;
            company.classList.add('company');

            // Dodaj PTO container
            const ptoContainer = document.createElement('div');
            ptoContainer.classList.add('pto-container');

            // Provjeri postoje li podaci o godišnjem odmoru i dodaj ih ako postoje
            if (employee.ptoHistory && employee.ptoHistory.length > 0) {
                const latestPto = employee.ptoHistory[employee.ptoHistory.length - 1];

                console.log(latestPto);

                if (isPastPto(latestPto)) {
                    const headingPto = document.createElement('p');
                    headingPto.innerText = 'PAST PTOS';
                    const pastPtoDiv = createPtoDiv(latestPto);
                    ptoContainer.appendChild(headingPto);
                    ptoContainer.appendChild(pastPtoDiv);
                } else if (isInMomentPto(latestPto)) {
                    const headingPto = document.createElement('p');
                    headingPto.innerText = 'PTOS IN THE MOMENT';
                    const inMomentPtoDiv = createPtoDiv(latestPto);
                    ptoContainer.appendChild(headingPto);
                    ptoContainer.appendChild(inMomentPtoDiv);

                } else if (isFuturePto(latestPto)) {
                    const headingPto = document.createElement('p');
                    headingPto.innerText = 'FUTURE PTOS';
                    const futurePtoDiv = createPtoDiv(latestPto);
                    ptoContainer.appendChild(headingPto);
                    ptoContainer.appendChild(futurePtoDiv);
                }
            }

            // Dodaj sve informacije o zaposleniku u glavni div
            employeeDiv.appendChild(userId);
            employeeDiv.appendChild(name);
            employeeDiv.appendChild(username);
            employeeDiv.appendChild(email);
            employeeDiv.appendChild(address);
            employeeDiv.appendChild(phone);
            employeeDiv.appendChild(website);
            employeeDiv.appendChild(company);
            employeeDiv.appendChild(ptoContainer);

            // Dodaj zaposlenika u glavni kontejner
            employeesDiv.appendChild(employeeDiv);
        });
    }

    function createPtoDiv(pto) {
        const ptoData = document.createElement('div');
        ptoData.classList.add('ptoData');

        const selectedStartDate = document.createElement('p');
        selectedStartDate.textContent = `Selected Start Date: ${pto.startDate || 'N/A'}`;
        selectedStartDate.classList.add('selectedStartDate');

        const selectedEndDate = document.createElement('p');
        selectedEndDate.textContent = `Selected End Date: ${pto.endDate || 'N/A'}`;
        selectedEndDate.classList.add('selectedEndDate');

        ptoData.appendChild(selectedStartDate);
        ptoData.appendChild(selectedEndDate);

        return ptoData;
    }

    function generateUniqueId() {
        // Generiraj jedinstveni identifikator na temelju vremena
        return new Date().getTime();
    }

    function isPastPto(pto) {
        const endDate = new Date(pto.endDate);
        const today = new Date();

        return endDate < today;
    }

    function isInMomentPto(pto) {
        const startDate = new Date(pto.startDate);
        const endDate = new Date(pto.endDate);
        const today = new Date();

        return startDate <= today && today <= endDate;
    }

    function isFuturePto(pto) {
        const startDate = new Date(pto.startDate);
        const today = new Date();

        return startDate > today;
    }
});
*/
