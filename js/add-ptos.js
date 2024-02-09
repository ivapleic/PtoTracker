async function fetchEmployees() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const employees = await response.json();
    console.log(employees);
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

function displayEmployees(employees) {
  const employeesDiv = document.getElementById('employeesDiv');

  employees.forEach(employee => {
    const employeeDiv = document.createElement('div');
    employeeDiv.classList.add('employee-item');

    const userId = document.createElement('p');
    userId.textContent = `User ID: ${employee.id}`;
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

    // employeeDiv.appendChild(userId);
    employeeDiv.appendChild(name);
    //employeeDiv.appendChild(username);
    employeeDiv.appendChild(email);
    employeeDiv.appendChild(address);
    employeeDiv.appendChild(phone);
    employeeDiv.appendChild(website);
    employeeDiv.appendChild(company);

    employeesDiv.appendChild(employeeDiv);
  });
}

// Poziv funkcije za dohvaćanje i prikazivanje podataka
fetchEmployees().then(employees => displayEmployees(employees));

document.getElementById('viewEmployeesBtn').addEventListener('click', () => {
  // Preusmjeri na stranicu za prikaz zaposlenika
  window.location.href = 'employees.html';
});