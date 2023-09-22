// index.html Elements
const contactsLink = document.querySelector('#contacts-link');

setUp();

function setUp() {
    let user = readUserCookie();

    if (user != null) {
        contactsLink.classList.remove('disabled');
        contactsLink.setAttribute('href', 'contacts.html');
    } else {
        contactsLink.classList.add('disabled');
        contactsLink.removeAttribute('href');
    }
}