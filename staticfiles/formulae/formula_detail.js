// HANDLES ONLY THE DETAIL VIEW (VIEW BUTTON)
$(document).ready(function() {
    $('#sidebar').on('click', '.btn-formula', function(e) {
        e.preventDefault();
        // Retrieve the formula ID from the dataset of the clicked button
        var formulaId = $(this).data('id');
        // Use the formula ID as needed (e.g., to display the corresponding formula)
        console.log('Clicked button for formula ID:', formulaId);

        var csrftoken = getCookie('csrftoken');

        $.ajax({
        url: 'api/formula/' + formulaId + '/', // make sure the URL is correct...
        method: 'GET',
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

            // Process the response data
            var formulaDetailItem = $('<div>').addClass('formula-detail');

            // Create a table for the formula details
            var formulaDetailTable = $('<table>').addClass('table');

            // Add rows for each section: name, description, time_edited
            var nameRow = $('<tr>').append($('<td>').text('Name:'), $('<td>').text(data.name));
            var descriptionRow = $('<tr>').append($('<td>').text('Description:'), $('<td>').text(data.description));
            var timeEditedRow = $('<tr>').append($('<td>').text('Time Edited:'), $('<td>').text(data.updated_at));

            // Append rows to the detail table
            formulaDetailTable.append(nameRow, descriptionRow, timeEditedRow);

            // Create a table for the formula ingredients
            var formulaIngredientTable = $('<table>').addClass('table');

            // Create header row for the ingredient table
            var ingredientHeaderRow = $('<tr>').append(
                $('<th>').text('#'),
                $('<th>').text('Ingredient'),
                $('<th>').text('Volatility'),
                $('<th>').text('Amount'),
                $('<th>').text('Unit')
            );

            // Append header row to the ingredient table
            formulaIngredientTable.append(ingredientHeaderRow);

            var counter = 1;

            // Iterate over each ingredient and create rows for them
            data.ingredients.forEach(function(ingredient) {
                var ingredientRow = $('<tr>').append(
                    $('<td>').text(counter++),
                    $('<td>').text(ingredient.name),
                    $('<td>').text(ingredient.volatility),
                    $('<td>').text(ingredient.amount),
                    $('<td>').text(ingredient.unit)
                );

                // Append ingredient row to the ingredient table
                formulaIngredientTable.append(ingredientRow);
            });

            // Append detail tables to the formula detail view div
            formulaDetailItem.append(formulaDetailTable, formulaIngredientTable);

        // Append formula detail view div to the sidebar or any desired container
            $('#main-content').append(formulaDetailItem);
        },
        error: function(xhr, status, error) {
            // Log the error details
            console.error('Error fetching data:', error);
            console.log('Status:', status);
            console.log('Response headers:', xhr.getAllResponseHeaders());
        }
    });
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