$(document).ready(function() {
    // Event listener for the form submission
    $('#food-form').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        var query = $('#food-input').val(); // Get the input value

        // AJAX request to Nutritionix API to fetch food nutrition data
        $.ajax({
            url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
            method: 'POST',
            headers: {
                'x-app-id': 'APP_ID', // Nutritionix app ID
                'x-app-key': 'APP_KEY' // Nutritionix app key
            },
            data: {
                query: query
            },
            success: function(data) {
                var food = data.foods[0];
                // Display the nutrition information in a table format
                $('#nutrition').html(`
                    <table class="table">
                        <tr><th>Food</th><td>${food.food_name}</td></tr>
                        <tr><th>Calories</th><td>${food.nf_calories}</td></tr>
                        <tr><th>Protein</th><td>${food.nf_protein}g</td></tr>
                        <tr><th>Carbohydrates</th><td>${food.nf_total_carbohydrate}g</td></tr>
                        <tr><th>Fats</th><td>${food.nf_total_fat}g</td></tr>
                    </table>
                `);
            },
            error: function(error) {
                // Display an error message if the API request fails
                $('#nutrition').html(`<p>Error: ${error.responseText}</p>`);
            }
        });
    });
});
