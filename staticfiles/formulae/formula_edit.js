userId = sessionStorage.getItem('user_id');
csrftoken = getCookie('csrftoken');


function setupIngredientAutocomplete(text) {
    console.log('Setting up ingredient autocomplete')
    // Your autocomplete logic goes here
    text = text || '';
    var inputField = $('<input>').attr({
        'type': 'text',
        'id': 'ingredient-input',
        'value': text
    });

    // Create dropdown menu
    var dropdownMenu = $('<ul>').attr('id', 'ingredient-dropdown').addClass('dropdown-menu');

    // Append input field and dropdown menu to the container
    var container = $('<div>').attr('id', 'ingredient-autocomplete-container');
    container.empty().append(inputField, dropdownMenu);


    inputField.on('input', function() {
        console.log('Input field value:', $(this).val());
        var query = $(this).val();
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
            var item = $('<li>').addClass('dropdown-item').text(ingredient.common_name);
            // Add click event listener to menu item
            item.on('click', function() {
                inputField.val(ingredient.common_name); // Populate input field with selected value
                var row = $(item).closest('tr');
                var volatility = row.find('td:eq(2)')
                var amount = row.find('td:eq(3)')
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
        var message = $('<li>').addClass('dropdown-item').text('No matching ingredients found');
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

// LAUNCH EDIT MORE
$(document).ready(function() {
    $('#main-content').on('click', '.btn-edit-formula', function(e) {
        e.preventDefault();

        console.log('Edit button clicked');

        // Find the formula detail item
        var formulaDetailItem = $(this).closest('.formula-detail');

        // Find the table containing the formula details
        var formulaDetailTable = formulaDetailItem.find('.formula-detail-table');

        // Find the table containing the formula ingredients
        var formulaIngredientTable = formulaDetailItem.find('.formula-ingredient-table');

        // Make the formula details editable
        formulaDetailTable.find('.editable-detail-table').each(function () {
            var text = $(this).text().trim();
            $(this).html('<input type="text" value="' + text + '">');
        });

        // Make the formula ingredients editable, handle non-ingredient field (amount). adds the input field INSIDE THE TD
        formulaIngredientTable.find('.td-regular-input').each(function () {
            var text = $(this).text().trim();
            $(this).html('<input type="text" value="' + text + '">');
        });

        // handle the ingredient field
        formulaIngredientTable.find('.td-ingredient-input').each(function () {
            console.log('Ingredient:', $(this).text());
            var text = $(this).text().trim();
            // replace it with the input field
            $(this).html(setupIngredientAutocomplete(text));
            console.log('set up ingredient autocomplete field meow')
        });

        // Show the Save button and hide the Edit button


        addButton = $('<button>').addClass('btn btn-primary btn-add-ingredient').text('Add Ingredient');
        formulaIngredientTable.append(addButton);

        formulaDetailItem.find('.btn-save-formula').show();
        $(this).hide();
    });

    $('#main-content').on('click', '.btn-add-ingredient', function(e) {
        e.preventDefault();

        var formulaDetailItem = $(this).closest('.formula-detail');
        var formulaIngredientTable = formulaDetailItem.find('.formula-ingredient-table');
        var lastRow = formulaIngredientTable.find('tr:last');
        lastCounter = parseInt(lastRow.find('.td-counter-cell').text());
        var newCounter = lastCounter + 1;

        var newRow = $('<tr>').append(
            $('<td id="counter cell">').text(newCounter).addClass('td-counter-cell'),
            $('<td id="ingredient cell">').addClass("td-ingredient-input").append(setupIngredientAutocomplete('')),
            $('<td id ="volatility cell">').append($('<td>').addClass('td-volatility-cell')),
            $('<td id="amount cell">').addClass("td-regular-input").append($('<input>').attr('type', 'text')),
        );
        formulaIngredientTable.append(newRow);
    });

    // safe and sound
    $('#main-content').on('click', '.btn-save-formula', function(e) {
        e.preventDefault();

        // Find the formula detail item
        var formulaDetailItem = $(this).closest('.formula-detail');

        // Find the table containing the formula details
        var formulaDetailTable = formulaDetailItem.find('.formula-detail-table');

        // Find the table containing the formula ingredients
        var formulaIngredientTable = formulaDetailItem.find('.formula-ingredient-table');

        // Convert input fields back to text
        formulaDetailTable.find('input').each(function() {
            var value = $(this).val();
            $(this).parent().text(value);
        });

        // Convert input fields back to text
        formulaIngredientTable.find('.td-regular-input').each(function() {
            // Find the input element within the current .td-regular-input
            var inputField = $(this).find('input');
            console.log('Input field:', inputField)
            // Get the value of the input field
            var inputValue = inputField.val();
            console.log('Input value:', inputValue)
            // Set the value to the parent td element
            $(this).text(inputValue);
        });

        console.log('Changing #ingredient-input')
        formulaIngredientTable.find('.td-ingredient-input').each(function() {
            var parentElement = $(this);
            var inputField = parentElement.find('#ingredient-input');
            var inputValue = inputField.val();
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
    });
});
// Function to retrieve the CSRF token from the cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}