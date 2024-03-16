window.onload = function() {
    fetch('api/ingredients')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('ingredients-table');
            data.forEach(ingredient => {
                const row = table.insertRow();
                row.insertCell().textContent = ingredient.common_name;
                row.insertCell().textContent = ingredient.cas;
                row.insertCell().textContent = ingredient.family;
            });
        });
};