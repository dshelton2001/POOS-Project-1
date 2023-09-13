// signup.html elements
const firstnameInput = document.querySelector('#firstnameInput');
const lastnameInput = document.querySelector('#lastnameInput');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const errMsg = document.querySelector('#errMsg');

// Constant Variables
const HttpStatus = { success : 200 };
const XhrReadyState = { done : 4 };
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

	let tmp = { fName: firstName, lName: lastName, userName: userName, pwd: hash};	
    let jsonPayload = JSON.stringify(tmp);

	let url = apiUrlBase + '/' + signupEndpoint;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
	
	try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
				let jsonObject = JSON.parse(xhr.responseText);
				saveUserCookie(jsonObject.id, jsonObject.firstName, jsonObject.lastName, jsonObject.userName, jsonObject.password);
                window.location.href = 'login.html';
            }
        };
		xhr.send(jsonPayload);
		} 
		catch (err) 
		{
			errMsg.innerHTML = err.message; 
		}
}

// Checks for duplicate username
function findUser () {
	let srch = usernameInput.value;

	let tmp = { userId:userId, search:srch};	
    let jsonPayload = JSON.stringify(tmp);

	let url = apiUrlBase + '/' + searchEndpoint;

	let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

	try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
                let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i = 0; i < jsonObject.results.length; i++ )
				{
					if (jsonObject.results[i].value == srch) 
					{
						errMsg.innerHTML = 'Invalid Username';
						return;
					}
				}
				doSignUp();
            }
        };
		xhr.send(jsonPayload);
		} 
		catch (err) 
		{
			errMsg.innerHTML = err.message; 
		}
}

function checkEmptyInput () {
	if(firstnameInput.value == "" || lastnameInput.value == "" ||
	   usernameInput.value == "" || passwordInput.value == "") 
	   {
		errMsg.innerHTML = 'Please fill all boxes';
		return;
	   }
	   doSignUp();
}
