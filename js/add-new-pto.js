const employeeDropdown = document.getElementById('employeeDropdown');
const startDateInput = document.getElementById('hidden-start-date');
const endDateInput = document.getElementById('hidden-end-date');

function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

function generateUniqueId() {
    return new Date().getTime();
}

function getSeason(date) {
    const month = date.getMonth() + 1;
    switch (month) {
        case 12:
        case 1:
        case 2:
            return 'winter';
        case 3:
        case 4:
        case 5:
            return 'spring';
        case 6:
        case 7:
        case 8:
            return 'summer';
        case 9:
        case 10:
        case 11:
            return 'autumn';
        default:
            return 'unknown';
    }
}

function getSeasonImage(season) {
    switch (season) {
        case 'winter':
            return '../images/winter.jpg';
        case 'spring':
            return 'https://www.mlive.com/resizer/4nGy2tGJi5r3bTW4XOVJocpspBs=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/ABBNSXTHMJFUXE4CM63H5FOW7A.jpg';
        case 'summer':
            return '../images/summer-picture.jpg';
        case 'autumn':
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD1p-EHvbrJlgAj9tnmXoncXa9s9r6UDxoimQnHAs12Q&s';
        default:
            return '';
    }
}

function saveEmployeesToLocalStorage(employees) {
    let storedEmployees = getEmployeesFromLocalStorage();

    if (!storedEmployees || storedEmployees.length === 0) {
        // If there are no existing employees, save the current employees directly
        localStorage.setItem('employees', JSON.stringify(employees));
    } else {
        // If there are existing employees, update the relevant ones
        storedEmployees = storedEmployees.map((storedEmployee) => {
            const updatedEmployee = employees.find((newEmployee) => newEmployee.id === storedEmployee.id);
            return updatedEmployee || storedEmployee;
        });

        // Save individual PTOs with unique keys
        storedEmployees.forEach((employee) => {
            employee.ptoHistory.pastPtos.forEach((pto) => {
                const key = `employee_${employee.id}_pto_${pto.id}`;
                localStorage.setItem(key, JSON.stringify(pto));
            });

            employee.ptoHistory.inTheMomentPtos.forEach((pto) => {
                const key = `employee_${employee.id}_pto_${pto.id}`;
                localStorage.setItem(key, JSON.stringify(pto));
            });

            employee.ptoHistory.futurePtos.forEach((pto) => {
                const key = `employee_${employee.id}_pto_${pto.id}`;
                localStorage.setItem(key, JSON.stringify(pto));
            });
        });

        localStorage.setItem('employees', JSON.stringify(storedEmployees));
        console.log('Employees updated in localStorage:', storedEmployees);
    }
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

function handleAddPtoClick(employees) {
    const employeeId = employeeDropdown.value;
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate < startDate) {
        alert('End date must be greater than or equal to start date!');
        return;
    }

    const selectedEmployee = employees.find(employee => employee.id === parseInt(employeeId));

    if (selectedEmployee) {
        if (!selectedEmployee.ptoHistory) {
            selectedEmployee.ptoHistory = {
                pastPtos: [],
                inTheMomentPtos: [],
                futurePtos: []
            };
        }

        const today = new Date();
        const ptoEntry = {
            id: `${selectedEmployee}_pto_${generateUniqueId()}`,
            startDate: startDate,
            endDate: endDate
        };

        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startDateTime = new Date(ptoEntry.startDate.getFullYear(), ptoEntry.startDate.getMonth(), ptoEntry.startDate.getDate());
        const endDateTime = new Date(ptoEntry.endDate.getFullYear(), ptoEntry.endDate.getMonth(), ptoEntry.endDate.getDate());

        if (endDateTime < todayDate) {
            selectedEmployee.ptoHistory.pastPtos = selectedEmployee.ptoHistory.pastPtos || [];
            selectedEmployee.ptoHistory.pastPtos.push(ptoEntry);
        } else if (startDateTime <= todayDate && endDateTime >= todayDate) {
            selectedEmployee.ptoHistory.inTheMomentPtos = selectedEmployee.ptoHistory.inTheMomentPtos || [];
            selectedEmployee.ptoHistory.inTheMomentPtos.push(ptoEntry);
        } else if (startDateTime > todayDate) {
            selectedEmployee.ptoHistory.futurePtos = selectedEmployee.ptoHistory.futurePtos || [];
            selectedEmployee.ptoHistory.futurePtos.push(ptoEntry);
        }

        saveEmployeesToLocalStorage(employees);
        updateEmployeePto(selectedEmployee);
        displayEmployees(employees);
        alert(`Successfully added new PTO for ${selectedEmployee.name}`);
    } else {
        console.error('Employee not found');
    }
}

function updateEmployeePto(employee) {
    const employeeDiv = document.querySelector(`.employee-${employee.id}`);

    if (employeeDiv) {
        const ptoContainer = employeeDiv.querySelector('.pto-container');

        if (ptoContainer) {
            ptoContainer.innerHTML = '';

            displayPtoSection(employee.ptoHistory.pastPtos, 'Past PTOS', ptoContainer);

            displayPtoSection(employee.ptoHistory.inTheMomentPtos, 'In the moment PTOS', ptoContainer);

            displayPtoSection(employee.ptoHistory.futurePtos, 'Future PTOS', ptoContainer);
        } else {
            console.error('PTO container not found within employee div');
        }
    } else {
        console.error('Employee div not found');
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
    employeeDiv.dataset.id = employee.id;

    const name = createParagraph('name', `${employee.name}`);
    const email = createParagraph('email', `Email: ${employee.email}`);
    const address = createParagraph('address', `Address: ${employee.address.street}, ${employee.address.suite}, ${employee.address.city}, ${employee.address.zipcode}`);
    const phone = createParagraph('phone', `Phone: ${employee.phone}`);
    const company = createParagraph('company', `Company: ${employee.company.name}`);

    const ptoContainer = document.createElement('div');
    ptoContainer.classList.add('pto-container');

    employeeDiv.appendChild(name);
    employeeDiv.appendChild(email);
    employeeDiv.appendChild(address);
    employeeDiv.appendChild(phone);
    employeeDiv.appendChild(company);
    employeeDiv.appendChild(ptoContainer);

    if (employee.ptoHistory) {
        let pastPtoContainer = ptoContainer.querySelector('.past-ptos');
        let inTheMomentContainer = ptoContainer.querySelector('.in-the-moment-ptos');
        let futurePtoContainer = ptoContainer.querySelector('.future-ptos');

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

function createPtoDiv(pto) {
    const ptoData = document.createElement('div');
    ptoData.classList.add('ptoData');
    ptoData.dataset.id = pto.id;

    const selectedStartDate = pto.startDate instanceof Date ? pto.startDate : new Date(pto.startDate);
    const selectedEndDate = pto.endDate instanceof Date ? pto.endDate : new Date(pto.endDate);

    const dateRange = document.createElement('p');
    dateRange.classList.add('date-range');
    dateRange.innerText = `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
    ptoData.appendChild(dateRange);

    const season = getSeason(selectedStartDate);
    ptoData.style.backgroundImage = `url(${getSeasonImage(season)})`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerText = 'Delete PTO';
    deleteButton.dataset.ptoId = pto.id;
    deleteButton.addEventListener('click',()=> deletePto());
    ptoData.appendChild(deleteButton);

    return ptoData;
}

function createSectionDiv(sectionTitle, sectionClass) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add(sectionClass);

    const headingPto = document.createElement('p');
    headingPto.innerText = sectionTitle;
    headingPto.style.fontWeight = 'bold';

    sectionDiv.appendChild(headingPto);

    return sectionDiv;
}

async function deletePto(event) {
    const confirmed = confirm('Are you sure you want to delete this PTO entry?');

    if (confirmed) {
        const deleteButton = event.currentTarget;
        const ptoData = deleteButton.parentElement; // Find the parent element containing PTO data
        const employeeDiv = ptoData.closest('.employee-item'); // Find the employee container element

        const ptoId = ptoData.dataset.id;
        const employeeId = employeeDiv ? parseInt(employeeDiv.dataset.id) : null;

        if (employeeId !== null) {
            const employeeIndex = employees.findIndex(emp => emp.id === employeeId);

            if (employeeIndex !== -1) {
                const ptoCategories = ['pastPtos', 'inTheMomentPtos', 'futurePtos'];

                ptoCategories.forEach(ptoCategory => {
                    const currentPtoHistory = employees[employeeIndex].ptoHistory[ptoCategory];

                    if (currentPtoHistory) {
                        // Find the index of the PTO entry based on its id
                        const ptoIndex = currentPtoHistory.findIndex(entry => entry.id === ptoId);

                        if (ptoIndex !== -1) {
                            employees[employeeIndex].ptoHistory[ptoCategory].splice(ptoIndex, 1);
                        }
                    }
                });

                saveEmployeesToLocalStorage(employees);
                ptoData.remove();
                deletePtoFromLocalStorage(employeeId, ptoId);

                alert('PTO deleted successfully');
            } else {
                console.error('Employee not found in the array');
            }
        } else {
            console.error('Employee ID not found');
        }
    }
}

async function deletePtoFromLocalStorage(employeeId, ptoId) {
    const key = `employee_${employeeId}_pto_${ptoId}`;
    localStorage.removeItem(key);
}

function displayPtoSection(ptos, sectionTitle, container) {
    if (ptos && ptos.length > 0) {
        const sectionContainer = document.createElement('div');

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

document.addEventListener('DOMContentLoaded', async function () {
    employees = getEmployeesFromLocalStorage();

    if (!employees || employees.length === 0) {
        employees = await fetchEmployees();
        saveEmployeesToLocalStorage(employees);
    }

    displayEmployees(employees);
    populateEmployeeDropdown(employees);

    const addDataBtn = document.getElementById('addDataBtn');
    addDataBtn.addEventListener('click',()=> handleAddPtoClick(employees));

});