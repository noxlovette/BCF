user_id=sessionStorage.getItem('user_id');$(document).ready(function(){var csrftoken=getCookie('csrftoken');console.log('User ID:',user_id);$.ajax({url:'api/formula/list/',method:'GET',data:{user_id:user_id},headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaList=$('<ul id="formulae-list">');data.forEach(function(formula){var formulaItem=$('<li>').addClass('formula-item');var nameLabel=$('<p id = "formula-name">').text('Name: '+formula.name);var timeEditedLabel=$('<p id = "formula-edit-time">').text('Edited: '+formula.updated_at);var viewButton=$('<button class= "btn btn-primary btn-formula" id = "view-formula">').text('View Formula');viewButton.data('id',formula.id);formulaItem.append(nameLabel,timeEditedLabel,viewButton);formulaList.append(formulaItem);});$('#sidebar').append(formulaList);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};$(document).ready(function(){$('#view-formula').on('click',function(e){e.preventDefault();var formulaId=$(this).data('id');var csrftoken=getCookie('csrftoken');$.ajax({url:'api/formula/',method:'GET',data:{formula_id:formulaId},headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaDetailItem=$('<div>').addClass('formula-detail');var formulaDetailTable=$('<table>').addClass('table');var nameRow=$('<tr>').append($('<td>').text('Name:'),$('<td>').text(formula.name));var descriptionRow=$('<tr>').append($('<td>').text('Description:'),$('<td>').text(formula.description));var timeEditedRow=$('<tr>').append($('<td>').text('Time Edited:'),$('<td>').text(formula.updated_at));formulaDetailTable.append(nameRow,descriptionRow,timeEditedRow);var formulaIngredientTable=$('<table>').addClass('table');var ingredientHeaderRow=$('<tr>').append($('<th>').text('#'),$('<th>').text('Ingredient'),$('<th>').text('Volatility'),$('<th>').text('Amount'),$('<th>').text('Unit'));formulaIngredientTable.append(ingredientHeaderRow);var counter=1;formula.ingredients.forEach(function(ingredient){var ingredientRow=$('<tr>').append($('<td>').text(counter++),$('<td>').text(ingredient.name),$('<td>').text(ingredient.volatility),$('<td>').text(ingredient.amount),$('<td>').text(ingredient.unit));formulaIngredientTable.append(ingredientRow);});formulaDetailItem.append(formulaDetailTable,formulaIngredientTable);$('#sidebar').append(formulaDetailItem);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};