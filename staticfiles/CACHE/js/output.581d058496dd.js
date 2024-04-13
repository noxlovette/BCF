user_id=sessionStorage.getItem('user_id');$(document).ready(function(){var csrftoken=getCookie('csrftoken');console.log('User ID:',user_id);$.ajax({url:'api/formula/list/',method:'GET',data:{user_id:user_id},headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaList=$('<ul id="formulae-list">');data.forEach(function(formula){var formulaItem=$('<li>').addClass('formula-item');var nameLabel=$('<p id = "formula-name">').text('Name: '+formula.name);var timeEditedLabel=$('<p id = "formula-edit-time">').text('Edited: '+formula.updated_at);var viewButton=$('<button class= "btn btn-primary btn-formula" id = "view-formula">').text('View Formula');viewButton.data('id',formula.id);formulaItem.append(nameLabel,timeEditedLabel,viewButton);formulaList.append(formulaItem);});$('#sidebar').append(formulaList);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};$(document).ready(function(){$('#sidebar').on('click','.btn-formula',function(e){e.preventDefault();$('.formula-detail').remove();var formulaId=$(this).data('id');console.log('Clicked button view for formula ID:',formulaId);var csrftoken=getCookie('csrftoken');$.ajax({url:'api/formula/'+formulaId+'/',method:'GET',headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaDetailItem=$('<div>').addClass('formula-detail');var formulaDetailTable=$('<table>').addClass('formula-detail-table');var nameRow=$('<tr>').append($('<td>').text('Name:'),$('<td class="editable-detail-table">').text(data.name));var descriptionRow=$('<tr>').append($('<td>').text('Description:'),$('<td class="editable-detail-table">').text(data.description));var timeEditedRow=$('<tr>').append($('<td>').text('Time Edited:'),$('<td>').text(data.updated_at));var editButton=$('<button>').addClass('btn btn-primary btn-edit-formula').text('Edit');editButton.data('id',data.id);var saveButton=$('<button>').addClass('btn btn-primary btn-save-formula').text('Save');saveButton.data('id',data.id);saveButton.hide();formulaDetailTable.append(nameRow,descriptionRow,timeEditedRow,editButton,saveButton);var formulaIngredientTable=$('<table>').addClass('formula-ingredient-table');var ingredientHeaderRow=$('<tr>').append($('<th>').text('#'),$('<th>').text('Ingredient'),$('<th>').text('Volatility'),$('<th>').text('Amount'),);formulaIngredientTable.append(ingredientHeaderRow);var counter=1;data.ingredients.forEach(function(ingredient){var ingredientRow=$('<tr>').append($('<td id="counter cell">').text(counter++).addClass('td-counter-cell'),$('<td id="ingredient cell">').text(ingredient.ingredient).addClass("td-ingredient-input"),$('<td id="volatility cell">').text(ingredient.volatility).addClass('td-volatility-cell'),$('<td id="amount cell">').text(ingredient.amount).addClass('td-regular-input'),);formulaIngredientTable.append(ingredientRow);});formulaDetailItem.append(formulaDetailTable,formulaIngredientTable);$('#main-content').append(formulaDetailItem);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};userId=sessionStorage.getItem('user_id');csrftoken=getCookie('csrftoken');function setupIngredientAutocomplete(text){console.log('Setting up ingredient autocomplete')
text=text||'';var inputField=$('<input>').attr({'type':'text','id':'ingredient-input','value':text});var dropdownMenu=$('<ul>').attr('id','ingredient-dropdown').addClass('dropdown-menu');var container=$('<div>').attr('id','ingredient-autocomplete-container');container.empty().append(inputField,dropdownMenu);inputField.on('input',function(){console.log('Input field value:',$(this).val());var query=$(this).val();$.ajax({url:'/collection/api/collection/'+userId+'/?search='+query,method:'GET',headers:{'X-CSRFToken':csrftoken},success:function(data){dropdownMenu.empty();if(data.length>0){data.forEach(function(ingredient){var item=$('<li>').addClass('dropdown-item').text(ingredient.common_name);item.on('click',function(){inputField.val(ingredient.common_name);var row=$(item).closest('tr');var cell=row.find('td:eq(2)')
cell.text(ingredient.volatility)
dropdownMenu.removeClass('active');});dropdownMenu.append(item);});dropdownMenu.addClass('active');}else{var message=$('<li>').addClass('dropdown-item').text('No matching ingredients found');dropdownMenu.append(message);dropdownMenu.addClass('active');}},error:function(xhr,status,error){console.error('Error:',error);}});});return container;}
$(document).ready(function(){$('#main-content').on('click','.btn-edit-formula',function(e){e.preventDefault();console.log('Edit button clicked');var formulaDetailItem=$(this).closest('.formula-detail');var formulaDetailTable=formulaDetailItem.find('.formula-detail-table');var formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');formulaDetailTable.find('.editable-detail-table').each(function(){var text=$(this).text().trim();$(this).html('<input type="text" value="'+text+'">');});formulaIngredientTable.find('.td-regular-input').each(function(){var text=$(this).text().trim();$(this).html('<input type="text" value="'+text+'">');});formulaIngredientTable.find('.td-ingredient-input').each(function(){console.log('Ingredient:',$(this).text());var text=$(this).text().trim();$(this).html(setupIngredientAutocomplete(text));console.log('set up ingredient autocomplete field meow')});addButton=$('<button>').addClass('btn btn-primary btn-add-ingredient').text('Add Ingredient');formulaIngredientTable.append(addButton);formulaDetailItem.find('.btn-save-formula').show();$(this).hide();});$('#main-content').on('click','.btn-add-ingredient',function(e){e.preventDefault();var formulaDetailItem=$(this).closest('.formula-detail');var formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');var lastRow=formulaIngredientTable.find('tr:last');lastCounter=parseInt(lastRow.find('.td-counter-cell').text());var newCounter=lastCounter+1;var newRow=$('<tr>').append($('<td id="counter cell">').text(newCounter).addClass('td-counter-cell'),$('<td id="ingredient cell">').addClass("td-ingredient-input").append(setupIngredientAutocomplete('')),$('<td id = "volatility cell">').append($('<td>').addClass('td-volatility-cell')),$('<td id="amount cell">').append($('<input>').attr('type','text').addClass('td-regular-input')),);formulaIngredientTable.append(newRow);});$('#main-content').on('click','.btn-save-formula',function(e){e.preventDefault();var formulaDetailItem=$(this).closest('.formula-detail');var formulaDetailTable=formulaDetailItem.find('.formula-detail-table');var formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');formulaDetailTable.find('input').each(function(){var value=$(this).val();$(this).parent().text(value);});formulaIngredientTable.find('.td-regular-input').each(function(){var value=$(this).find('input').text();$(this).find('input').remove()
$(this).text(value);});console.log('Changing #ingredient-input')
formulaIngredientTable.find('.td-ingredient-input').each(function(){var parentElement=$(this);var inputField=parentElement.find('#ingredient-input');var inputValue=inputField.val();parentElement.text(inputValue);console.log('Changed the value of the td');parentElement.find('#ingredient-autocomplete-container').remove();console.log('Removed container for one of the rows');});console.log('Removed container')
$('.btn-add-ingredient').remove();formulaDetailItem.find('.btn-edit-formula').show();$(this).hide();});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};