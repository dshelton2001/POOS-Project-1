// signup.html elements
const firstnameInput = document.querySelector('#firstnameInput');
const lastnameInput = document.querySelector('#lastnameInput');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const confirmpasswordInput = document.querySelector('#confirmpasswordInput');
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
						// add error msg to error box
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

var display = false;

function displayMsg() {
	console.log(display);
	if(display == false) {
		createErrMsg();
		display = true;
	}
}

function createErrMsg() {
	const div = document.createElement("div");
	const target = document.getElementById("parentDiv");
	const p4 = document.createElement("p");
	const p5 = document.createElement("p");
	const p1 = document.createElement("p");
	const p2 = document.createElement("p");
	const p3 = document.createElement("p");
	p4.setAttribute("id", "p4");
	p5.setAttribute("id", "p5");
	p1.setAttribute("id", "p1");
	p2.setAttribute("id", "p2");
	p3.setAttribute("id", "p3");
	p4.textContent = "Make sure all boxes are filled";
	p5.textContent = "Can't use special characters for first and last name";
	p1.textContent = "Password must have special character";
	p2.textContent = "Password must have at least 8 characters";
	p3.textContent = "Passwords must match";
	div.setAttribute("id", "errDiv");
	target.appendChild(div);
	div.appendChild(p4);
	div.appendChild(p5);
	div.appendChild(p1);
	div.appendChild(p2);
	div.appendChild(p3);
	checkInput();
}

function checkInput() {
	var nonempty;
	var sc1;
	var passLen;
	var passSc;
	var passMatch;

	// Validate Empty Fields
	if (firstnameInput.value == "" || lastnameInput.value == "" ||
		usernameInput.value == "" || passwordInput.value == "" ||
		confirmpasswordInput.value == "") {
		document.getElementById("p4").style.color = "red";
		nonempty = false;
	} else {
		document.getElementById("p4").style.color = "green";
		nonempty = true;
	}

	// Validate First or Last contain no special chars.
	if (checkSpecialCharacters(firstnameInput.value) || checkSpecialCharacters(lastnameInput.value)
		|| firstnameInput.value == "" || lastnameInput.value == "") {
		document.getElementById("p5").style.color = "red";
		sc1 = false;
	} else {
		document.getElementById("p5").style.color = "green";
		sc1 = true;
	}

	// Validate password strength
	if (checkPasswordStrength(passwordInput.value) != true) {
		document.getElementById("p2").style.color = "red";
		passLen = false;
	} else {
		document.getElementById("p2").style.color = "green";
		passLen = true;
	}

	if (checkSpecialCharacters(passwordInput.value) != true) {
		document.getElementById("p1").style.color = "red";
		passSc = false;
	} else {
		document.getElementById("p1").style.color = "green";
		passSc = true;
	}

	if (confirmpasswordInput.value != passwordInput.value || passwordInput.value == "") {
		document.getElementById("p3").style.color = "red";
		passMatch = false;
	} else {
		document.getElementById("p3").style.color = "green";
		passMatch = true;
	}

	if (nonempty && sc1 && passLen && passSc && passMatch) {
		//findUser();
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
