let currentPage = 1;
let searchValue = '';

function handleSearch() {
    const searchTerm = document.getElementById('search-input').value;
    searchValue = searchTerm;
    fetchIngredients(searchTerm);

    // Update the URL with the search value as a query parameter
    const url = new URL(window.location);
    url.searchParams.set('search', searchValue);
    window.history.pushState({}, '', url);
}

document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        fetchIngredients(searchValue);
    }
});

document.getElementById('next-page').addEventListener('click', function() {
    currentPage++;
    fetchIngredients(searchValue);
});

document.getElementById('search-button').addEventListener('click', handleSearch);

document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});

// Get the clear search button
const clearSearchButton = document.getElementById('clear-search');

// Add an event listener for the 'click' event to the clear search button
clearSearchButton.addEventListener('click', function() {
    // Clear the search input field
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';

    // Reset the searchValue variable
    searchValue = '';

    // Fetch the ingredients again without any search term
    fetchIngredients();

    // Clear the search query parameter from the URL
    const url = new URL(window.location);
    url.searchParams.delete('search');
    window.history.pushState({}, '', url);
});

// When the page loads, check if there's a search query parameter in the URL
window.addEventListener('load', function() {
    const url = new URL(window.location);
    const searchValue = url.searchParams.get('search');

    // If there's a search value, update the input field and apply the search criteria
    if (searchValue) {
        document.getElementById('search-input').value = searchValue;
        fetchIngredients(searchValue);
    }
});

function addToCollection(ingredient) {
    // Get the collection from session storage
    let collection = JSON.parse(sessionStorage.getItem('collection'));

    if (!collection) {
        collection = [];
    }
    // Add the ingredient to the collection
    collection.push(ingredient);

    // Update the collection in session storage
    sessionStorage.setItem('collection', JSON.stringify(collection));

    // Send a request to the API to update the collection on the server
    fetch('collection/api/collection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(collection),
    });
}
function fetchIngredients(searchTerm='') {
    // fetch the page and search term
    fetch(`api/ingredients?page=${currentPage}&search=${searchTerm}`)
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
                const descriptorsCell = document.createElement('td');
                const volatilityCell = document.createElement('td');
                const useCell = document.createElement('td');
                const restrictionsCell = document.createElement('td');
                const typeCell = document.createElement('td');

                // Set the text content of the cells
                // Set the innerHTML of the add_button cell
                nameCell.textContent = ingredient.common_name;
                casCell.textContent = ingredient.cas;
                descriptorsCell.textContent = ingredient.descriptors;
                volatilityCell.textContent = ingredient.volatility;
                useCell.textContent = ingredient.use;
                restrictionsCell.textContent = ingredient.is_restricted;
                typeCell.textContent = ingredient.ingredient_type;

                addButton.addEventListener('click', function() {
                    addToCollection(ingredient)
                });


                // Append the cells to the row
                buttonCell.appendChild(addButton);
                row.appendChild(buttonCell);
                row.appendChild(nameCell);
                row.appendChild(casCell);
                row.appendChild(typeCell);
                row.appendChild(volatilityCell);
                row.appendChild(descriptorsCell);
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

fetchIngredients(searchValue);
