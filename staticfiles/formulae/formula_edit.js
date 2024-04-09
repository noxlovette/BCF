// Fetch the ingredients from the collection_ingredient API
var userId = sessionStorage.getItem('user_id');
$.get('/collection/api/collection', {user_id:userId} , function(data) {
    // Create an option element for each ingredient
    data.forEach(function(ingredient) {
        var option = $('<option>').val(ingredient.id).text(ingredient.name);
        // Add the option element to the select field
        $('#ingredients').append(option);
    });
});

$('#edit-formula-form').on('submit', function(event) {
    event.preventDefault();

    var formData = {
        name: $('#name').val(),
        description: $('#description').val(),
        ingredients: $('#ingredients').val()
    };

    $.ajax({
        url: '/formulae/' + formulaId,
        type: 'PUT',
        data: JSON.stringify(formData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            // Handle the response here
            console.log(data);
        }
    });
});
