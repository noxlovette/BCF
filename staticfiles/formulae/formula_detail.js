function handleSuccess(data, textStatus, jqXHR) {
    // Store the data in  main-content div
    $('#main-content').data('formulaData', data);

    // Process the data and generate HTML
    var html = '';
    data.forEach(function(ingredient, index) {
        html += '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td>' + ingredient.name + '</td>' +
            '<td>' + ingredient.volatility + '</td>' +
            '<td>' + ingredient.role + '</td>' +
            '<td>' + ingredient.concentration + '</td>' +
            '<td>' + ingredient.amount + '</td>' +
            '</tr>';
    });
    $('#main-content').html(html);

    // Access the headers
    var headers = jqXHR.getAllResponseHeaders();
    console.log(headers);
}

$.ajax({
    url: '/api/formulas/' + formulaId,
    type: 'GET',
    success: handleSuccess
});