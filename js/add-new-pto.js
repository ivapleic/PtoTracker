 // Fetch employees from the API
 fetch('https://jsonplaceholder.typicode.com/users')
 .then(response => response.json())
 .then(data => {
     const employeeDropdown = document.getElementById('employeeDropdown');

     // Populate the dropdown with employee names
     data.forEach(employee => {
         const option = document.createElement('option');
         option.value = employee.id;
         option.textContent = employee.name;
         employeeDropdown.appendChild(option);
     });
 })
 .catch(error => console.error('Error fetching employees:', error));