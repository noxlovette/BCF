let user_id = sessionStorage.getItem('user_id');

function deleteIngredient(collectionIngredientId, user_id) {
    fetch(`/collection/api/ingredient/${user_id}/${collectionIngredientId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                console.error('Response:', response);
            }
            fetchIngredients();
        })
        .catch(error => {
            console.error('Error deleting ingredient:', error);
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

    amountCell.innerHTML = `<input id="amount-input" class = "collection-input" type="text" value="${amount}">`;
    colourCell.innerHTML = `<input id="colour-input" class = "collection-input" type="text" value="${colour}">`;
    impressionCell.innerHTML = `<textarea id="impression-input" class = "collection-input" type="text" value="${impression}">`;
    isCollectionCell.innerHTML = `<input id="is-collection-input" class = "collection-input" type="checkbox" ${isCollection ? 'checked' : ''}>`;

    const saveButton = document.createElement('button');

    saveButton.textContent = 'Save';
    saveButton.className = 'btn btn-primary save'
    saveButton.dataset.id = event.target.dataset.id;
    saveButton.addEventListener('click', saveIngredient);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'btn btn-primary cancel';
    cancelButton.addEventListener('click', fetchIngredients);

    // select the td you need
    const buttonCell = row.querySelector('.editing');
    buttonCell.appendChild(saveButton);
    buttonCell.appendChild(cancelButton);
}

function saveIngredient(event) {
    const collectionIngredientId = event.target.dataset.id;
    const amountInput = document.getElementById(`amount-input`);
    const colourInput = document.getElementById(`colour-input`);
    const impressionInput = document.getElementById(`impression-input`);
    const isCollectionInput = document.getElementById(`is-collection-input`);

    const data = {
        amount: amountInput.value,
        colour: colourInput.value,
        impression: impressionInput.value,
        is_collection: isCollectionInput.checked
    };

    fetch(`/collection/api/ingredient/${user_id}/${collectionIngredientId}`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                console.error('Response:', response);
            }
            fetchIngredients();
        })
        .catch(error => {
            console.error('Error saving ingredient:', error);
        });

}



function fetchIngredients() {
    fetch(`api/collection/${user_id}`)
        .then(response => response.json())
        .then(data => {
            // Ensure data is an array of collect ingredients or a single object
            let ingredients = Array.isArray(data) ? data : [data];

            const fragment = document.createDocumentFragment();

            ingredients.forEach(collection_ingredient => {
                // Check if collection_ingredient.ingredient exists
                let ingredient = collection_ingredient.ingredient ? collection_ingredient.ingredient : {};

                // Create a new row using a template literal
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="nm-col">${collection_ingredient.common_name || 'name unknown'}</td>
                    <td class="cas-col">${collection_ingredient.cas || 'cas unknown'}</td>
                    <td class="vol-col">${collection_ingredient.volatility || 'no volatility specified'}</td>
                    <td class="use-col">${collection_ingredient.use || 'use not specified'}</td>
                    
                    <td class="col-col">${collection_ingredient.colour || 'no colour specified'}</td>
                    <td class="impt-col">${collection_ingredient.impression || 'no impression specified yet'}</td>
                    <td class="date-col">${collection_ingredient.date_added || 'date unknown'}</td>
                    <td class="is_col-col">${collection_ingredient.is_collection || ''} </td>
                    <td class="amount-col">${collection_ingredient.amount || '0'} ${collection_ingredient.unit}</td>
                    <td class = "editing">
                        <button class="btn btn-primary delete" id="delete" title="Delete ingredient" data-id="${collection_ingredient.id}">Delete</button>
                        <button class="btn btn-primary edit" id="edit" title = "Edit ingredient" data-id="${collection_ingredient.id}">Edit</button>
                    </td>
           
                `;

                // Append the row to the fragment

                row.querySelector('.edit').addEventListener('click', editIngredient);
                row.querySelector('.delete').addEventListener('click', function () {
                    deleteIngredient(collection_ingredient.id, user_id);
                });

                fragment.appendChild(row);
            });

            // Get the tbody of the user collect table
            const ingredientsTableBody = document.querySelector('#collect-table tbody');
            ingredientsTableBody.innerHTML = '';  // Clear the current contents

            // Append the fragment to the table body
            ingredientsTableBody.appendChild(fragment);
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
        });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Fetch the first page of ingredients when the page loads
fetchIngredients();
