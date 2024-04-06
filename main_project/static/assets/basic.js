function updateNavbar() {
    // Get the navbar buttons
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    // Get the user's login status and nickname from session storage
    const is_authenticated = sessionStorage.getItem('is_authenticated');
    const username = sessionStorage.getItem('username');

    if (is_authenticated) {
        // If the user is logged in, display "Hello, [user's nickname]" and hide the log in and sign up buttons
        const greeting = document.createElement('span');
        greeting.textContent = `Hello, ${username}`;
        navbar.appendChild(greeting);
        loginButton.style.display = 'none';
        signupButton.style.display = 'none';
    } else {
        // If the user is not logged in, display the log in and sign up buttons
        loginButton.style.display = 'block';
        signupButton.style.display = 'block';
    }
}

updateNavbar();