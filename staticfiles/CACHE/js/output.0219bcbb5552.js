let currentPage=1;document.getElementById('prev-page').addEventListener('click',function(){if(currentPage>1){currentPage--;fetchIngredients();}});document.getElementById('next-page').addEventListener('click',function(){currentPage++;fetchIngredients();});function fetchIngredients(){fetch(`api/collection?page=${currentPage}`).then(response=>response.json()).then(data=>{const fragment=document.createDocumentFragment();data.results.forEach(collection_ingredient=>{const row=document.createElement('tr');row.innerHTML=`
                    <td>${collection_ingredient.ingredient}</td>
                    <td>${collection_ingredient.ingredient.cas}</td>
                    <td>${collection_ingredient.ingredient.volatility}</td>
                    <td>${collection_ingredient.ingredient.use}</td>
                    <td>${collection_ingredient.amount}</td>
                    <td>${collection_ingredient.colour}</td>
                    <td>${collection_ingredient.impression}</td>
                    <td>${collection_ingredient.date_added}</td>
                    <td>${collection_ingredient.is_collection}</td>
                `;fragment.appendChild(row);});const ingredientsTableBody=document.querySelector('#collection-table tbody');ingredientsTableBody.innerHTML='';ingredientsTableBody.appendChild(fragment);document.getElementById('prev-page').disabled=(currentPage===1);document.getElementById('next-page').disabled=(data.next===null);});}
fetchIngredients();;