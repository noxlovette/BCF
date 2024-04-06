let currentPage=1;let searchValue='';function handleSearch(){const searchTerm=document.getElementById('search-input').value;searchValue=searchTerm;fetchIngredients(searchTerm);const url=new URL(window.location);url.searchParams.set('search',searchValue);window.history.pushState({},'',url);}
document.getElementById('prev-page').addEventListener('click',function(){if(currentPage>1){currentPage--;fetchIngredients(searchValue);}});document.getElementById('next-page').addEventListener('click',function(){currentPage++;fetchIngredients(searchValue);});document.getElementById('search-button').addEventListener('click',handleSearch);document.getElementById('search-input').addEventListener('keypress',function(event){if(event.key==='Enter'){event.preventDefault();handleSearch();}});const clearSearchButton=document.getElementById('clear-search');clearSearchButton.addEventListener('click',function(){const searchInput=document.getElementById('search-input');searchInput.value='';searchValue='';fetchIngredients();const url=new URL(window.location);url.searchParams.delete('search');window.history.pushState({},'',url);});window.addEventListener('load',function(){const url=new URL(window.location);const searchValue=url.searchParams.get('search');if(searchValue){document.getElementById('search-input').value=searchValue;fetchIngredients(searchValue);}});function addToCollection(ingredient){let collection=JSON.parse(sessionStorage.getItem('collection'))||[];collection.push(ingredient);sessionStorage.setItem('collection',JSON.stringify(collection));fetch('/collection/api/collection/?$user_id=${user_id}',{method:'POST',headers:{'Content-Type':'application/json',},body:JSON.stringify(ingredient),});}
function fetchIngredients(searchTerm=''){fetch(`api/ingredients?page=${currentPage}&search=${searchTerm}`).then(response=>response.json()).then(data=>{const fragment=document.createDocumentFragment();data.forEach(ingredient=>{const row=document.createElement('tr');row.innerHTML=`
                    <td>
                        <button type="button" class="btn btn-primary add-to-collection" data-id="${ingredient.id}" onclick="addToCollection(${JSON.stringify(ingredient).replace(/"/g, '&quot;')})">
                            Add to collection
                        </button>
                    </td>
                    <td>${ingredient.common_name}</td>
                    <td>${ingredient.cas}</td>
                    <td>${ingredient.ingredient_type}</td>
                    <td>${ingredient.volatility}</td>
                    <td>${ingredient.descriptors}</td>
                    <td>${ingredient.use}</td>
                    <td>${ingredient.is_restricted}</td>
                `;fragment.appendChild(row);});const ingredientsTableBody=document.querySelector('#ingredients-table tbody');ingredientsTableBody.innerHTML='';ingredientsTableBody.appendChild(fragment);document.getElementById('prev-page').disabled=(currentPage===1);document.getElementById('next-page').disabled=(data.length<20);});}
fetchIngredients(searchValue);;