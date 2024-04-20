function setupIngredientAutocomplete(text) {
    console.log('Setting up ingredient autocomplete')
    // Your autocomplete logic goes here
    text = text || '';
    let inputField = $('<input>').attr({
        'type': 'text',
        'id': 'ingredient-input',
        'value': text
    });

    // Create dropdown menu
    let dropdownMenu = $('<ul>').attr('id', 'ingredient-dropdown').addClass('dropdown-menu');

    // Append input field and dropdown menu to the container
    let container = $('<div>').attr('id', 'ingredient-autocomplete-container');
    container.empty().append(inputField, dropdownMenu);


    // Add event listener to input field
    inputField.on('input', function() {
        console.log('Input field value:', $(this).val());
        let query = $(this).val();
        // Send AJAX request to server to retrieve matching ingredients
        // Populate dropdown menu with matching ingredients
        $.ajax({
            url: '/collection/api/collection/' + userId + '/?search=' + query,
            method: 'GET',
            headers: {
                'X-CSRFToken': csrftoken // Include the CSRF token in the headers
            },
            success: function(data) {

    // Populate dropdown menu with matching ingredients
    dropdownMenu.empty();
    if (data.length > 0) {
        data.forEach(function(ingredient) {
            let item = $('<li>').addClass('dropdown-item').text(ingredient.common_name);
            // Add click event listener to menu item
            item.on('click', function() {
                inputField.val(ingredient.common_name); // Populate input field with selected value
                let row = $(item).closest('tr');
                let volatility = row.find('td:eq(2)')
                let amount = row.find('td:eq(3)')
                volatility.text(ingredient.volatility)
                amount.data('id', ingredient.id)
                console.log('Amount ID:', amount.data('id'))
                let parentElement = inputField.parent();
                let tdIngredientInput = parentElement.closest('tr').find('.td-ingredient-input');
                tdIngredientInput.data('id', ingredient.id);
                console.log('Ingredient ID:', tdIngredientInput.data('id'))

                dropdownMenu.removeClass('active'); // Hide dropdown menu
            });
            dropdownMenu.append(item);
        });
        // Add 'active' class to show the dropdown menu
        dropdownMenu.addClass('active');
    } else {
        // If no matching ingredients found, display a message
        let message = $('<li>').addClass('dropdown-item').text('No matching ingredients found');
        dropdownMenu.append(message);
        // Add 'active' class to show the dropdown menu
        dropdownMenu.addClass('active');
    }
},
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    });
    return container;
}

// LAUNCH EDIT MODE
$(document).ready(function() {

    $('#main-content').on('click', '.btn-edit-formula', function(e) {
        e.preventDefault();

        console.log('Edit button clicked');

        let initialFormState = $('.formula-detail').clone();
        $('#main-content').on('click', '.btn-cancel-formula', function(e) {
        e.preventDefault();

        // Replace the current form with the initial state
        $('.formula-detail').replaceWith(initialFormState);
    });

        // Find the formula detail item
        let formulaDetailItem = $(this).closest('.formula-detail');

        // Find the table containing the formula details
        let formulaDetailTable = formulaDetailItem.find('.formula-detail-table');

        // Find the table containing the formula ingredients
        let formulaIngredientTable = formulaDetailItem.find('.formula-ingredient-table');

        // Make the formula details editable
        formulaDetailTable.find('.editable-detail-table').each(function () {
            let text = $(this).text().trim();
            $(this).html('<input type="text" value="' + text + '">');
        });

        // Make the formula ingredients editable, handle non-ingredient field (amount). adds the input field INSIDE THE TD
        formulaIngredientTable.find('.td-regular-input').each(function () {
            let text = $(this).text().trim();
            $(this).html('<input type="text" value="' + text + '">');
        });

        // handle the ingredient field
        formulaIngredientTable.find('.td-ingredient-input').each(function () {
            console.log('Ingredient:', $(this).text());
            let text = $(this).text().trim();
            // replace it with the input field
            $(this).html(setupIngredientAutocomplete(text));
            console.log('set up ingredient autocomplete field meow')
        });

        // Show the Save button and create deleteButton and hide the Edit button
        let deleteButton = $('<button>').addClass('btn btn-danger btn-delete-ingredient').text('Delete');
        formulaIngredientTable.find('tr:not(:first)').each(function () {
            let row = $(this);
            let deleteButtonClone = deleteButton.clone(); // clone the button to avoid sharing the same button instance
            row.append(deleteButtonClone);
        });

        let addButton = $('<button>').addClass('btn btn-primary btn-add-ingredient').text('Add Ingredient');

        formulaIngredientTable.append(addButton);

        formulaDetailItem.find('.btn-save-formula').show();
        formulaDetailItem.find('.btn-cancel-formula').show();
        $(this).hide();
    });

    // add ingredient functionality
    $('#main-content').on('click', '.btn-add-ingredient', function(e) {
        e.preventDefault();

        let formulaDetailItem = $(this).closest('.formula-detail');
        let formulaIngredientTable = formulaDetailItem.find('.formula-ingredient-table');
        let lastRow = formulaIngredientTable.find('tr:last');
        let lastCounter = parseInt(lastRow.find('.td-counter-cell').text());
        if (isNaN(lastCounter)) {
            lastCounter = 0;
        }

        let newCounter = lastCounter + 1;

        let newRow = $('<tr>').append(
            $('<td id="counter cell">').text(newCounter).addClass('td-counter-cell'),
            $('<td id="ingredient cell">').addClass("td-ingredient-input").append(setupIngredientAutocomplete('')),
            $('<td id ="volatility cell">').append($('<td>').addClass('td-volatility-cell')),
            $('<td id="amount cell">').addClass("td-regular-input").append($('<input>').attr('type', 'text')),
        );
        formulaIngredientTable.append(newRow);
    });

    // delete ingredient functionality
    $('#main-content').on('click', '.btn-delete-ingredient', function (e) {
        e.preventDefault();

        console.log('Delete button clicked');
        let row = $(this).closest('tr');
        let ingredient_to_delete = row.data('id');
        console.log('Ingredient to delete:', ingredient_to_delete);

        // Make AJAX call to delete ingredient
        $.ajax({
            url: 'api/ingredient/delete/' + ingredient_to_delete + '/',
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function (response) {
                console.log('Ingredient deleted successfully:', response);
                row.remove();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting ingredient:', error);
                console.log('Status:', status);
                console.log('Response headers:', xhr.getAllResponseHeaders());
            }
        });

    });

    // save ingredient functionality
    $('#main-content').on('click', '.btn-save-formula', function(e) {
        e.preventDefault();

        // Find the formula detail item
        let formulaDetailItem = $(this).closest('.formula-detail');

        // Find the table containing the formula details
        let formulaDetailTable = formulaDetailItem.find('.formula-detail-table');

        // Find the table containing the formula ingredients
        let formulaIngredientTable = formulaDetailItem.find('.formula-ingredient-table');

        // Convert input fields back to text
        formulaDetailTable.find('input').each(function() {
            let value = $(this).val();
            $(this).parent().text(value);
        });

        // Convert input fields back to text
        formulaIngredientTable.find('.td-regular-input').each(function() {
            // Find the input element within the current .td-regular-input
            let inputField = $(this).find('input');
            console.log('Input field:', inputField)
            // Get the value of the input field
            let inputValue = inputField.val();
            console.log('Input value:', inputValue)
            // Set the value to the parent td element
            $(this).text(inputValue);
        });

        console.log('Changing #ingredient-input')
        formulaIngredientTable.find('.td-ingredient-input').each(function() {
            let parentElement = $(this);
            let inputField = parentElement.find('#ingredient-input');
            let inputValue = inputField.val();
            parentElement
                .text(inputValue)
                .attr('id', 'ingredient cell ' + parentElement.data('id'));
            parentElement.find('#ingredient-autocomplete-container').remove();
});

        console.log('Removed container')

        $('.btn-add-ingredient').remove();

        // Hide the Save button and show the Edit button
        formulaDetailItem.find('.btn-edit-formula').show();
        $(this).hide();
        formulaIngredientTable.find('.btn-delete-ingredient').each(function() {
            $(this).remove();
        });
        formulaDetailItem.find('.btn-cancel-formula').hide();
    });

});
