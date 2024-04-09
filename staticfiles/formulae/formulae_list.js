// HANDLES ONLY THE LIST VIEW

user_id = sessionStorage.getItem('user_id');
$(document).ready(function() {
    // Obtain the CSRF token from the cookie
    var csrftoken = getCookie('csrftoken');
    console.log('User ID:', user_id);

    // Make an AJAX request to fetch the list of formula instances
    $.ajax({
        url: 'api/formula/list/', // URL to your API endpoint
        method: 'GET',
        data: {
            user_id: user_id
        },
        headers: {
            'X-CSRFToken': csrftoken // Include the CSRF token in the headers
        },
        beforeSend: function(xhr, settings) {
            // Set the Accept header to receive JSON data
            console.log('Before sending request', settings.data);
        },
        success: function(data, textStatus, xhr) {
            // Log the received data and status
            console.log('Received data:', data);
            console.log('Status:', textStatus);
            console.log('Response headers:', xhr.getAllResponseHeaders());

            var formulaList = $('<ul id="formulae-list">');

            // Process the response data
            data.forEach(function(formula) {
                // Create HTML elements to represent the formula instance
                var formulaItem = $('<li>').addClass('formula-item');
                var nameLabel = $('<p id = "formula-name">').text('Name: ' + formula.name);
                var timeEditedLabel = $('<p id = "formula-edit-time">').text('Edited: ' + formula.updated_at);
                var viewButton = $('<button class= "btn btn-primary btn-formula" id = "view-formula">').text('View Formula');
                viewButton.data('id', formula.id);

                // Append the elements to the block
                formulaItem.append(nameLabel, timeEditedLabel, viewButton);
                formulaList.append(formulaItem);

            });
            $('#sidebar').append(formulaList); // fill out the block with the formula items
        },
        error: function(xhr, status, error) {
            // Log the error details
            console.error('Error fetching data:', error);
            console.log('Status:', status);
            console.log('Response headers:', xhr.getAllResponseHeaders());
        }
    });

});

// Function to retrieve the CSRF token from the cookie
function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                // Check if the cookie name matches the specified name
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }