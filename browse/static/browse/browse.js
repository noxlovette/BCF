document.addEventListener('DOMContentLoaded', function() {

    let currentPage = 1;
    let userId = sessionStorage.getItem('user_id');

    document.getElementById('prev-page').addEventListener('click', function () {
        console.log('prev button clicked');
        if (currentPage > 1) {
            currentPage--;
            console.log('Current Page after decrement:', currentPage);
            const searchTerm = document.getElementById('search-input').value;
            fetchIngredients(searchTerm);
        }
    });

    document.getElementById('next-page').addEventListener('click', function () {
        console.log('next button clicked');
        if (currentPage < totalPages) {
            currentPage++;
            const searchTerm = document.getElementById('search-input').value;
            console.log('Current Page after increment:', currentPage);
            fetchIngredients(searchTerm);
        }
    });

    document.getElementById('clear-search').addEventListener('click', function () {
    // Clear the search input field
    document.getElementById('search-input').value = '';
    // Reset the current page to 1
    currentPage = 1;
    // Fetch the first page of all ingredients
    fetchIngredients();
});

    document.getElementById('search-button').addEventListener('click', function () {
    console.log('search button clicked');
        // Get the search term from the search input field
    const searchTerm = document.getElementById('search-input').value;
    currentPage = 1;  // Reset the current page to 1 when search clicked
    // Fetch the ingredients that match the search term
    fetchIngredients(searchTerm);
});

    function addToCollection(ingredientId, userId) {
        let data = {
            user_id: userId,
            ingredient_id: ingredientId
        };

        fetch(`/collection/api/collection/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Response:', response);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                if (data.success) {
                    alert('Ingredient successfully added to collection!');
                } else {
                    console.error(data.error);
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    function fetchIngredients(searchTerm = '') {
        fetch(`api/ingredients?page=${currentPage}&search=${searchTerm}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('data from server:', data);  // Add this line
                totalPages = data.total_pages;
                console.log(totalPages);  // Add this line
                const fragment = document.createDocumentFragment();

                // Access the ingredients directly from data
                data.results.forEach(ingredient => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>
                    <button class='add-to-collection' title="Add to collection" data-id="${ingredient.id}" style="background: transparent; border: none;">
                        <img src="/static/assets/img/plus-circle.svg" alt="Add to collection">
                    </button>
                </td>
                <td>${ingredient.common_name}</td>
                <td>${ingredient.cas}</td>
                <td>${ingredient.ingredient_type}</td>
                <td>${ingredient.volatility}</td>
                <td>${ingredient.descriptors}</td>
                <td>${ingredient.use}</td>
                <td>${ingredient.is_restricted}</td>
            `;

                    fragment.appendChild(row);
                    row.querySelector('.add-to-collection').addEventListener('click', function () {
                    addToCollection(ingredient.id, userId);
                });
                });

                const ingredientsTableBody = document.querySelector('#ingredients-table tbody');
                ingredientsTableBody.innerHTML = '';
                ingredientsTableBody.appendChild(fragment);

                const prevPageButton = document.getElementById('prev-page');
                prevPageButton.disabled = currentPage <= 1;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
    function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

    fetchIngredients();
});
