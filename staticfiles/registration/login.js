document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.text();  // Change this line
    })
    .then(text => {
        console.log('Response text:', text);  // Log the response text
        return JSON.parse(text);  // Parse the response text as JSON
    })
    .then(response => {
        // The rest of your code...
    })
    .catch(error => {
        console.error('Failed to log in:', error);
    });
});

// Do the same for the other fetch request
fetch('/collection/api/collection')
    .then(response => response.text())  // Change this line
    .then(text => {
        console.log('Response text:', text);  // Log the response text
        return JSON.parse(text);  // Parse the response text as JSON
    })
    .then(data => {
        // The rest of your code...
    })
    .catch(error => {
        console.error('Failed to fetch collection:', error);
    });

// Function to get a cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}