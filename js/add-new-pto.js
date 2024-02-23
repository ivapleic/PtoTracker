document.addEventListener('DOMContentLoaded', async function () {
    const employeeDropdown = document.getElementById('employeeDropdown');
    const startDateInput = document.getElementById('hidden-start-date');
    const endDateInput = document.getElementById('hidden-end-date');
    const employeesDiv = document.getElementById('employeesDiv');

    let employees = getEmployeesFromLocalStorage();
    console.log('Employees from localStorage:', employees);

    if (!employees || employees.length === 0) {
        employees = await fetchEmployees();
        saveEmployeesToLocalStorage(employees);
        console.log('Employees fetched and saved to localStorage:', employees);
    }

    displayEmployees(employees);
    populateEmployeeDropdown(employees);

    const addDataBtn = document.getElementById('addDataBtn');

    addDataBtn.addEventListener('click', function () {
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
                id: generateUniqueId(),
                startDate: startDate,
                endDate: endDate
            };

            // Uzmite samo godine, mjesece i dane iz datuma
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const startDateTime = new Date(ptoEntry.startDate.getFullYear(), ptoEntry.startDate.getMonth(), ptoEntry.startDate.getDate());
            const endDateTime = new Date(ptoEntry.endDate.getFullYear(), ptoEntry.endDate.getMonth(), ptoEntry.endDate.getDate());

            if (endDateTime < todayDate) {
                selectedEmployee.ptoHistory.pastPtos = selectedEmployee.ptoHistory.pastPtos || [];
                selectedEmployee.ptoHistory.pastPtos.push(ptoEntry);
                alert('in the past');
            } else if (startDateTime <= todayDate && endDateTime >= todayDate) {
                selectedEmployee.ptoHistory.inTheMomentPtos = selectedEmployee.ptoHistory.inTheMomentPtos || [];
                selectedEmployee.ptoHistory.inTheMomentPtos.push(ptoEntry);
            } else if (startDateTime > todayDate) {
                console.log('pushed to the future array');
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
        console.log('Employees saved to localStorage:', employees);
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
        employeeDiv.dataset.id = employee.id; // Add this line

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
        ptoData.dataset.id = `pto-${pto.id}`;
    
        // Access startDate and endDate properties correctly
        const selectedStartDate = pto.startDate instanceof Date ? pto.startDate : new Date(pto.startDate);
        const selectedEndDate = pto.endDate instanceof Date ? pto.endDate : new Date(pto.endDate);
    
        const dateRange = document.createElement('p');
        dateRange.classList.add('date-range');
        dateRange.innerText = `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
        ptoData.appendChild(dateRange);
    
        // Determine the current season and set background image
        const season = getSeason(selectedStartDate);
        ptoData.style.backgroundImage = `url(${getSeasonImage(season)})`;
    
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerText = 'Delete PTO';
        deleteButton.dataset.ptoId = pto.id;
        deleteButton.addEventListener('click', deletePto);
        ptoData.appendChild(deleteButton);
    
        return ptoData;
    }
    
    function getSeason(date) {
        const month = date.getMonth() + 1; // January is 0
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
        // Provide the correct relative or absolute paths to your season-specific images
        switch (season) {
            case 'winter':
                return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9fSM8-06ijcG03u5jQKLlGQehS12M87gBo9ez6Qtu7A&s';  // Corrected path
            case 'spring':
                return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgC6gK8zJrYITDG21bNfD-fedEMl5-4MCdRNaM3Ulitw&s';
            case 'summer':
                return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoeTr-DELdfTZSBl8Oh7tforzVNi3dFOxoojFMdfbp5A&s';  // Corrected path
            case 'autumn':
                return 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_1280.jpg';
            default:
                return '';
        }
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
            const ptoData = deleteButton.parentElement;
            const employeeDiv = findAncestor(ptoData, 'employee-item');
    
            // Dohvat ID-a PTO-a iz dataset-a
            const ptoId = ptoData.dataset.id;
    
            // Dohvat ID-a zaposlenika iz dataset-a employeeDiv-a
            const employeeId = employeeDiv ? parseInt(employeeDiv.dataset.id) : null;
    
            console.log('PTO ID:', ptoId);
            console.log('Employee ID:', employeeId);
    
            if (employeeId !== null) {
                // Call the new function to delete the PTO entry from localStorage
                const updatedEmployees = deletePtoFromLocalStorage(employeeId, ptoId);
    
                if (updatedEmployees !== null) {
                    // Refresh the page or re-render the employees after deleting PTO
                    displayEmployees(updatedEmployees);
    
                    console.log('PTO deleted successfully');
                } else {
                    console.error('Employee not found or missing ptoHistory');
                }
            } else {
                console.error('Employee ID not found');
            }
        }
    }
 
    function findIndexAndRemove(array, id) {
        if (Array.isArray(array)) {
            return array.filter(entry => entry.id !== id);
        }
        return array;
    }
    
    function deletePtoFromLocalStorage(employeeId, ptoId) {
        // Remove the specific PTO entry from localStorage
        const storedEmployees = getEmployeesFromLocalStorage();
        if (storedEmployees) {
            console.log('Deleting PTO from localStorage:', storedEmployees);
    
            const updatedEmployees = storedEmployees.map(employee => {
                if (employee.id === employeeId && employee.ptoHistory) {
                    const updatedPtoHistory = {
                        pastPtos: findIndexAndRemove(employee.ptoHistory.pastPtos, ptoId),
                        inTheMomentPtos: findIndexAndRemove(employee.ptoHistory.inTheMomentPtos, ptoId),
                        futurePtos: findIndexAndRemove(employee.ptoHistory.futurePtos, ptoId),
                    };
    
                    // Create a new employee object with updated ptoHistory
                    return { ...employee, ptoHistory: updatedPtoHistory };
                }
                return employee;
            });
    
            console.log('Employees after deleting PTO:', updatedEmployees);
    
            // Save the updated data back to localStorage
            saveEmployeesToLocalStorage(updatedEmployees);
    
            return updatedEmployees;
        }
        return null;
    }
    
    
    
    
    
    
    

    function findAncestor(element, className) {
        while ((element = element.parentElement) && !element.classList.contains(className));
        return element;
    }







    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }


    function generateUniqueId() {
        return new Date().getTime();
    }
});