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
  
      const name = document.createElement('p');
      name.textContent = `Name: ${employee.name}`;
  
      const username = document.createElement('p');
      username.textContent = `Username: ${employee.username}`;
  
      const email = document.createElement('p');
      email.textContent = `Email: ${employee.email}`;
  
      const address = document.createElement('p');
      address.textContent = `Address: ${employee.address.street}, ${employee.address.suite}, ${employee.address.city}, ${employee.address.zipcode}`;
  
      const phone = document.createElement('p');
      phone.textContent = `Phone: ${employee.phone}`;
  
      const website = document.createElement('p');
      website.textContent = `Website: ${employee.website}`;
  
      const company = document.createElement('p');
      company.textContent = `Company: ${employee.company.name}, ${employee.company.catchPhrase}, ${employee.company.bs}`;
  
      // Dodajte ostale informacije koje želite prikazati
  
      employeeDiv.appendChild(userId);
      employeeDiv.appendChild(name);
      employeeDiv.appendChild(username);
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