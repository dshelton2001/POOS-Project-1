// signup.html elements
const firstnameInput = document.querySelector('#firstnameInput');
const lastnameInput = document.querySelector('#lastnameInput');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const confirmpasswordInput = document.querySelector('#confirmpasswordInput');

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
		console.log("badinput");
		document.getElementById("dupUserText").innerHTML = err.message;
		changeVisability(e3, 0);
	}
}

function changeVisability(a, state) {
	if (state == 0) {
		for (let i = 0; i < a.length; i++) {
			a[i].classList.remove("notvisible");
			a[i].classList.add("visible");
		}
	} else {
		for (let i = 0; i < a.length; i++) {
			a[i].classList.remove("visible");
			a[i].classList.add("notvisible");
		}
	}
}

function checkInput() {
	var nonempty;
	var sc1;
	var passLen;
	var passSc;
	var passMatch;

	const e1 = document.querySelectorAll(".e1");
	const e2 = document.querySelectorAll(".e2");
	const e3 = document.querySelectorAll(".e3");
	const e4 = document.querySelectorAll(".e4");

	// Validate Empty Fields
	if (firstnameInput.value == "" || lastnameInput.value == "" ||
		usernameInput.value == "" || passwordInput.value == "" ||
		confirmpasswordInput.value == "") {

		changeVisability(e1, 0);
		nonempty = false;
	} else {
		changeVisability(e1, 1);
		nonempty = true;
	}

	// Validate First or Last contain no special chars.
	if (checkSpecialCharacters(firstnameInput.value) || checkSpecialCharacters(lastnameInput.value)
		|| firstnameInput.value == "" || lastnameInput.value == "") {
		changeVisability(e2, 0);
		sc1 = false;
	} else {
		changeVisability(e2, 1);
		sc1 = true;
	}

	// Validate password strength
	if (checkPasswordStrength(passwordInput.value) != true) {
		passLen = false;
	} else {
		passLen = true;
	}

	if (checkSpecialCharacters(passwordInput.value) != true) {
		passSc = false;
	} else {
		passSc = true;
	}

	if (confirmpasswordInput.value != passwordInput.value || passwordInput.value == "") {
		passMatch = false;
	} else {
		passMatch = true;
	}

	if (!(passLen && passSc && passMatch)) {
		changeVisability(e4, 0);
	} else {
		changeVisability(e4, 1);
	}

	if (nonempty && sc1 && passLen && passSc && passMatch) {
		doSignUp();
	}
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
	return true;
}

function checkPasswords() {

}
