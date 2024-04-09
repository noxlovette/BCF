$(document).ready(function(){$.ajax({url:'api/formula/list',method:'GET',success:function(data){data.forEach(function(formula){var formulaItem=$('<div>').addClass('formula-item');var nameLabel=$('<p>').text('Name: '+formula.name);var userLabel=$('<p>').text('User: '+formula.user.username);formulaItem.append(nameLabel,userLabel);$('#formulae-list').append(formulaItem);});},error:function(xhr,status,error){console.error('Error fetching data:',error);}});});$(document).ready(function(){$('.formula-link').on('click',function(e){e.preventDefault();var formulaId=$(this).data('id');$.get('api/'+formulaId,function(data){$('#main-content').data('formulaData',data).html(data);});});});$('#create-button').on('click',function(){var formData={name:'',description:'',ingredients:[]};$.ajax({url:'/api/new/',type:'POST',data:JSON.stringify(formData),contentType:'application/json; charset=utf-8',dataType:'json',success:function(data){window.location.href='/edit-formula/'+data.id;}});});;var userId=sessionStorage.getItem('user_id');$.get('collection/api/collection',{user_id:userId},function(data){data.forEach(function(ingredient){var option=$('<option>').val(ingredient.id).text(ingredient.name);$('#ingredients').append(option);});});$('#edit-formula-form').on('submit',function(event){event.preventDefault();var formData={name:$('#name').val(),description:$('#description').val(),ingredients:$('#ingredients').val()};$.ajax({url:'/formulae/'+formulaId,type:'PUT',data:JSON.stringify(formData),contentType:'application/json; charset=utf-8',dataType:'json',success:function(data){console.log(data);}});});;function handleSuccess(data,textStatus,jqXHR){$('#main-content').data('formulaData',data);var html='';data.forEach(function(ingredient,index){html+='<tr>'+'<td>'+(index+1)+'</td>'+'<td>'+ingredient.name+'</td>'+'<td>'+ingredient.volatility+'</td>'+'<td>'+ingredient.role+'</td>'+'<td>'+ingredient.concentration+'</td>'+'<td>'+ingredient.amount+'</td>'+'</tr>';});$('#main-content').html(html);var headers=jqXHR.getAllResponseHeaders();console.log(headers);}
$.ajax({url:'/api/formulas/'+formulaId,type:'GET',success:handleSuccess});;