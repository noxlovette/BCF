function createButton(textContent, className, eventListener, id) {
    const button = document.createElement('button');
    button.textContent = textContent;
    button.className = `btn btn-primary ${className}`;
    button.addEventListener('click', eventListener);
    button.dataset.id = id;
    return button;
}
function deleteCollectionIngredient(collectionIngredientId, userId) {
    $.ajax({
        url: `/collection/api/ingredient/${userId}/${collectionIngredientId}`,
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json',
        },
        success: function(response) {
            fetchIngredients();
        },
        error: function(error) {
            console.error('Error deleting ingredient:', error);
        }
    });
}

function deleteCustomCollectionIngredient(customCollectionIngredientId, userId) {
    console.log('Deleting custom collect ingredient:', customCollectionIngredientId);
    $.ajax({
        url: `/collection/api/ingredient/${userId}/custom/${customCollectionIngredientId}`,
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json',
        },
        success: function(response) {
            fetchIngredients();
        },
        error: function(error) {
            console.error('Error deleting ingredient:', error);
        }
    });
}

function editCustomCollectionIngredient(event, id) {
    console.log('Editing custom collect ingredient:', id);
    const row = event.target.parentNode.parentNode;
    const cells = row.querySelectorAll('td.editable-custom, td.editable');
    cells.forEach((cell, index) => {
        const cellText = cell.textContent;
        if (index !== cells.length - 1) { // Exclude the last cell (the one with the buttons)

            cell.innerHTML = `<input class="collection-input" type="text" value="${cellText}">`;
        }
    });

}

function editCollectionIngredient(event, id) {
    const row = event.target.parentNode.parentNode;
    row.dataset.id = id;
    console.log('row id after assignment, edit button', row.dataset.id)
    const cells = row.querySelectorAll('td.editable');
    cells.forEach((cell, index) => {
        const cellText = cell.textContent;
        const cellId = cell.id;
        cell.innerHTML = `<input class="collection-input" type="text" value="${cellText}">`;
        cell.id = `${cellId}-input`;
    });

    console.log('row id when edit button has been clicked', row.dataset.id)

    const saveButton = createButton('Save', 'save', saveIngredient, id);
    const cancelButton = createButton('Cancel', 'cancel', fetchIngredients);

    const buttonCell = row.querySelector('.editing');
    buttonCell.appendChild(saveButton);
    buttonCell.appendChild(cancelButton);
}

//redefine to handle the two types of ingredients
function saveIngredient(event) {
    console.log('Saving ingredient...')
    const id = event.target.dataset.id;
    console.log('id when save button has been clicked', id)
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const inputs = row.querySelectorAll('input.collect-input');
    const data = {};

    inputs.forEach((input) => {
        const key = input.id.split('-')[0]; // Get the key from the input's id by removing '-input'
        data[key] = input.type === 'checkbox' ? input.checked : input.value;
    });

    $.ajax({
        url: `/collection/api/ingredient/${userId}/${id}/`,
        method: 'PUT',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            fetchIngredients();
        },
        error: function(error) {
            console.error('Error saving ingredient:', error);
        }
    });
}

function fetchIngredients() {
    console.log('Fetching ingredients...')
    $.ajax({
        url: `api/collection/${userId}/`,
        method: 'GET',
        success: function(data) {
            let ingredients = Array.isArray(data) ? data : [data];
            const tableBody = $('#collect-table tbody');
            tableBody.empty(); // Clear previous data

            ingredients.forEach(collection_ingredient => {
                let ingredient = collection_ingredient.ingredient ? collection_ingredient.ingredient : {};

                // Construct the row HTML
                const rowHtml = `
                    <tr>
                        <td id = "common_name" class="nm-col editable-custom">${collection_ingredient.common_name || 'name unknown'}</td>
                        <td id = "cas" class="cas-col editable-custom">${collection_ingredient.cas || 'cas unknown'}</td>
                        <td id = "volatility" class="vol-col editable-custom">${collection_ingredient.volatility || 'no volatility specified'}</td>
                        <td id = "use" class="use-col editable-custom">${collection_ingredient.use || 'use not specified'}</td>
                        <td id = "colour" class="col-col editable">${collection_ingredient.colour || 'no colour specified'}</td>
                        <td id = "impression" class="impt-col editable">${collection_ingredient.impression || 'no impression specified yet'}</td>
                        <td id = "date_added" class="date-col">${collection_ingredient.date_added || 'date unknown'}</td>
                        <td id = "is_collection" class="is_col-col editable">${collection_ingredient.is_collection || ''} </td>
                        <td id = "amount" class="amount-col editable">${collection_ingredient.amount || '0'} ${collection_ingredient.unit}</td>
                        <td class="editing">
                            <button class="btn btn-primary delete" title="Delete ingredient">Delete</button>
                            <button class="btn btn-primary edit" title="Edit ingredient">Edit</button>
                        </td>
                    </tr>
                `;

                // Append the row to the table
                let row = $(rowHtml).appendTo(tableBody);
                row.data('id', collection_ingredient.id);
                console.log('Row data:', row.data('id'));

                let deleteIngredientButton = row.find('.delete');
                deleteIngredientButton.data('type', collection_ingredient.type);
                deleteIngredientButton.data('id', collection_ingredient.id)
                deleteIngredientButton.on('click', function() {
                    let type = $(this).data('type');
                    let id = $(this).data('id');
                    if (type === 'CollectionIngredient') {
                        deleteCollectionIngredient(id, userId);
                    } else if (type === 'CustomCollectionIngredient') {
                        deleteCustomCollectionIngredient(id, userId);
                    }
                });

                let editIngredientButton = row.find('.edit');
                editIngredientButton.data('type', collection_ingredient.type);
                editIngredientButton.data('id', collection_ingredient.id);
                editIngredientButton.on('click', function(event) {
                    let type = $(this).data('type');
                    if (type === 'CollectionIngredient') {
                        editCollectionIngredient(event, collection_ingredient.id);
                    } else if (type === 'CustomCollectionIngredient') {
                        editCustomCollectionIngredient(event, collection_ingredient.id);
                    }
                });
            });

            // Append create ingredient button
            const createIngredientButton = $('<button class="btn btn-primary btn-create-ingredient">Create Ingredient</button>');
            createIngredientButton.on('click', createCustomIngredient);
            $('.table-wrapper.collect').append(createIngredientButton);
        },
        error: function(error) {
            console.error('Error fetching ingredients:', error);
        }
    });
}

function createCustomIngredient() {
    // Create a new row with input fields
    const rowHtml = `
        <tr>
            <td><input class="collection-input" type="text" id="common_name-input" placeholder="Name"></td>
            <td><input class="collection-input" type="text" id="cas-input" placeholder="CAS"></td>
            <td><input class="collection-input" type="text" id="volatility-input" placeholder="Volatility"></td>
            <td><input class="collection-input" type="text" id="use-input" placeholder="Use"></td>
            <td><input class="collection-input" type="text" id="colour-input" placeholder="Colour"></td>
            <td><textarea class="collection-input" id="impression-input" placeholder="Impression"></textarea></td>
            <td><input class="collection-input" type="date" id="date_added-input" placeholder="Leave to save now"></td>
            <td><input class="collection-input" type="checkbox" id="is_collection-input"></td>
            <td><input class="collection-input" type="number" id="amount-input" placeholder="Amount"></td>
            <td class="editing">
                <button class="btn btn-primary done" title="Done">Done</button>
                <button class="btn btn-primary cancel" title="Cancel">Cancel</button>
            </td>
        </tr>
    `;

    // Append the new row to the table
    $('#collect-table tbody').append(rowHtml);

    // Add event listener to 'Done' button
    $('.done').on('click', function() {
        const data = {
            common_name: $('#common_name-input').val(),
            cas: $('#cas-input').val(),
            volatility: $('#volatility-input').val(),
            use: $('#use-input').val(),
            colour: $('#colour-input').val(),
            impression: $('#impression-input').val(),
            date_added: $('#date_added-input').val() || new Date().toISOString().slice(0,10),
            is_collection: $('#is_collection-input').is(':checked'),
            amount: $('#amount-input').val() || 0, // Add amount field
            unit: 'g', // Add unit field

            // add these in the future
            notes: 'no notes made', // Add notes field
            associations: 'no associations recorded' // Add associations field
        };

        // Send data to the server
        $.ajax({
            url: 'api/ingredient/new/',
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({user: userId, ...data}),
            success: function(response) {
                fetchIngredients();
            },
            error: function(error) {
                console.error('Error creating ingredient:', error);
            }
        });
    });

    // Add event listener to 'Cancel' button
    $('.cancel').on('click', function() {
        // Remove the new row
        $(this).closest('tr').remove();
    });
}

// Fetch the first page of ingredients when the page loads
fetchIngredients();
