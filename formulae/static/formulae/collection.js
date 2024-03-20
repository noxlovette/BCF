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
    fetch(`http://localhost:8000/collection/api/collection?page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            // Get the tbody of the user collection table
            const ingredientsTableBody = document.querySelector('#collection-table tbody');
            ingredientsTableBody.innerHTML = '';  // Clear the current contents

            data.forEach(collection_ing => {
                // Create a new row and cells for the ingredient
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                const casCell = document.createElement('td');
                const volatilityCell = document.createElement('td');
                const useCell = document.createElement('td');
                const amountCell = document.createElement('td');
                const colourCell = document.createElement('td');
                const impressionCell = document.createElement('td');
                const dateCell = document.createElement('td');
                const is_collectionCell = document.createElement('td');

                nameCell.textContent = collection_ing.ingredient;
                casCell.textContent = collection_ing.cas;
                volatilityCell.textContent = collection_ing.volatility;
                useCell.textContent = collection_ing.use;
                amountCell.textContent = collection_ing.amount;
                colourCell.textContent = collection_ing.colour;
                impressionCell.textContent = collection_ing.impression;
                dateCell.textContent = collection_ing.date_added;
                is_collectionCell.textContent = collection_ing.is_collection;


                // Append the cells to the row
                row.appendChild(nameCell);
                row.appendChild(casCell);
                row.appendChild(volatilityCell);
                row.appendChild(useCell);
                row.appendChild(amountCell);
                row.appendChild(colourCell);
                row.appendChild(impressionCell);
                row.appendChild(dateCell);
                row.appendChild(is_collectionCell);

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
