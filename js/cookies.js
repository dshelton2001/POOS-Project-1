function saveUserCookie(userId, firstName, lastName) {
    let user = { userId: userId, firstName: firstName, lastName: lastName };
    let date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);

    document.cookie = 'user=' + JSON.stringify(user) + '; expires=' + date.toGMTString();
}

function readUserCookie() {
    let user = null;

    try {
        let cookieText = document.cookie;
        let targetCookie = 'user=';
        let startIndex = cookieText.indexOf(targetCookie) + targetCookie.length;
        let userText = cookieText.substring(startIndex);
        user = JSON.parse(userText);
    } catch (err) {
        console.log('Failure reading user cookie. Error message: ' + err.message);
    }

    return user;
}
