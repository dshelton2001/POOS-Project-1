// login.html Elements
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const loginButton = document.querySelector('#loginButton');
const loginResultText = document.querySelector('#loginResultText');

// Constant Variables
const HttpStatus = { success : 200 };
const XhrReadyState = { done : 4 }
const apiUrlBase = 'http://cop433112.com/LAMPAPI';

// Backend Endpoints
const loginEndpoint = 'Login.php'

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
                    loginResultText.innerHTML = 'Invalid username or password';
                    return;
                }

                saveUserCookie(jsonObject.id, jsonObject.firstName, jsonObject.lastName);
                window.location.href = 'contacts.html';
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        loginResultText.innerHTML = err.message;
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
