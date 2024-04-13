user_id=sessionStorage.getItem('user_id');$(document).ready(function(){var csrftoken=getCookie('csrftoken');console.log('User ID:',user_id);$.ajax({url:'api/formula/list/',method:'GET',data:{user_id:user_id},headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaList=$('<ul id="formulae-list">');data.forEach(function(formula){var formulaItem=$('<li>').addClass('formula-item');var nameLabel=$('<p id = "formula-name">').text('Name: '+formula.name);var timeEditedLabel=$('<p id = "formula-edit-time">').text('Edited: '+formula.updated_at);var viewButton=$('<button class= "btn btn-primary btn-formula" id = "view-formula">').text('View Formula');viewButton.data('id',formula.id);formulaItem.append(nameLabel,timeEditedLabel,viewButton);formulaList.append(formulaItem);});$('#sidebar').append(formulaList);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};$(document).ready(function(){$('#sidebar').on('click','.btn-formula',function(e){e.preventDefault();$('.formula-detail').remove();var formulaId=$(this).data('id');console.log('Clicked button view for formula ID:',formulaId);var csrftoken=getCookie('csrftoken');$.ajax({url:'api/formula/'+formulaId+'/',method:'GET',headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaDetailItem=$('<div>').addClass('formula-detail');var formulaDetailTable=$('<table>').addClass('formula-detail-table');var nameRow=$('<tr>').append($('<td>').text('Name:'),$('<td class="editable-detail-table">').text(data.name));var descriptionRow=$('<tr>').append($('<td>').text('Description:'),$('<td class="editable-detail-table">').text(data.description));var timeEditedRow=$('<tr>').append($('<td>').text('Time Edited:'),$('<td>').text(data.updated_at));var editButton=$('<button>').addClass('btn btn-primary btn-edit-formula').text('Edit');editButton.data('id',data.id);var saveButton=$('<button>').addClass('btn btn-primary btn-save-formula').text('Save');saveButton.data('id',data.id);saveButton.hide();formulaDetailTable.append(nameRow,descriptionRow,timeEditedRow,editButton,saveButton);var formulaIngredientTable=$('<table>').addClass('formula-ingredient-table');var ingredientHeaderRow=$('<tr>').append($('<th>').text('#'),$('<th>').text('Ingredient'),$('<th>').text('Volatility'),$('<th>').text('Amount'),$('<th>').text('Unit'));formulaIngredientTable.append(ingredientHeaderRow);var counter=1;data.ingredients.forEach(function(ingredient){var ingredientRow=$('<tr>').append($('<td id="counter cell">').text(counter++),$('<td class = "td-ingredient-input" id="name cell">').text(ingredient.ingredient),$('<td id="volatility cell">').text(ingredient.volatility),$('<td id="amount cell" class = "td-regular-input">').text(ingredient.amount),$('<td id="unit cell">').text(ingredient.unit));formulaIngredientTable.append(ingredientRow);});formulaDetailItem.append(formulaDetailTable,formulaIngredientTable);$('#main-content').append(formulaDetailItem);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};userId=sessionStorage.getItem('user_id');csrftoken=getCookie('csrftoken');function setupIngredientAutocomplete(text){console.log('Setting up ingredient autocomplete')
var inputField=$('<input>').attr('type','text').attr('id','ingredient-input').val(text);var dropdownMenu=$('<ul>').attr('id','ingredient-dropdown').addClass('dropdown-menu');var container=$('#ingredient-autocomplete-container');container.empty().append(inputField,dropdownMenu);inputField.on('input',function(){console.log('Input field value:',$(this).val());var query=$(this).val();$.ajax({url:'/collection/api/collection/'+userId+'/?search='+query,method:'GET',headers:{'X-CSRFToken':csrftoken},success:function(data){dropdownMenu.empty();data.forEach(function(ingredient){var item=$('<li>').addClass('dropdown-item').text(ingredient.name);dropdownMenu.append(item);});},error:function(xhr,status,error){console.error('Error:',error);}});});return container;}
$(document).ready(function(){$('#main-content').on('click','.btn-edit-formula',function(e){e.preventDefault();console.log('Edit button clicked');var formulaDetailItem=$(this).closest('.formula-detail');var formulaDetailTable=formulaDetailItem.find('.formula-detail-table');var formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');formulaDetailTable.find('.editable-detail-table').each(function(){var text=$(this).text().trim();$(this).html('<input type="text" value="'+text+'">');});formulaIngredientTable.find('.td-regular-input').each(function(){var text=$(this).text().trim();$(this).html('<input type="text" value="'+text+'">');});formulaIngredientTable.find('.td-ingredient-input').each(function(){console.log('Ingredient:',$(this).text());var text=$(this).text().trim();$(this).html(setupIngredientAutocomplete(text).attr('id','ingredient-input'));});addButton=$('<button>').addClass('btn btn-primary btn-add-ingredient').text('Add Ingredient');formulaIngredientTable.append(addButton);$('#main-content').on('click','.btn-add-ingredient',function(e){e.preventDefault();var newRow=$('<tr>').append($('<td>').text(''),$('<td>').append($('<input>').attr('type','text').attr('id','ingredient-input').addClass('td-ingredient-formula')),$('<td>').append($('<td>').attr('id','volatility-td')),$('<td>').append($('<input>').attr('type','text').attr('id','amount-input')),$('<td>').append($('<td>').attr('id','unit-td')),);formulaIngredientTable.append(newRow);});formulaDetailItem.find('.btn-save-formula').show();$(this).hide();});$('#main-content').on('click','.btn-save-formula',function(e){e.preventDefault();var formulaDetailItem=$(this).closest('.formula-detail');var formulaDetailTable=formulaDetailItem.find('.formula-detail-table');var formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');formulaDetailTable.find('input').each(function(){var value=$(this).val();$(this).parent().text(value);});formulaIngredientTable.find('input').each(function(){var value=$(this).val();$(this).parent().text(value);});$('.btn-add-ingredient').remove();formulaDetailItem.find('.btn-edit-formula').show();$(this).hide();});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};