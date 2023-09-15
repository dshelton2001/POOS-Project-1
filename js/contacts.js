// contacts.html Elements
const welcomeTitle = document.querySelector('#welcome-text');
const searchInput = document.querySelector('#search-input');
const contactsTable = document.querySelector('#contacts-table-body');

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
    } else {
        welcomeTitle.innerHTML = 'Welcome, ' + user.firstName + '!';
    }
}

function doesUserExist(user) {
    if (user == null) {
        return false;
    }

    // TODO Further validate if user exists in DB
    return true;
}

function doAddContacts() {
    // TODO
    console.log('doAddContacts() Not implemented');
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
        row.insertCell(4).innerHTML = `<button class="fa fa-edit" onclick="doUpdateContacts(${i})"></button>
        <button class="fa fa-close" onclick="doDeleteContacts(${i})"></button>`;
    }
}

function doUpdateContacts() {
    // TODO
    console.log('doUpdateContacts() Not implemented');
}

function doDeleteContacts(rowIndex) {
    let contact = tableContacts[rowIndex];

    if (!confirm(`Are you sure you want to delete the contact for ${contact.FirstName} ${contact.LastName}?`)) {
        return;
    }

    let tmp = { contactUserID: contact.ID, uniqueID: user.userId };
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