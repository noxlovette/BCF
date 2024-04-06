document.addEventListener('DOMContentLoaded',function(){let currentPage=1;let userId=sessionStorage.getItem('user_id');document.getElementById('prev-page').addEventListener('click',function(){console.log('prev button clicked');if(currentPage>1){currentPage--;console.log('Current Page after decrement:',currentPage);fetchIngredients();}});document.getElementById('next-page').addEventListener('click',function(){console.log('next button clicked');if(currentPage<totalPages){currentPage++;console.log('Current Page after increment:',currentPage);fetchIngredients();}});function addToCollection(ingredientId,userId){let data={user_id:userId,ingredient_id:ingredientId};fetch(`/collection/api/collection/${userId}`,{method:'POST',headers:{'Content-Type':'application/json','X-CSRFToken':getCookie('csrf_token')},body:JSON.stringify(data),}).then(response=>{if(!response.ok){console.error('Response:',response);throw new Error('Network response was not ok');}
return response.json();}).then(data=>{console.log(data)
if(data.success){alert('Ingredient successfully added to collection!');}else{console.error(data.error);}}).catch(error=>{console.error('There has been a problem with your fetch operation:',error);});}
function fetchIngredients(){fetch(`api/ingredients?page=${currentPage}`).then(response=>{if(!response.ok){throw new Error('Network response was not ok');}
return response.json();}).then(data=>{console.log('data from server:',data);totalPages=data.total_pages;console.log(totalPages);const fragment=document.createDocumentFragment();data.results.forEach(ingredient=>{const row=document.createElement('tr');row.innerHTML=`
                    <td>
                        <button type="button" class="btn btn-primary add-to-collection" data-id="${ingredient.id}">
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
                `;fragment.appendChild(row);row.querySelector('.add-to-collection').addEventListener('click',function(){addToCollection(ingredient.id,userId);});});const ingredientsTableBody=document.querySelector('#ingredients-table tbody');ingredientsTableBody.innerHTML='';ingredientsTableBody.appendChild(fragment);const prevPageButton=document.getElementById('prev-page');prevPageButton.disabled=currentPage<=1;}).catch(error=>{console.error('There has been a problem with your fetch operation:',error);});}
function getCookie(name){let cookieValue=null;if(document.cookie&&document.cookie!==''){const cookies=document.cookie.split(';');for(let i=0;i<cookies.length;i++){const cookie=cookies[i].trim();if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;}
fetchIngredients();});;