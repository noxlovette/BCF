// HANDLES ONLY THE DETAIL VIEW (VIEW BUTTON)
$(document).ready(function() {
    $('#sidebar').on('click', '.btn-formula', function(e) {
        e.preventDefault();

        // Remove existing formula detail items – IMPORTANT
        $('.formula-detail').remove();

        // Retrieve the formula ID from the dataset of the clicked button
        var formulaId = $(this).data('id');
        // Use the formula ID as needed (e.g., to display the corresponding formula)
        console.log('Clicked button view for formula ID:', formulaId);

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
                var formulaDetailTable = $('<table>').addClass('formula-detail-table');

                // Add rows for each section: name, description, time_edited
                var nameRow = $('<tr>').append($('<td>').text('Name:').addClass('td-detail-table'), $('<td class="editable-detail-table" id = "formula-name">').text(data.name));
                var descriptionRow = $('<tr>').append($('<td>').text('Description:').addClass('td-detail-table'), $('<td class="editable-detail-table", id = "formula-description">').text(data.description));
                var timeEditedRow = $('<tr>').append($('<td>').text('Time Edited:').addClass('td-detail-table'), $('<td>').text(data.updated_at));
                var editButton = $('<button>').addClass('btn btn-primary btn-edit-formula').text('Edit');
                editButton.data('id', data.id);
                var cancelButton = $('<button>').addClass('btn btn-primary btn-cancel-formula').text('Cancel');
                cancelButton.hide();
                var saveButton = $('<button>').addClass('btn btn-primary btn-save-formula').text('Save');
                saveButton.data('id', data.id);
                saveButton.hide();

                // Append rows to the detail table
                formulaDetailTable.append(nameRow, descriptionRow, timeEditedRow, editButton, saveButton, cancelButton);

                // Create a table for the formula ingredients
                var formulaIngredientTable = $('<table>').addClass('formula-ingredient-table');

                // Create header row for the ingredient table
                var ingredientHeaderRow = $('<tr>').append(
                    $('<th>').text('#').addClass('th-ingredient-table th-counter'),
                    $('<th>').text('Ingredient').addClass('th-ingredient-table th-ingredient'),
                    $('<th>').text('Volatility').addClass('th-ingredient-table th-volatility'),
                    $('<th>').text('Amount').addClass('th-ingredient-table th-amount')
                );

                // Append header row to the ingredient table
                formulaIngredientTable.append(ingredientHeaderRow);

                var counter = 1;

                // Iterate over each ingredient and create rows for them
                data.ingredients.forEach(function(ingredient) {
                    var ingredientRow = $('<tr>').append(
                        $('<td id="counter cell">').text(counter++).addClass('td-counter-cell'),
                        $('<td>').text(ingredient.ingredient)
                            .addClass("td-ingredient-input")
                            .attr('id', 'ingredient cell ' + ingredient.ingredient_id)
                            .data('id', ingredient.ingredient_id),
                        $('<td id="volatility cell">').text(ingredient.volatility).addClass('td-volatility-cell'),
                        $('<td id="amount cell">').text(ingredient.amount).addClass('td-regular-input'),
                    );

                    // Append ingredient row to the ingredient table. Give it the value of the formula_ingredient_id
                    ingredientRow.data('id', ingredient.formula_ingredient_id)
                    formulaIngredientTable.append(ingredientRow)
                    console.log('Ingredient row:', ingredientRow.data('id'))
                });

                // Append detail tables to the formula detail view div
                let tableWrapper = $('<div>').addClass('table-wrapper formulate');
                tableWrapper.append(formulaIngredientTable);
                formulaDetailItem.append(formulaDetailTable, tableWrapper);

                // Append formula detail view div to the desired container
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
