const loginButton = document.getElementById('loginButton'); // Update the selector


const user = {
    email: '',
    password: ''
}

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

function validateEmail() {
    const emailValue = emailInput.value.trim();

    // Regex za provjeru valjanosti email adrese
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(emailValue)) {
        // Valjana email adresa
        console.log('Email adresa je valjana:', emailValue);
        return true;
    } else if (emailValue.length > 0) {
        // Nevaljana email adresa samo ako je unesen neki tekst
        alert('Format emaila neispravan');
        return false;
    } else {
        // Prazno polje, ne prikazuj alert
        return false;
    }
}

function validatePassword() {
    const passwordValue = passwordInput.value;

    // Regex za provjeru valjanosti lozinke (minimalno 8 znakova, barem jedno malo slovo, barem jedno veliko slovo, barem jedna brojka, barem jedan znak)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:'",.<>?\/\\[\]|]).{8,}$/;

    if (passwordRegex.test(passwordValue)) {
        // Valjana lozinka
        console.log('Lozinka je valjana.');
        return true;
    } else {
        // Nevaljana lozinka
        alert('Lozinka mora imati minimalno 8 znakova, barem jedno malo slovo, barem jedno veliko slovo, barem jednu brojku i barem jedan znak.');
        return false;
    }
}

function redirectToHome() {
    window.location.href = 'add-new-pto.html'; // Preusmjeri korisnika na početnu stranicu
}

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}


function logIn(event) {
    // Postavljanje vrijednosti korisničkog imena i lozinke
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;

    console.log('Pokušaj prijave s emailom:', user.email, 'i lozinkom:', user.password);

    if (validateEmail() && validatePassword()) {
        setCookie('credentials', btoa(user.email + ':' + user.password));
        alert('Log in successful');
        console.log(user.email + user.password);
        redirectToHome(); // Dodano preusmjeravanje na početnu stranicu
    } else {
        console.log('Pogreška pri prijavi. Provjerite podatke.');
        // Dodajte dodatne radnje ili poruke po potrebi
    }
}

// Change LogInButton to loginButton in the following line
loginButton.addEventListener('click', function(event) {
    event.preventDefault(); // Spriječava podnošenje obrasca (submit)
    validateEmail();
    validatePassword();
    logIn(event);
});

