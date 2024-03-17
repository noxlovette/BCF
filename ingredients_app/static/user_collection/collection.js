// JavaScript
let currentPage = 1;

document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        fetchIngredients();
    }
});

document.getElementById('next-page').addEventListener('click', function() {
    currentPage++;
    fetchIngredients();
});

function fetchIngredients() {
    fetch(`http://localhost:8000/ingredients_app/api/ingredients?page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            // Get the tbody of the ingredients table
            const ingredientsTableBody = document.querySelector('#ingredients-table tbody');
            ingredientsTableBody.innerHTML = '';  // Clear the current contents

            data.forEach(ingredient => {
                // Create a new row and cells for the ingredient
                const row = document.createElement('tr');
                const buttonCell = document.createElement('td');
                const addButton = document.createElement('button');
                addButton.type = 'button';
                addButton.className = 'btn btn-primary add-to-collection';
                addButton.textContent = 'Add to collection';
                addButton.setAttribute('data-id', ingredient.id);
                const nameCell = document.createElement('td');
                const casCell = document.createElement('td');
                const familyCell = document.createElement('td');
                const volatilityCell = document.createElement('td');
                const useCell = document.createElement('td');
                const restrictionsCell = document.createElement('td');
                const typeCell = document.createElement('td');

                // Set the text content of the cells
                // Set the innerHTML of the add_button cell
                nameCell.textContent = ingredient.common_name;
                casCell.textContent = ingredient.cas;
                familyCell.textContent = ingredient.families;
                volatilityCell.textContent = ingredient.volatility;
                useCell.textContent = ingredient.use;
                restrictionsCell.textContent = ingredient.is_restricted;
                typeCell.textContent = ingredient.type;

                addButton.addEventListener('click', function() {
                    let ingredientId = this.dataset.id;
                    let userId = 2; // set to Danila's user id


                    // send POST request to the 'add_to_collection' endpoint
                    // to add the ingredient to the user's collection
                    fetch(`http://localhost:8000/user_collection/add_to_collection`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ingredient_id: ingredientId,
                            user_id: userId,
                        }),
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(data => {
                                throw new Error(data.message);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            alert('Ingredient added to collection!');
                        } else {
                            alert('Failed to add ingredient to collection.');
                        }
                    })
                    .catch(error => {
                        alert("The ingredient is already in your collection.");
                    });
                });


                // Append the cells to the row
                buttonCell.appendChild(addButton);
                row.appendChild(buttonCell);
                row.appendChild(nameCell);
                row.appendChild(casCell);
                row.appendChild(typeCell);
                row.appendChild(volatilityCell);
                row.appendChild(familyCell);
                row.appendChild(useCell);
                row.appendChild(restrictionsCell);

                // Append the row to the table body
                ingredientsTableBody.appendChild(row);
            });

            // Enable or disable the 'previous page' and 'next page' buttons
            document.getElementById('prev-page').disabled = (currentPage === 1);
            document.getElementById('next-page').disabled = (data.length < 20);
        });
}

// Fetch the first page of ingredients when the page loads
fetchIngredients();
