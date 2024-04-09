$(document).ready(function(){var csrftoken=getCookie('csrftoken');$.ajax({url:'api/formula/list/',method:'GET',headers:{'X-CSRFToken':csrftoken},success:function(data){data.forEach(function(formula){var formulaItem=$('<div>').addClass('formula-item');var nameLabel=$('<p>').text('Name: '+formula.name);var userLabel=$('<p>').text('User: '+formula.user.username);formulaItem.append(nameLabel,userLabel);$('#formulae-list').append(formulaItem);});},error:function(xhr,status,error){console.error('Error fetching data:',error);}});});$(document).ready(function(){$('.formula-link').on('click',function(e){e.preventDefault();var formulaId=$(this).data('id');$.get('api/'+formulaId,function(data){$('#main-content').data('formulaData',data).html(data);});});});$('#create-button').on('click',function(){var formData={name:'',description:'',ingredients:[]};$.ajax({url:'/api/new/',type:'POST',data:JSON.stringify(formData),contentType:'application/json; charset=utf-8',dataType:'json',success:function(data){window.location.href='/edit-formula/'+data.id;}});});function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!==''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=$.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;};