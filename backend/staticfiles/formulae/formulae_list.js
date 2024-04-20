// HANDLES ONLY THE LIST VIEW
$(document).ready(function() {
    // Make an AJAX request to fetch the list of formula instances
    $.ajax({
        url: 'api/formula/list/', // URL to your API endpoint
        method: 'GET',
        data: {
            user_id: userId
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

            var formulaList = $('<ul id="formulate-list">');
            // Step 1: Create an array of emojis

            // Process the response data
            data.forEach(function(formula) {
                // Create HTML elements to represent the formula instance
                var formulaItem = $('<li>').addClass('formula-item');
                var nameLabel = $('<p id = "formula-name">').text('Name: ' + formula.name);
                var timeEditedLabel = $('<p id = "formula-edit-time">').text('Edited: ' + formula.updated);
                var viewButton = $('<button class= "btn btn-primary btn-formula" id = "view-formula">').text('View Formula');
                viewButton.data('id', formula.id);

                // Append the elements to the block
                formulaItem.append(nameLabel, timeEditedLabel, viewButton);
                formulaList.append(formulaItem);

            });
            let createFormulaButton = $('<button class="btn btn-primary create-formula" id="create-formula">').text('Create Formula');
            formulaList.append(createFormulaButton);

            $('#sidebar').append(formulaList, createFormulaButton); // fill out the block with the formula items
        },
        error: function(xhr, status, error) {
            // Log the error details
            console.error('Error fetching data:', error);
            console.log('Status:', status);
            console.log('Response headers:', xhr.getAllResponseHeaders());
        }
    });
    $('#sidebar').on('click', '#create-formula', function(e) {
        e.preventDefault();
        // Create an empty formula
        console.log('Creating a new formula')
        var formData = {
            name: 'New Formula',
            description: 'Write something inspiring here!',
            ingredients: [],
            user: userId,
        };

        $.ajax({
            url: "api/formula/new/",
            type: 'POST',
            data: JSON.stringify(formData),
            headers: {
                'X-CSRFToken': csrftoken
            },
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                // Redirect to the editing view for the new formula
                window.location.href = '/formulate/';
            }
        });
    });
});
