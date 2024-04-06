let user_id=sessionStorage.getItem('user_id');function fetchIngredients(){fetch(`api/collection/${user_id}`).then(response=>response.json()).then(data=>{const fragment=document.createDocumentFragment();data.results.forEach(collection_ingredient=>{const row=document.createElement('tr');row.innerHTML=`
                    <td>${collection_ingredient.ingredient}</td>
                    <td>${collection_ingredient.ingredient.cas}</td>
                    <td>${collection_ingredient.ingredient.volatility}</td>
                    <td>${collection_ingredient.ingredient.use}</td>
                    <td>${collection_ingredient.amount}</td>
                    <td>${collection_ingredient.colour}</td>
                    <td>${collection_ingredient.impression}</td>
                    <td>${collection_ingredient.date_added}</td>
                    <td>${collection_ingredient.is_collection}</td>
                `;fragment.appendChild(row);});const ingredientsTableBody=document.querySelector('#collection-table tbody');ingredientsTableBody.innerHTML='';ingredientsTableBody.appendChild(fragment);});}
fetchIngredients();;