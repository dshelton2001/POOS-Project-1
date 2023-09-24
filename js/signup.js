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
				window.location.href = 'login.html';
			}
			else {
				usernameInput.classList.add("is-invalid");
				document.getElementById("userFeedBack").innerHTML = "Invalid Username";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log("Error: " + err.message);
	}
}

//Checks for valid inputs
function checkInput() {
	var elements = document.getElementsByClassName("form-control");
	var feedback = document.getElementsByClassName("invalid-feedback");
	var names = [document.getElementById("firstnameInput"), document.getElementById("lastnameInput")];

	// Validate Empty Fields
	for (let i = 0; i < elements.length; i++) {
		if (elements[i].value == "") {
			elements[i].classList.add("is-invalid");
			feedback[i].innerHTML = "Cannot be empty";
		} else if (checkSpecialCharacters(elements[i].value) == true && i < 2) {
			elements[i].classList.add("is-invalid");
			feedback[i].innerHTML = "Cannot have special characters";
		} else {
			elements[i].classList.remove("is-invalid");
		}
	}

	// Validate password strength
	if (checkPasswordStrength(passwordInput.value) != true ||
		checkSpecialCharacters(passwordInput.value) != true ||
		confirmpasswordInput.value != passwordInput.value) {
		passwordInput.classList.add("is-invalid");
		document.getElementById("passFeedBack").innerHTML = "Password needs 8 characters, needs a special character, and must match confirm password";
	} else {
		passwordInput.classList.remove("is-invalid");
	}

	if (!firstnameInput.classList.contains("is-invalid") &&
		!lastnameInput.classList.contains("is-invalid") &&
		!usernameInput.classList.contains("is-invalid") &&
		!passwordInput.classList.contains("is-invalid") &&
		!confirmpasswordInput.classList.contains("is-invalid")) {
		doSignUp();
	}
}

//Checks for special character in input
function checkSpecialCharacters(str) {
	const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?~]/;
	return specialChars.test(str);
}

//Checks the length of the password
function checkPasswordStrength(str) {
	if (str.length < 8)
		return false;
	return true;
}

