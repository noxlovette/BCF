function deleteIngredient(collectionIngredientId, userId) {
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

function editIngredient(event) {
    const row = event.target.parentNode.parentNode;
    const amountCell = row.querySelector('.amount-col');
    const colourCell = row.querySelector('.col-col');
    const impressionCell = row.querySelector('.impt-col');
    const isCollectionCell = row.querySelector('.is_col-col');

    const amount = amountCell.textContent;
    const colour = colourCell.textContent;
    const impression = impressionCell.textContent;
    const isCollection = isCollectionCell.textContent === 'true';

    amountCell.innerHTML = `<input id="amount-input" class="collection-input" type="text" value="${amount}">`;
    colourCell.innerHTML = `<input id="colour-input" class="collection-input" type="text" value="${colour}">`;
    impressionCell.innerHTML = `<textarea id="impression-input" class="collection-input" type="text">${impression}</textarea>`;
    isCollectionCell.innerHTML = `<input id="is-collection-input" class="collection-input" type="checkbox" ${isCollection ? 'checked' : ''}>`;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'btn btn-primary save';
    saveButton.dataset.id = event.target.dataset.id;
    saveButton.addEventListener('click', saveIngredient);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'btn btn-primary cancel';
    cancelButton.addEventListener('click', fetchIngredients);

    const buttonCell = row.querySelector('.editing');
    buttonCell.appendChild(saveButton);
    buttonCell.appendChild(cancelButton);
}

function saveIngredient(event) {
    const collectionIngredientId = event.target.dataset.id;
    const amountInput = $('#amount-input');
    const colourInput = $('#colour-input');
    const impressionInput = $('#impression-input');
    const isCollectionInput = $('#is-collection-input');

    const data = {
        amount: amountInput.val(),
        colour: colourInput.val(),
        impression: impressionInput.val(),
        is_collection: isCollectionInput.is(':checked')
    };

    $.ajax({
        url: `/collection/api/ingredient/${userId}/${collectionIngredientId}`,
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
    $.ajax({
        url: `api/collection/${userId}`,
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
                        <td class="nm-col">${collection_ingredient.common_name || 'name unknown'}</td>
                        <td class="cas-col">${collection_ingredient.cas || 'cas unknown'}</td>
                        <td class="vol-col">${collection_ingredient.volatility || 'no volatility specified'}</td>
                        <td class="use-col">${collection_ingredient.use || 'use not specified'}</td>
                        <td class="col-col">${collection_ingredient.colour || 'no colour specified'}</td>
                        <td class="impt-col">${collection_ingredient.impression || 'no impression specified yet'}</td>
                        <td class="date-col">${collection_ingredient.date_added || 'date unknown'}</td>
                        <td class="is_col-col">${collection_ingredient.is_collection || ''} </td>
                        <td class="amount-col">${collection_ingredient.amount || '0'} ${collection_ingredient.unit}</td>
                        <td class="editing">
                            <button class="btn btn-primary delete" title="Delete ingredient" data-id="${collection_ingredient.id}">Delete</button>
                            <button class="btn btn-primary edit" title="Edit ingredient" data-id="${collection_ingredient.id}">Edit</button>
                        </td>
                    </tr>
                `;
                let deleteIngredientButton = $(rowHtml).find('.delete');
                deleteIngredientButton.on('click', function() {
                    deleteIngredient(collection_ingredient.id, userId);
                });
                let editIngredientButton = $(rowHtml).find('.edit');
                editIngredientButton.on('click', editIngredient);

                // Append the row to the table
                tableBody.append(rowHtml);
            });

            // Append create ingredient button
            const createIngredientButton = $('<button class="btn btn-primary btn-create-ingredient">Create Ingredient</button>');
            createIngredientButton.on('click', createIngredient);
            $('.table-wrapper.collection').append(createIngredientButton);
        },
        error: function(error) {
            console.error('Error fetching ingredients:', error);
        }
    });
}


function createIngredient() {
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
            notes: '', // Add notes field
            associations: '' // Add associations field
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
