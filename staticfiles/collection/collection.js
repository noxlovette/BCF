let user_id = sessionStorage.getItem('user_id');

function fetchIngredients() {
    fetch(`api/collection/${user_id}`)
        .then(response => response.json())
        .then(data => {
            // Ensure data is an array of collection ingredients or a single object
            let ingredients = Array.isArray(data) ? data : [data];

            const fragment = document.createDocumentFragment();

            ingredients.forEach(collection_ingredient => {
                // Check if collection_ingredient.ingredient exists
                let ingredient = collection_ingredient.ingredient ? collection_ingredient.ingredient : {};

                // Create a new row using a template literal
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${collection_ingredient.common_name || ''}</td>
                    <td>${collection_ingredient.cas || 'cas unknown'}</td>
                    <td>${collection_ingredient.volatility || 'no volatility known'}</td>
                    <td>${collection_ingredient.use || 'use not specified'}</td>
                    <td>${collection_ingredient.amount || '0'}</td>
                    <td>${collection_ingredient.colour || 'no colour specified'}</td>
                    <td>${collection_ingredient.impression || 'no impression registered yet'}</td>
                    <td>${collection_ingredient.date_added || 'date unknown'}</td>
                    <td>${collection_ingredient.is_collection || ''}</td>
                `;

                // Append the row to the fragment
                fragment.appendChild(row);
            });

            // Get the tbody of the user collection table
            const ingredientsTableBody = document.querySelector('#collection-table tbody');
            ingredientsTableBody.innerHTML = '';  // Clear the current contents

            // Append the fragment to the table body
            ingredientsTableBody.appendChild(fragment);
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
        });
}

// Fetch the first page of ingredients when the page loads
fetchIngredients();
