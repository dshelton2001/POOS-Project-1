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

// User
let user = {};

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
    console.log('Not implemented');
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
                    console.log("Error with search query...");
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

    contacts.forEach( contact => {
        let phone = "(" + contact.Phone.substring(0, 3) + ")" + " " + contact.Phone.substring(3, 6) + "-" + contact.Phone.substring(6);
        let row = contactsTable.insertRow();
        row.insertCell(0).innerHTML = contact.FirstName;
        row.insertCell(1).innerHTML = contact.LastName;
        row.insertCell(2).innerHTML = `<a href="tel:${contact.Phone}">${phone}</a>`;
        row.insertCell(3).innerHTML = `<a href="mailto:${contact.Email}">${contact.Email}</a>`;
        // TODO Insert edit/delete buttons
        row.insertCell(4);
    });
}

function doUpdateContacts() {
    // TODO
    console.log('Not implemented');
}

function doDeleteContacts() {
    // TODO
    alert("Are you sure?");
    console.log('Not implemented');
}

function doLogOut() {
    user = {};
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = "index.html";
}

function doDeleteUser() {
    // TODO
    console.log('Not implemented');
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        doSearchContacts();
    }
});