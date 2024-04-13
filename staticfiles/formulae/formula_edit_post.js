$(document).ready(function() {
    $('#main-content').on('click', '.btn-save-formula', function (e) {
        e.preventDefault();

        console.log('Save button clicked, post speaking');

        // Find the formula detail item
        var formulaDetailItem = $(this).closest('.formula-detail');

        // Find the table containing the formula details
        var formulaDetailTable = formulaDetailItem.find('.formula-detail-table');

        // Find the table containing the formula ingredients
        var formulaIngredientTable = formulaDetailItem.find('.formula-ingredient-table');

        var formula_name = formulaDetailTable.find('#formula-name').text().trim();
        console.log('Formula name when clicking:', formula_name);

        var formula_description = formulaDetailTable.find('#formula-description').text().trim();
        console.log('Formula description when clicking:', formula_description);
        var formula_id = $(this).data('id');
        var ingredients = [];
        var data = {
            'user': userId,
            'name': formula_name,
            'description': formula_description,
            'ingredients': []
        };

        formulaIngredientTable.find('tr').each(function (index, row) {
            if (index > 0) {
                var ingredientId = $(row).find('.td-ingredient-input').data('id'); // Use data() method instead of dataset()
                var amount = $(row).find('.td-regular-input').text().trim();
                data.ingredients.push({
                    'ingredient_id': ingredientId,
                    'amount': amount
                });
            }
        });

        // Call processIngredients function with necessary arguments
        sendDataToServer(formula_id, data);
    });
});

// Define sendDataToServer function
function sendDataToServer(formula_id, data) {
    console.log("data inside the senddatatoserver:", data)
    // Make AJAX call to send data to server
    $.ajax({
        url: 'api/formula/' + formula_id + '/',
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrftoken // Include the CSRF token in the headers
        },
        data: JSON.stringify(data), // Send ingredient data array as JSON
        success: function (response) {
            console.log('Data received successfully:', response);
        },
        error: function (xhr, status, error) {
            console.error('Error sending data to server:', error);
        }
    });
}
