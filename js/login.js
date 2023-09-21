// login.html Elements
const usernameInput = document.querySelector('#username-input');
const passwordInput = document.querySelector('#password-input');
const contactsLink = document.querySelector('#contacts-link');

// Constant Variables
const HttpStatus = { success : 200 };
const XhrReadyState = { done : 4 }
const apiUrlBase = 'http://cop433112.com/LAMPAPI';

// Backend Endpoints
const loginEndpoint = 'Login.php'

setUp();

function setUp() {
    let user = readUserCookie();

    if (user == null) {
        contactsLink.classList.add('disabled');
        contactsLink.removeAttribute('href');
    } else {
        window.location.href = "contacts.html";
    }
}

function doLogin() {
    let username = usernameInput.value;
    let password = passwordInput.value;
    let hash = md5(password);

    let tmp = { login: username, password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = apiUrlBase + '/' + loginEndpoint;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.id < 1) {
                    usernameInput.classList.add("is-invalid");
                    passwordInput.classList.add("is-invalid");
                    return;
                }
                usernameInput.classList.add("is-valid");
                passwordInput.classList.add("is-valid");

                saveUserCookie(jsonObject.id, jsonObject.firstName, jsonObject.lastName);
                window.location.href = 'contacts.html';
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: " + err.message);
    }
}

usernameInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        doLogin();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        doLogin();
    }
});
