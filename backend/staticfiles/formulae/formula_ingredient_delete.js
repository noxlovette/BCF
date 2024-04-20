$(document).ready(function() {
    $('#main-content').on('click', '.btn-delete-ingredient', function (e) {
        e.preventDefault();

        console.log('Delete button clicked');

        let row = $(this).closest('tr');
        let ingredient_to_delete = row.data('id');
        console.log('Ingredient to delete:', ingredient_to_delete);

        // Make AJAX call to delete ingredient
        $.ajax({
            url: 'api/ingredient/delete/' + ingredient_to_delete + '/',
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function (response) {
                console.log('Ingredient deleted successfully:', response);
                row.remove();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting ingredient:', error);
                console.log('Status:', status);
                console.log('Response headers:', xhr.getAllResponseHeaders());
            }
        });

    });
});