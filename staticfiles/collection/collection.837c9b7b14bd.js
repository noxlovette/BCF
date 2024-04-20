// utils

function createButton(textContent, className, eventListener, id) {
    const button = document.createElement('button');
    button.textContent = textContent;
    button.className = `btn btn-primary ${className}`;
    button.addEventListener('click', eventListener);
    button.dataset.id = id;
    return button;
}

// delete ingredient
function deleteCollectionIngredient(collectionIngredientId, userId) {
    $.ajax({
        url: `/collection/api/ingredient/${userId}/${collectionIngredientId}/delete/`,
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
    // TODO UNDEFINED
    console.log('Deleting custom collection ingredient:', customCollectionIngredientId);
    $.ajax({
        url: `/collection/api/ingredient/${userId}/custom/${customCollectionIngredientId}/delete/`,
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

// editing

function editIngredient(event, id, selectors, saveFunction) {
    const row = event.target.parentNode.parentNode;
    console.log('edit has been clicked, the id: ', id)
    const cells = row.querySelectorAll(selectors);
    cells.forEach((cell, index) => {
        const cellText = cell.textContent;
        const cellId = cell.id;
        let inputElement;
        if (cellId === 'is_collection') {
            inputElement = document.createElement('input');
            inputElement.className = "collection-input";
            inputElement.type = "checkbox";
            if (cellText === 'true') {
                inputElement.checked = true;
            }
        } else if (cellId === 'amount') {
            inputElement = document.createElement('input');
            inputElement.className = "collection-input";
            inputElement.type = "number";
            inputElement.value = parseInt(cellText, 10);
        } else {
            inputElement = document.createElement('input');
            inputElement.className = "collection-input";
            inputElement.type = "text";
            inputElement.value = cellText;
        }
        inputElement.id = `${cellId}-input`;
        cell.innerHTML = '';
        cell.appendChild(inputElement);
    });

    const saveButton = createButton('Save', 'save', function(event) {
        saveFunction(event, id);});
    const cancelButton = createButton('Cancel', 'cancel', fetchIngredients);

    const buttonCell = row.querySelector('.editing');
    buttonCell.appendChild(saveButton);
    buttonCell.appendChild(cancelButton);
}

function editCollectionIngredient(event, id) {
    editIngredient(event, id, 'td.editable', saveCollectionIngredient);
}

function editCustomCollectionIngredient(event, id) {
    editIngredient(event, id, 'td.editable, td.editable-custom', saveCustomCollectionIngredient);
}

// saving
function saveIngredientCommon(event, url, id) {
    console.log('Saving ingredient...')
    console.log('id when save button has been clicked', id)
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const inputs = row.querySelectorAll('input.collection-input');
    const data = {};
    inputs.forEach((input) => {
        console.log('input', input)
        const key = input.id.replace('-input', '');
        console.log('key', key)
        data[key] = input.type === 'checkbox' ? input.checked : input.value;
        console.log('data[key]', data[key])
    });

    $.ajax({
        url: url,
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

function saveCollectionIngredient(event) {
    const id = event.target.dataset.id;
    const url = `/collection/api/ingredient/${userId}/${id}/update/`;
    saveIngredientCommon(event, url);
}

function saveCustomCollectionIngredient(event) {
    const id = event.target.dataset.id;
    const url = `/collection/api/ingredient/${userId}/custom/${id}/update/`;
    saveIngredientCommon(event, url);
}

// main function
function fetchIngredients() {
    console.log('Fetching ingredients...')
    $.ajax({
        url: `api/collection/${userId}/`,
        method: 'GET',
        success: function(data) {
            let ingredients = Array.isArray(data) ? data : [data];
            const tableBody = $('#collection-table tbody');
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
        },
        error: function(error) {
            console.error('Error fetching ingredients:', error);
        }
    });
}

// create

$(document).ready(function() {
    $('.btn-create-ingredient').on('click', createCustomIngredient);
});
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
    $('#collection-table tbody').append(rowHtml);

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
