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
                const nameCell = document.createElement('td');
                const casCell = document.createElement('td');
                const familyCell = document.createElement('td');

                // Set the text content of the cells
                nameCell.textContent = ingredient.common_name;
                casCell.textContent = ingredient.cas;
                familyCell.textContent = ingredient.families;

                // Append the cells to the row
                row.appendChild(nameCell);
                row.appendChild(casCell);
                row.appendChild(familyCell);

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