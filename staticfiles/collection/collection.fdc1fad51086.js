function deleteIngredient(collectionIngredientId, user_id) {
    $.ajax({
        url: `/collection/api/ingredient/${user_id}/${collectionIngredientId}`,
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
        url: `/collection/api/ingredient/${user_id}/${collectionIngredientId}`,
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
        url: `api/collection/${user_id}`,
        method: 'GET',
        success: function(data) {
            // Ensure data is an array of collection ingredients or a single object
            let ingredients = Array.isArray(data) ? data : [data];

            // ... rest of your code ...
        },
        error: function(error) {
            console.error('Error fetching ingredients:', error);
        }
    });
}

function createIngredient() {
    $.ajax({
        url: 'api/ingredient/new',
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({user: user_id}),
        success: function(response) {
            fetchIngredients();
        },
        error: function(error) {
            console.error('Error creating ingredient:', error);
        }
    });
}

// Fetch the first page of ingredients when the page loads
fetchIngredients();