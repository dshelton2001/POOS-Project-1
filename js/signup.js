// signup.html elements
const firstnameInput = document.querySelector('#firstnameInput');
const lastnameInput = document.querySelector('#lastnameInput');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const errMsg = document.querySelector('#errMsg');

// Constant Variables
const HttpStatus = { success: 200 };
const XhrReadyState = { done: 4 };
const apiUrlBase = 'http://cop433112.com/LAMPAPI';
const userId = 0;

// Backend Endpoints
const signupEndpoint = 'SignUp.php'

// Adds user to database
function doSignUp() {
	let firstName = firstnameInput.value
	let lastName = lastnameInput.value;
	let userName = usernameInput.value;
	let password = passwordInput.value;
	let hash = md5(password);

	let tmp = { fName: firstName, lName: lastName, userName: userName, pwd: hash };
	let jsonPayload = JSON.stringify(tmp);

	let url = apiUrlBase + '/' + signupEndpoint;

	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
				let jsonObject = JSON.parse(xhr.responseText);
				saveUserCookie(jsonObject.id, jsonObject.firstName, jsonObject.lastName, jsonObject.userName, jsonObject.password);
				window.location.href = 'login.html';
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		errMsg.innerHTML = err.message;
	}
}

// Checks for duplicate username
function findUser() {
	let srch = usernameInput.value;

	let tmp = { userId: userId, search: srch };
	let jsonPayload = JSON.stringify(tmp);

	let url = apiUrlBase + '/' + searchEndpoint;

	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
				let jsonObject = JSON.parse(xhr.responseText);

				for (let i = 0; i < jsonObject.results.length; i++) {
					if (jsonObject.results[i].value == srch) {
						errMsg.innerHTML = 'Invalid Username';
						return;
					}
				}
				doSignUp();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		errMsg.innerHTML = err.message;
	}
}

function checkInput() {

	// Validate Empty Fields
	if (firstnameInput.value == "" || lastnameInput.value == "" ||
		usernameInput.value == "" || passwordInput.value == "") {
		errMsg.innerHTML = 'Please fill all boxes';
		return;
	}

	// Validate First or Last contain no special chars.
	if (checkSpecialCharacters(firstnameInput.value) || checkSpecialCharacters(lastnameInput.value)) {
		errMsg.innerHTML = 'You are not allowed to use special characters in your first or last name.';
		return;
	}

	// Validate password strength
	if (checkPasswordStrength(passwordInput.value) != true) {
		errMsg.innerHTML = 'Your password must contain 1 special character and be at least 8 characters.';
		return;
	}

	doSignUp();
}

function checkSpecialCharacters(str) {
	const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?~]/;
	return specialChars.test(str);
}

function checkExistingUsername(str) {

}

function checkPasswordStrength(str) {
	if (str.length < 8)
		return false;
	return checkSpecialCharacters(str);
}
