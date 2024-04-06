let user_id=sessionStorage.getItem('user_id');function fetchIngredients(){fetch(`api/collection/${user_id}`).then(response=>response.json()).then(data=>{let ingredients=Array.isArray(data)?data:[data];const fragment=document.createDocumentFragment();ingredients.forEach(collection_ingredient=>{let ingredient=collection_ingredient.ingredient?collection_ingredient.ingredient:{};const row=document.createElement('tr');row.innerHTML=`
                    <td>${ingredient.common_name || ''}</td>
                    <td>${ingredient.cas || ''}</td>
                    <td>${ingredient.volatility || ''}</td>
                    <td>${ingredient.use || ''}</td>
                    <td>${collection_ingredient.amount || ''}</td>
                    <td>${collection_ingredient.colour || ''}</td>
                    <td>${collection_ingredient.impression || ''}</td>
                    <td>${collection_ingredient.date_added || ''}</td>
                    <td>${collection_ingredient.is_collection || ''}</td>
                `;fragment.appendChild(row);});const ingredientsTableBody=document.querySelector('#collection-table tbody');ingredientsTableBody.innerHTML='';ingredientsTableBody.appendChild(fragment);}).catch(error=>{console.error('Error fetching ingredients:',error);});}
fetchIngredients();;