// contacts.html Elements
const welcomeTitle = document.querySelector('#welcome-text');
const searchInput = document.querySelector('#search-input');
const contactsTable = document.querySelector('#contacts-table-body');

const contactInfo = document.querySelector('#contact-info');
const firstNameInput = document.querySelector('#fname-input');
const lastNameInput = document.querySelector('#lname-input');
const phoneInput = document.querySelector('#phone-input');
const emailInput = document.querySelector('#email-input');
const addSuccessMsg = document.querySelector('#add-success');

// Constant Variables
const HttpStatus = { success: 200 };
const XhrReadyState = { done: 4 };
const apiUrlBase = 'http://cop433112.com/LAMPAPI';

// Backend Endpoints
const deleteUserEndpoint = 'DeleteUser.php';
const addContactsEndpoint = 'AddContacts.php';
const searchContactsEndpoint = 'SearchContacts.php';
const updateContactsEndpoint = 'UpdateContacts.php';
const deleteContactsEndpoint = 'DeleteContacts.php';

// Data
let user = {};
let tableContacts = [];

setUp();

function setUp() {
    user = readUserCookie();

    if (!doesUserExist(user)) {
        window.location.href = 'login.html';
    }
}

//! Internal/Testing use only. Be careful.
function populateFakeContactsTable(num) {
    let fakeContacts = [];

    for (let i = 0; i < num; i++) {
        fakeContacts.push({
            "FirstName": `Fake${i}`,
            "LastName": "Human",
            "Phone": "1231231234",
            "Email": `test${i}@update${i}.com`,
            "ID": `${i}`
        });
    }

    populateContactsTable(fakeContacts);
}

function doesUserExist(user) {
    if (user == null) {
        return false;
    }

    // TODO Further validate if user exists in DB
    return true;
}

function clearAddContactModal() {
    firstNameInput.value = '';
    firstNameInput.classList.remove('is-invalid');

    lastNameInput.value = '';
    lastNameInput.classList.remove('is-invalid');

    phoneInput.value = '';
    phoneInput.classList.remove('is-invalid');

    emailInput.value = '';
    emailInput.classList.remove('is-invalid');

    addSuccessMsg.setAttribute('hidden', '');
}

function doAddContacts() {
    let tmp = {
        fName : firstNameInput.value,
        lName : lastNameInput.value,
        phoneNum : phoneInput.value,
        emailAdd : emailInput.value,
        userID : user.userId
    };

    let jsonPayload = JSON.stringify(tmp);

    if (hasInvalidData(firstNameInput, lastNameInput, phoneInput, emailInput)) {
        return;
    }

    let url = apiUrlBase + '/' + addContactsEndpoint;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error.length > 0 ) {
                    console.log("Error when creating contact...");
                    return;
                }

                addSuccessMsg.removeAttribute('hidden');
                setTimeout(function () {addSuccessMsg.setAttribute('hidden', '')}, 3000);
                doSearchContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: " + err);
    }
}

function doSearchContacts() {
    let tmp = { search: searchInput.value, userId: user.userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = apiUrlBase + '/' + searchContactsEndpoint;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (!jsonObject.hasOwnProperty("results")) {
                    contactsTable.innerHTML = `<tr></tr>`;
                    tableContacts = [];
                    return;
                }

                populateContactsTable(jsonObject["results"]);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: " + err);
    }
}

//validate contact input
function checkInput () {

    let tmp = {
        fName : firstNameInput.value,
        lName : lastNameInput.value,
        phoneNum : phoneInput.value,
        emailAdd : emailInput.value,
        userID : user.userId
    };

	// Validate Empty Fields
	if(tmp.fName == "" || tmp.lName == "" || tmp.phoneNum == "") 
	   {
		console.log('Please add all the proper contact information');
		return;
	   }

	// Validate First or Last contain no special chars.
	if (checkSpecialCharacters(tmp.fName) || checkSpecialCharacters(tmp.lName))
	{
		console.log('You are not allowed to use special characters in a first or last name.');
		return;
	}

    if(checkSpecialCharacters(tmp.phoneNum)){
        console.log('You are not allowed to use special characters in a phone number.');
		return;
    }

    if(tmp.phoneNum.length != 10){
        console.log('Please enter a valid phone number.');
		return;
    }

}

function populateContactsTable(contacts) {
    contactsTable.innerHTML = `<tr></tr>`;
    tableContacts = contacts;

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let phone = "(" + contact.Phone.substring(0, 3) + ")" + " " + contact.Phone.substring(3, 6) + "-" + contact.Phone.substring(6);
        let row = contactsTable.insertRow();
        row.insertCell(0).innerHTML = contact.FirstName;
        row.insertCell(1).innerHTML = contact.LastName;
        row.insertCell(2).innerHTML = `<a href="tel:${contact.Phone}">${phone}</a>`;
        row.insertCell(3).innerHTML = `<a href="mailto:${contact.Email}">${contact.Email}</a>`;
        row.insertCell(4).innerHTML = `<button type="submit" class="btn btn-outline-light mb-2" onclick="openUpdateContacts(${i})"><i class="fa-solid fa-pen-to-square fa-sm"></i></button>
        <button type="submit" class="btn btn-outline-danger mb-2" onclick="doDeleteContacts(${i})"><i class="fa-solid fa-trash fa-sm"></i></button>`;
    }
}

function openUpdateContacts(rowIndex) {
    let contact = tableContacts[rowIndex];
    let row = contactsTable.rows[rowIndex + 1];

    row.cells[0].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.FirstName}" autocomplete="off"><div class="invalid-feedback">First name cannot be empty.</div>`;
    row.cells[1].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.LastName}" autocomplete="off"><div class="invalid-feedback">Last name cannot be empty.</div>`;
    row.cells[2].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.Phone}" autocomplete="off"><div class="invalid-feedback">Invalid phone number.</div>`;
    row.cells[3].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.Email}" autocomplete="off"><div class="invalid-feedback">Invalid email address.</div>`;
    row.cells[4].innerHTML = `<button type="submit" class="btn btn-outline-success mb-2" onclick="doUpdateContacts(${rowIndex})"><i class="fa-solid fa-check fa-sm"></i></button>
    <button type="submit" class="btn btn-outline-danger mb-2" onclick="cancelUpdateContacts(${rowIndex})"><i class="fa-solid fa-x fa-sm"></i></button>`;
}

function cancelUpdateContacts(rowIndex) {
    let row = contactsTable.rows[rowIndex + 1];
    let contact = tableContacts[rowIndex];
    let phone = "(" + contact.Phone.substring(0, 3) + ")" + " " + contact.Phone.substring(3, 6) + "-" + contact.Phone.substring(6);

    row.cells[0].innerHTML = contact.FirstName;
    row.cells[1].innerHTML = contact.LastName;
    row.cells[2].innerHTML = `<a href="tel:${contact.Phone}">${phone}</a>`;
    row.cells[3].innerHTML = `<a href="mailto:${contact.Email}">${contact.Email}</a>`;
    row.cells[4].innerHTML = `<button type="submit" class="btn btn-outline-light mb-2" onclick="openUpdateContacts(${rowIndex})"><i class="fa-solid fa-pen-to-square fa-sm"></i></button>
    <button type="submit" class="btn btn-outline-danger mb-2" onclick="doDeleteContacts(${rowIndex})"><i class="fa-solid fa-trash fa-sm"></i></button>`;
}

function doUpdateContacts(rowIndex) {
    let row = contactsTable.rows[rowIndex + 1];
    let contact = tableContacts[rowIndex];

    let firstName = row.cells[0].firstChild;
    let lastName = row.cells[1].firstChild;
    let phone = row.cells[2].firstChild;
    let email = row.cells[3].firstChild;

    if (hasInvalidData(firstName, lastName, phone, email)) {
        return;
    }

    let tmp = {
        updatedFirst : row.cells[0].firstChild.value,
        updatedLast : row.cells[1].firstChild.value,
        updatedPhone : row.cells[2].firstChild.value,
        updatedEmail : row.cells[3].firstChild.value,
        Id : contact.ID
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = apiUrlBase + '/' + updateContactsEndpoint;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error.length > 0 ) {
                    console.log("Error when creating contact...");
                    return;
                }
                
                contact.FirstName = tmp.updatedFirst;
                contact.LastName = tmp.updatedLast;
                contact.Phone = tmp.updatedPhone;
                contact.Email = tmp.updatedEmail;
                tableContacts[rowIndex] = contact;
                populateContactsTable(tableContacts);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: " + err);
    }
}

function hasInvalidData(firstNameInput, lastNameInput, phoneInput, emailInput) {
    let isInvalid = false;

    if (firstNameInput.value.length == 0) {
        isInvalid = true;
        firstNameInput.classList.add('is-invalid');
    } else {
        firstNameInput.classList.remove('is-invalid');
    }

    if (lastNameInput.value.length == 0) {
        isInvalid = true;
        lastNameInput.classList.add('is-invalid');
    } else {
        lastNameInput.classList.remove('is-invalid');
    }

    let phoneAsNumber = Number(phoneInput.value);
    if (phoneInput.value.length != 10 || !Number.isInteger(phoneAsNumber) || phoneAsNumber < 0) {
        isInvalid = true;
        phoneInput.classList.add('is-invalid');
    } else {
        phoneInput.classList.remove('is-invalid');
    }

    if (emailInput.value.length > 0 && !validateEmail(emailInput.value)) {
        isInvalid = true;
        emailInput.classList.add('is-invalid');
    } else {
        emailInput.classList.remove('is-invalid');
    }

    return isInvalid;
}

function doDeleteContacts(rowIndex) {
    let contact = tableContacts[rowIndex];

    if (!confirm(`Are you sure you want to delete the contact for ${contact.FirstName} ${contact.LastName}?`)) {
        return;
    }

    let tmp = { uniqueID: contact.ID, contactUserID: user.userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = apiUrlBase + '/' + deleteContactsEndpoint;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error.length > 0 ) {
                    console.log("Error when deleting contact...");
                    return;
                }

                tableContacts.splice(rowIndex, 1);
                populateContactsTable(tableContacts);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: " + err);
    }
}

function doLogOut() {
    user = {};
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = "login.html";
}

function doDeleteUser() {
    if (!confirm("Are you sure you want to delete your account? All contact data will also be lost.")) {
        return;
    }

    let tmp = { userID : user.userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = apiUrlBase + '/' + deleteUserEndpoint;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == XhrReadyState.done && this.status == HttpStatus.success) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error.length > 0 ) {
                    console.log("Error when deleting user...");
                    return;
                }

                doLogOut();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: " + err);
    }
}

function checkSpecialCharacters(str) {
	const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?~]/;
	return specialChars.test(str);
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        doSearchContacts();
    }
});
