function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;}
const csrftoken=getCookie('csrftoken');const userId=sessionStorage.getItem('user_id');;$(document).ready(function(){$.ajax({url:'api/formula/list/',method:'GET',data:{user_id:userId},headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaList=$('<ul id="formulae-list">');data.forEach(function(formula){var formulaItem=$('<li>').addClass('formula-item');var nameLabel=$('<p id = "formula-name">').text('Name: '+formula.name);var timeEditedLabel=$('<p id = "formula-edit-time">').text('Edited: '+formula.updated_at);var viewButton=$('<button class= "btn btn-primary btn-formula" id = "view-formula">').text('View Formula');viewButton.data('id',formula.id);formulaItem.append(nameLabel,timeEditedLabel,viewButton);formulaList.append(formulaItem);});let createFormulaButton=$('<button class="btn btn-primary create-formula" id="create-formula">').text('Create Formula');$('#sidebar').append(formulaList,createFormulaButton);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});$('#sidebar').on('click','#create-formula',function(e){e.preventDefault();console.log('Creating a new formula')
var formData={name:'New Formula',description:'Write something inspiring here!',ingredients:[],user:userId,};$.ajax({url:'api/formula/new/',type:'POST',data:JSON.stringify(formData),headers:{'X-CSRFToken':csrftoken},contentType:'application/json; charset=utf-8',dataType:'json',success:function(data){window.location.href='/formulae/';}});});});;$(document).ready(function(){$('#sidebar').on('click','.btn-formula',function(e){e.preventDefault();$('.formula-detail').remove();var formulaId=$(this).data('id');console.log('Clicked button view for formula ID:',formulaId);$.ajax({url:'api/formula/'+formulaId+'/',method:'GET',headers:{'X-CSRFToken':csrftoken},beforeSend:function(xhr,settings){console.log('Before sending request',settings.data);},success:function(data,textStatus,xhr){console.log('Received data:',data);console.log('Status:',textStatus);console.log('Response headers:',xhr.getAllResponseHeaders());var formulaDetailItem=$('<div>').addClass('formula-detail');var formulaDetailTable=$('<table>').addClass('formula-detail-table');var nameRow=$('<tr>').append($('<td>').text('Name:'),$('<td class="editable-detail-table" id = "formula-name">').text(data.name));var descriptionRow=$('<tr>').append($('<td>').text('Description:'),$('<td class="editable-detail-table", id = "formula-description">').text(data.description));var timeEditedRow=$('<tr>').append($('<td>').text('Time Edited:'),$('<td>').text(data.updated_at));var editButton=$('<button>').addClass('btn btn-primary btn-edit-formula').text('Edit');editButton.data('id',data.id);var cancelButton=$('<button>').addClass('btn btn-primary btn-cancel-formula').text('Cancel');cancelButton.hide();var saveButton=$('<button>').addClass('btn btn-primary btn-save-formula').text('Save');saveButton.data('id',data.id);saveButton.hide();formulaDetailTable.append(nameRow,descriptionRow,timeEditedRow,editButton,saveButton,cancelButton);var formulaIngredientTable=$('<table>').addClass('formula-ingredient-table');var ingredientHeaderRow=$('<tr>').append($('<th>').text('#'),$('<th>').text('Ingredient'),$('<th>').text('Volatility'),$('<th>').text('Amount'),);formulaIngredientTable.append(ingredientHeaderRow);var counter=1;data.ingredients.forEach(function(ingredient){var ingredientRow=$('<tr>').append($('<td id="counter cell">').text(counter++).addClass('td-counter-cell'),$('<td>').text(ingredient.ingredient).addClass("td-ingredient-input").attr('id','ingredient cell '+ingredient.ingredient_id).data('id',ingredient.ingredient_id),$('<td id="volatility cell">').text(ingredient.volatility).addClass('td-volatility-cell'),$('<td id="amount cell">').text(ingredient.amount).addClass('td-regular-input'),);ingredientRow.data('id',ingredient.formula_ingredient_id)
formulaIngredientTable.append(ingredientRow)
console.log('Ingredient row:',ingredientRow.data('id'))});formulaDetailItem.append(formulaDetailTable,formulaIngredientTable);$('#main-content').append(formulaDetailItem);},error:function(xhr,status,error){console.error('Error fetching data:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});});;function setupIngredientAutocomplete(text){console.log('Setting up ingredient autocomplete')
text=text||'';let inputField=$('<input>').attr({'type':'text','id':'ingredient-input','value':text});let dropdownMenu=$('<ul>').attr('id','ingredient-dropdown').addClass('dropdown-menu');let container=$('<div>').attr('id','ingredient-autocomplete-container');container.empty().append(inputField,dropdownMenu);inputField.on('input',function(){console.log('Input field value:',$(this).val());let query=$(this).val();$.ajax({url:'/collection/api/collection/'+userId+'/?search='+query,method:'GET',headers:{'X-CSRFToken':csrftoken},success:function(data){dropdownMenu.empty();if(data.length>0){data.forEach(function(ingredient){let item=$('<li>').addClass('dropdown-item').text(ingredient.common_name);item.on('click',function(){inputField.val(ingredient.common_name);let row=$(item).closest('tr');let volatility=row.find('td:eq(2)')
let amount=row.find('td:eq(3)')
volatility.text(ingredient.volatility)
amount.data('id',ingredient.id)
console.log('Amount ID:',amount.data('id'))
let parentElement=inputField.parent();let tdIngredientInput=parentElement.closest('tr').find('.td-ingredient-input');tdIngredientInput.data('id',ingredient.id);console.log('Ingredient ID:',tdIngredientInput.data('id'))
dropdownMenu.removeClass('active');});dropdownMenu.append(item);});dropdownMenu.addClass('active');}else{let message=$('<li>').addClass('dropdown-item').text('No matching ingredients found');dropdownMenu.append(message);dropdownMenu.addClass('active');}},error:function(xhr,status,error){console.error('Error:',error);}});});return container;}
$(document).ready(function(){$('#main-content').on('click','.btn-edit-formula',function(e){e.preventDefault();console.log('Edit button clicked');let initialFormState=$('.formula-detail').clone();$('#main-content').on('click','.btn-cancel-formula',function(e){e.preventDefault();$('.formula-detail').replaceWith(initialFormState);});let formulaDetailItem=$(this).closest('.formula-detail');let formulaDetailTable=formulaDetailItem.find('.formula-detail-table');let formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');formulaDetailTable.find('.editable-detail-table').each(function(){let text=$(this).text().trim();$(this).html('<input type="text" value="'+text+'">');});formulaIngredientTable.find('.td-regular-input').each(function(){let text=$(this).text().trim();$(this).html('<input type="text" value="'+text+'">');});formulaIngredientTable.find('.td-ingredient-input').each(function(){console.log('Ingredient:',$(this).text());let text=$(this).text().trim();$(this).html(setupIngredientAutocomplete(text));console.log('set up ingredient autocomplete field meow')});let deleteButton=$('<button>').addClass('btn btn-danger btn-delete-ingredient').text('Delete Ingredient');formulaIngredientTable.find('tr:not(:first)').each(function(){let row=$(this);let deleteButtonClone=deleteButton.clone();row.append(deleteButtonClone);});let addButton=$('<button>').addClass('btn btn-primary btn-add-ingredient').text('Add Ingredient');formulaIngredientTable.append(addButton);formulaDetailItem.find('.btn-save-formula').show();formulaDetailItem.find('.btn-cancel-formula').show();$(this).hide();});$('#main-content').on('click','.btn-add-ingredient',function(e){e.preventDefault();let formulaDetailItem=$(this).closest('.formula-detail');let formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');let lastRow=formulaIngredientTable.find('tr:last');let lastCounter=parseInt(lastRow.find('.td-counter-cell').text());if(isNaN(lastCounter)){lastCounter=0;}
let newCounter=lastCounter+1;let newRow=$('<tr>').append($('<td id="counter cell">').text(newCounter).addClass('td-counter-cell'),$('<td id="ingredient cell">').addClass("td-ingredient-input").append(setupIngredientAutocomplete('')),$('<td id ="volatility cell">').append($('<td>').addClass('td-volatility-cell')),$('<td id="amount cell">').addClass("td-regular-input").append($('<input>').attr('type','text')),);formulaIngredientTable.append(newRow);});$('#main-content').on('click','.btn-delete-ingredient',function(e){e.preventDefault();console.log('Delete button clicked');let row=$(this).closest('tr');let ingredient_to_delete=row.data('id');console.log('Ingredient to delete:',ingredient_to_delete);$.ajax({url:'api/ingredient/delete/'+ingredient_to_delete+'/',method:'DELETE',headers:{'X-CSRFToken':csrftoken},success:function(response){console.log('Ingredient deleted successfully:',response);row.remove();},error:function(xhr,status,error){console.error('Error deleting ingredient:',error);console.log('Status:',status);console.log('Response headers:',xhr.getAllResponseHeaders());}});});$('#main-content').on('click','.btn-save-formula',function(e){e.preventDefault();let formulaDetailItem=$(this).closest('.formula-detail');let formulaDetailTable=formulaDetailItem.find('.formula-detail-table');let formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');formulaDetailTable.find('input').each(function(){let value=$(this).val();$(this).parent().text(value);});formulaIngredientTable.find('.td-regular-input').each(function(){let inputField=$(this).find('input');console.log('Input field:',inputField)
let inputValue=inputField.val();console.log('Input value:',inputValue)
$(this).text(inputValue);});console.log('Changing #ingredient-input')
formulaIngredientTable.find('.td-ingredient-input').each(function(){let parentElement=$(this);let inputField=parentElement.find('#ingredient-input');let inputValue=inputField.val();parentElement.text(inputValue).attr('id','ingredient cell '+parentElement.data('id'));parentElement.find('#ingredient-autocomplete-container').remove();});console.log('Removed container')
$('.btn-add-ingredient').remove();formulaDetailItem.find('.btn-edit-formula').show();$(this).hide();});});;$(document).ready(function(){$('#main-content').on('click','.btn-save-formula',function(e){e.preventDefault();console.log('Save button clicked, post speaking');var formulaDetailItem=$(this).closest('.formula-detail');var formulaDetailTable=formulaDetailItem.find('.formula-detail-table');var formulaIngredientTable=formulaDetailItem.find('.formula-ingredient-table');var formula_name=formulaDetailTable.find('#formula-name').text().trim();console.log('Formula name when clicking:',formula_name);var formula_description=formulaDetailTable.find('#formula-description').text().trim();console.log('Formula description when clicking:',formula_description);var formula_id=$(this).data('id');var ingredients=[];var data={'user':userId,'name':formula_name,'description':formula_description,'ingredients':[]};formulaIngredientTable.find('tr').each(function(index,row){if(index>0){var ingredientId=$(row).find('.td-ingredient-input').data('id');var amount=$(row).find('.td-regular-input').text().trim();data.ingredients.push({'ingredient_id':ingredientId,'amount':amount});}});sendDataToServer(formula_id,data);});});function sendDataToServer(formula_id,data){console.log("data inside the senddatatoserver:",data)
$.ajax({url:'api/formula/'+formula_id+'/',method:'PUT',headers:{'X-CSRFToken':csrftoken},data:JSON.stringify(data),success:function(response){console.log('Data received successfully:',response);},error:function(xhr,status,error){console.error('Error sending data to server:',error);}});};