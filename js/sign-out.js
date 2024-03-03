const signoutLink = document.getElementById('signoutLink');

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

function logOut() {
    setCookie('credentials', '', 0);
}

signoutLink.addEventListener('click', function(event) {
    event.preventDefault(); 
    logOut();
    window.location.href = 'index.html';
});
