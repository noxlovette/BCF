$(document).ready(function() {
    $('.formula-link').on('click', function(e) {
        e.preventDefault();

        var formulaId = $(this).data('id');

        $.get('api/' + formulaId, function(data) {
            // Store the data in  main-content div
            $('#main-content').data('formulaData', data);
            $('#main-content').html(data);
        });
    });
});

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