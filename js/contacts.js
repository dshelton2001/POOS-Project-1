// contacts.html Elements
const welcomeTitle = document.querySelector('#welcome-text');
const searchInput = document.querySelector('#search-input');
const contactsTable = document.querySelector('#contacts-table-body');

const contactInfo = document.querySelector('#contact-info');
const firstNameInput = document.querySelector('#fname-input');
const lastNameInput = document.querySelector('#lname-input');
const phoneInput = document.querySelector('#phone-input');
const emailInput = document.querySelector('#email-input');
const submitButton = document.querySelector('#submit-button');

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

populateFakeContactsTable(100);

function setUp() {
    user = readUserCookie();

    if (!doesUserExist(user)) {
        window.location.href = 'login.html';
    } else {
        // welcomeTitle.innerHTML = 'Welcome, ' + user.firstName + '!';
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

function openAddContacts() {
    contactInfo.removeAttribute('hidden');
    firstNameInput.value = '';
    lastNameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    submitButton.innerHTML = 'Create';
    submitButton.setAttribute('onclick', 'doAddContacts()');
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
                
                contactInfo.setAttribute("hidden", "");
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
        row.insertCell(4).innerHTML = `<button type="submit" class="btn btn-outline-light mb-2" onclick="openUpdateContacts(${i})"><i class="fa-solid fa-pen-to-square fa-sm"></i> Edit</button>
        <button type="submit" class="btn btn-outline-danger mb-2" onclick="doDeleteContacts(${i})"><i class="fa-solid fa-trash fa-sm"></i> Delete</button>`;
    }
}

function openUpdateContacts(rowIndex) {
    let contact = tableContacts[rowIndex];
    let row = contactsTable.rows[rowIndex + 1];

    row.cells[0].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.FirstName}" autocomplete="off">`;
    row.cells[1].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.LastName}" autocomplete="off">`;
    row.cells[2].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.Phone}" autocomplete="off">`;
    row.cells[3].innerHTML = `<input type="text" class="form-control bg-dark text-white" value="${contact.Email}" autocomplete="off">`;
    row.cells[4].innerHTML = `<button type="submit" class="btn btn-outline-success mb-2" onclick="doUpdateContacts(${rowIndex})"><i class="fa-solid fa-check fa-sm"></i> Save</button>
    <button type="submit" class="btn btn-outline-danger mb-2" onclick="cancelUpdateContacts(${rowIndex})"><i class="fa-solid fa-x fa-sm"></i> Cancel</button>`;
}

function cancelUpdateContacts(rowIndex) {
    let row = contactsTable.rows[rowIndex + 1];
    let contact = tableContacts[rowIndex];
    let phone = "(" + contact.Phone.substring(0, 3) + ")" + " " + contact.Phone.substring(3, 6) + "-" + contact.Phone.substring(6);

    row.cells[0].innerHTML = contact.FirstName;
    row.cells[1].innerHTML = contact.LastName;
    row.cells[2].innerHTML = `<a href="tel:${contact.Phone}">${phone}</a>`;
    row.cells[3].innerHTML = `<a href="mailto:${contact.Email}">${contact.Email}</a>`;
    row.cells[4].innerHTML = `<button type="submit" class="btn btn-outline-light mb-2" onclick="openUpdateContacts(${rowIndex})"><i class="fa-solid fa-pen-to-square fa-sm"></i> Edit</button>
    <button type="submit" class="btn btn-outline-danger mb-2" onclick="doDeleteContacts(${rowIndex})"><i class="fa-solid fa-trash fa-sm"></i> Delete</button>`;
}

function doUpdateContacts(rowIndex) {
    let row = contactsTable.rows[rowIndex + 1];
    let contact = tableContacts[rowIndex];

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
    window.location.href = "index.html";
}

function doDeleteUser() {
    if (!confirm("Are you sure you want to delete your account?")) {
        return;
    }

    // TODO
    console.log('doDeleteUser() Not implemented');
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        doSearchContacts();
    }
});

contactInfo.addEventListener('click', (e) =>  {
    if (e.target.id == 'contact-info') {
        contactInfo.setAttribute('hidden', '');
    }
});