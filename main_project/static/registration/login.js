document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();

    const username = document.getElementById('username-field').value;
    const password = document.getElementById('password-field').value;
    let csrftoken = getCookie('csrftoken');

    fetch('/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Server responded with an error:', data.error);
        } else {
            console.log('User ID:', data.user_id);
            console.log('Username:', data.username);
            console.log('Is authenticated:', data.is_authenticated);

            // Store user data in session storage
            // TODO add 'remember' functionaliy?
            sessionStorage.setItem('user_id', data.user_id);
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('is_authenticated', data.is_authenticated);

            // collection fetch request
            fetch('/collection/api/full_collection')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Collection:', data);
                    sessionStorage.setItem('collection', JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Failed to fetch collection:', error);
                });
            window.location.href = '/collection/';
        }
    })

    .catch(error => {
        console.error('Failed to fetch:', error);
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
