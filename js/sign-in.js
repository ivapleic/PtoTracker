const loginButton = document.getElementById('loginButton'); 


const user = {
    email: '',
    password: ''
}

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

function validateEmail() {
    const emailValue = emailInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /*
       - ^            Početak retka
       - [^\s@]+      korisničko ime prije znaka @
       - @            Simbol @
       - [^\s@]+      znakovi iza @ koji predstavljaju domenu (gmail,yahoo,fesb,..)
       - \.           Točka (.)
       - [^\s@]+      znakovi iza točke(npr com, org, hr)
       - $            Kraj retka
    */

    if (emailRegex.test(emailValue)) {
        console.log('Email adresa je valjana:', emailValue);
        return true;
    } else if (emailValue.length > 0) {
        alert('Format emaila nije ispravan');
        return false;
    } else {
        return false;
    }


}

function validatePassword() {
    const passwordValue = passwordInput.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:'",.<>?/\\[\]|]).{8,}$/;

    /*
       - ^                  Početak retka
       - (?=.*[a-z])        Jedno malo slovo
       - (?=.*[A-Z])        Jedno veliko slovo
       - (?=.*\d)           Jedan broj
       - (?=.*[!@#$%^&*()-_=+{};:'",.<>?/\\[\]|])  Jedan znak
       - .{8,}              Minimalno 8 znakova
       - $                  Kraj retka
    */
    
    if (passwordRegex.test(passwordValue)) {
        console.log('Lozinka je valjana.');
        return true;
    } else {
        alert('Lozinka mora imati minimalno 8 znakova,jedno malo slovo,jedno veliko slovo,jednu brojku i jedan znak.');
        return false;
    }
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

function logIn() {
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;

    if (validateEmail() && validatePassword()) {
        setCookie('credentials', btoa(user.email + ':' + user.password));
        alert('Log in successful');
        console.log(user.email + user.password);
        window.location.href = 'dashboard.html';
    } else {
        console.log('Pogreška pri prijavi. Provjerite podatke.');
    }
}

loginButton.addEventListener('click', function (event) {
    event.preventDefault();
    validateEmail();
    validatePassword();
    logIn();
});

