// Add a click event handler to the create button
$('#create-button').on('click', function() {
    // Create an empty formula
    var formData = {
        name: '',
        description: '',
        ingredients: []
    };

    $.ajax({
        url: '/api/new/',
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            // Redirect to the editing view for the new formula
            window.location.href = '/edit-formula/' + data.id;
        }
    });
});