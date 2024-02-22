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

    console.log(employees);

    displayEmployees(employees);
    populateEmployeeDropdown(employees);

    const addDataBtn = document.getElementById('addDataBtn');

    addDataBtn.addEventListener('click', function () {
        const employeeId = employeeDropdown.value;
        const startDate = startDateInput.innerText;
        const endDate = endDateInput.innerText;

        console.log(startDate);
        console.log(endDate);

        if (endDate < startDate) {
            alert('Invalid date range. End date must be greater than or equal to start date.');
            return;
        }

        const selectedEmployee = employees.find(employee => employee.id === parseInt(employeeId));

        if (selectedEmployee) {
            // Check if the employee has existing PTO history
            if (!selectedEmployee.ptoHistory) {
                selectedEmployee.ptoHistory = {
                    pastPtos: [],
                    inTheMomentPtos: [],
                    futurePtos: []
                };
            }

            const ptoEntry = {
                id: generateUniqueId(),
                startDate: startDate,
                endDate: endDate
            };

            const today = formatDate(new Date());

            if (ptoEntry.endDate < today) {
                selectedEmployee.ptoHistory.pastPtos = selectedEmployee.ptoHistory.pastPtos || [];
                selectedEmployee.ptoHistory.pastPtos.push(ptoEntry);
            } else if (ptoEntry.startDate <= today && ptoEntry.endDate >= today) {
                selectedEmployee.ptoHistory.inTheMomentPtos = selectedEmployee.ptoHistory.inTheMomentPtos || [];
                selectedEmployee.ptoHistory.inTheMomentPtos.push(ptoEntry);
            } else if (ptoEntry.startDate > today) {
                console.log('pushed to the future array');
                selectedEmployee.ptoHistory.futurePtos = selectedEmployee.ptoHistory.futurePtos || [];
                selectedEmployee.ptoHistory.futurePtos.push(ptoEntry);
            }

            saveEmployeesToLocalStorage(employees);
            updateEmployeePto(selectedEmployee);
            displayEmployees(employees);
            alert(`Successfully added new Pto for ${selectedEmployee.name}`);
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

                // Prikazi PTO za prošle ptos
                displayPtoSection(employee.ptoHistory.pastPtos, 'Past PTOS', ptoContainer);

                // Prikazi PTO za trenutne ptos
                displayPtoSection(employee.ptoHistory.inTheMomentPtos, 'In the moment PTOS', ptoContainer);

                // Prikazi PTO za buduće ptos
                displayPtoSection(employee.ptoHistory.futurePtos, 'Future PTOS', ptoContainer);
            } else {
                console.error('PTO container not found within employee div');
            }
        } else {
            console.error('Employee div not found');
        }
    }


    function displayPtoSection(ptos, sectionTitle, container) {
        if (ptos && ptos.length > 0) {
            const sectionContainer = document.createElement('div');
            // sectionContainer.classList.add('pto-section', sectionTitle.toLowerCase().replace(' ', '-'));

            ptos.forEach(pto => {
                const ptoDiv = createPtoDiv(pto);
                sectionContainer.appendChild(ptoDiv);
            });

            const headingPto = document.createElement('p');
            headingPto.innerText = sectionTitle;

            container.appendChild(headingPto);
            container.appendChild(sectionContainer);
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

            return employees.map(employee => ({
                ...employee,
                ptoHistory: {
                    pastPtos: [],
                    inTheMomentPtos: [],
                    futurePtos: []
                }
            }));
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
        // const headingPto = document.createElement('p');
        // headingPto.classList.add('list-of-ptos-heading');
        // headingPto.innerText = 'LIST OF PTOS';
        // ptoContainer.appendChild(headingPto);

        employeeDiv.appendChild(userId);
        employeeDiv.appendChild(name);
        employeeDiv.appendChild(username);
        employeeDiv.appendChild(email);
        employeeDiv.appendChild(address);
        employeeDiv.appendChild(phone);
        employeeDiv.appendChild(website);
        employeeDiv.appendChild(company);
        employeeDiv.appendChild(ptoContainer);

        if (employee.ptoHistory) {
            let pastPtoContainer = ptoContainer.querySelector('.past-ptos');
            let inTheMomentContainer = ptoContainer.querySelector('.in-the-moment-ptos');
            let futurePtoContainer = ptoContainer.querySelector('.future-ptos');

            // Past PTOs
            if (employee.ptoHistory.pastPtos && employee.ptoHistory.pastPtos.length > 0) {
                if (!pastPtoContainer) {
                    pastPtoContainer = createSectionDiv('PAST PTOS', 'past-ptos');
                    ptoContainer.appendChild(pastPtoContainer);
                }
                employee.ptoHistory.pastPtos.forEach(pto => {
                    const ptoData = createPtoDiv(pto);
                    pastPtoContainer.appendChild(ptoData);
                });
            }

            // In the Moment PTOs
            if (employee.ptoHistory.inTheMomentPtos && employee.ptoHistory.inTheMomentPtos.length > 0) {
                if (!inTheMomentContainer) {
                    inTheMomentContainer = createSectionDiv('IN THE MOMENT PTOS', 'in-the-moment-ptos');
                    ptoContainer.appendChild(inTheMomentContainer);
                }
                employee.ptoHistory.inTheMomentPtos.forEach(pto => {
                    const ptoData = createPtoDiv(pto);
                    inTheMomentContainer.appendChild(ptoData);
                });
            }

            // Future PTOs
            if (employee.ptoHistory.futurePtos && employee.ptoHistory.futurePtos.length > 0) {
                if (!futurePtoContainer) {
                    futurePtoContainer = createSectionDiv('FUTURE PTOS', 'future-ptos');
                    ptoContainer.appendChild(futurePtoContainer);
                }
                employee.ptoHistory.futurePtos.forEach(pto => {
                    const ptoData = createPtoDiv(pto);
                    futurePtoContainer.appendChild(ptoData);
                });
            }
        }

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
        ptoData.dataset.id = pto.id;

        // Access startDate and endDate properties correctly
        const selectedStartDate = pto.startDate;
        const selectedEndDate = pto.endDate;

        const dateRange = document.createElement('p');
        dateRange.innerText = `${selectedStartDate} - ${selectedEndDate}`;
        ptoData.appendChild(dateRange);

        // Dodajte gumb za brisanje
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerText = 'Delete PTO';
        deleteButton.dataset.ptoId = pto.id;
        deleteButton.addEventListener('click', deletePto);
        ptoData.appendChild(deleteButton);


        return ptoData;
    }


    function createSectionDiv(sectionTitle, sectionClass) {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add(sectionClass);

        const headingPto = document.createElement('p');
        headingPto.innerText = sectionTitle;

        sectionDiv.appendChild(headingPto);

        return sectionDiv;
    }

    function deletePto(event) {
        const confirmed = confirm('Are you sure you want to delete this PTO entry?');
    
        if (confirmed) {
            const deleteButton = event.currentTarget;
            const ptoId = deleteButton.dataset.ptoId;
            const employeeId = extractEmployeeId(ptoId);
    
            const currentEmployee = employees.find(employee => employee.id === employeeId);
    
            // Funkcija za pronalaženje indeksa u bilo kojem nizu i brisanje elementa
            const findIndexAndRemove = (array, id) => {
                const index = array.findIndex(entry => entry.id === id);
                if (index !== -1) {
                    array.splice(index, 1);
                }
            };
    
            // Obriši PTO iz odgovarajućeg niza
            findIndexAndRemove(currentEmployee.ptoHistory.pastPtos, ptoId);
            findIndexAndRemove(currentEmployee.ptoHistory.inTheMomentPtos, ptoId);
            findIndexAndRemove(currentEmployee.ptoHistory.futurePtos, ptoId);
    
            // Ukloni PTO div iz DOM-a
            deleteButton.parentElement.remove();
    
            // Ažuriraj localStorage i prikaži promjene na ekranu
            saveEmployeesToLocalStorage(employees);
            updateEmployeePto(currentEmployee);
            displayEmployees(employees);
        }
    }

    function extractEmployeeId(ptoDataId) {
    // Pridružite ID zaposlenika nakon crte kao broj
    return parseInt(ptoDataId.split('-')[1]);
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