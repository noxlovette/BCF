let user_id=sessionStorage.getItem('user_id');function fetchIngredients(){fetch(`api/collection/${user_id}`).then(response=>response.json()).then(data=>{let ingredients=Array.isArray(data)?data:[data];const fragment=document.createDocumentFragment();ingredients.forEach(collection_ingredient=>{let ingredient=collection_ingredient.ingredient?collection_ingredient.ingredient:{};const row=document.createElement('tr');row.innerHTML=`
                    <td>${collection_ingredient.common_name || ''}</td>
                    <td>${collection_ingredient.cas || 'cas unknown'}</td>
                    <td>${collection_ingredient.volatility || 'no volatility known'}</td>
                    <td>${collection_ingredient.use || 'use not specified'}</td>
                    <td>${collection_ingredient.amount || '0'}</td>
                    <td>${collection_ingredient.colour || 'no colour specified'}</td>
                    <td>${collection_ingredient.impression || 'no impression registered yet'}</td>
                    <td>${collection_ingredient.date_added || 'date unknown'}</td>
                    <td>${collection_ingredient.is_collection || ''}</td>
                `;fragment.appendChild(row);});const ingredientsTableBody=document.querySelector('#collection-table tbody');ingredientsTableBody.innerHTML='';ingredientsTableBody.appendChild(fragment);}).catch(error=>{console.error('Error fetching ingredients:',error);});}
fetchIngredients();;