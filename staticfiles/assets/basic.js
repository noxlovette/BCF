window.addEventListener('DOMContentLoaded', (event) => {
    // Get the navbar buttons
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    // Get the user's login status and nickname from session storage
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const nickname = sessionStorage.getItem('nickname');

    if (isLoggedIn) {
        // If the user is logged in, display "Hello, [user's nickname]" and hide the log in and sign up buttons
        const greeting = document.createElement('span');
        greeting.textContent = `Hello, ${nickname}`;
        navbar.appendChild(greeting);
        loginButton.style.display = 'none';
        signupButton.style.display = 'none';
    } else {
        // If the user is not logged in, display the log in and sign up buttons
        loginButton.style.display = 'block';
        signupButton.style.display = 'block';
    }
});