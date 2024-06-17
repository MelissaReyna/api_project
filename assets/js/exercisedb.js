$(document).ready(function() {
    // Define temperature ranges and corresponding exercises
    const exerciseCategories = {
        cold: ['waist', 'upper legs', 'lower legs', 'back', 'chest'],
        moderate: ['waist', 'upper legs', 'lower legs', 'back', 'chest', 'shoulders', 'arms'],
        hot: ['waist', 'upper legs', 'lower legs', 'back', 'chest', 'shoulders', 'arms']
    };

    // Function to fetch exercises from ExerciseDB API
    function fetchExercises() {
        return $.ajax({
            url: 'https://exercisedb.p.rapidapi.com/exercises',
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
                'X-RapidAPI-Key': 'API_KEY'
            }
        });
    }

    // Function to fetch weather data based on coordinates
    function fetchWeather(lat, lon) {
        return $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather',
            data: {
                lat: lat,
                lon: lon,
                appid: 'API_KEY',
                units: 'metric'
            }
        });
    }

    // Function to display exercises based on temperature
    function displayExercises(exercises, temperature) {
        $('#exercises').empty();

        let suitableExercises = [];

        if (temperature < 10) {
            suitableExercises = exercises.filter(exercise => {
                return exerciseCategories.cold.some(category => {
                    return exercise.bodyPart.toLowerCase().includes(category);
                });
            });
        } else if (temperature >= 10 && temperature <= 25) {
            suitableExercises = exercises.filter(exercise => {
                return exerciseCategories.moderate.some(category => {
                    return exercise.bodyPart.toLowerCase().includes(category);
                });
            });
        } else {
            suitableExercises = exercises.filter(exercise => {
                return exerciseCategories.hot.some(category => {
                    return exercise.bodyPart.toLowerCase().includes(category);
                });
            });
        }

        if (suitableExercises.length === 0) {
            $('#exercises').html('<p>No suitable exercises found for the current temperature.</p>');
        } else {
            suitableExercises.forEach(function(exercise) {
                $('#exercises').append(`
                    <div class="card">
                        <img src="${exercise.gifUrl}" alt="${exercise.name}" class="card-img">
                        <h5 class="card-title">${exercise.name}</h5>
                        <p class="card-text">Target Muscle: ${exercise.target}</p>
                        <p class="card-text">Equipment: ${exercise.equipment}</p>
                    </div>
                `);
            });
        }
    }

    // Get user's location and fetch weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            $.when(fetchExercises(), fetchWeather(lat, lon)).done(function(exercisesResponse, weatherResponse) {
                var exercises = exercisesResponse[0];
                console.log('Fetched Exercises:', exercises);  // Log the fetched exercises
                var temperature = weatherResponse[0].main.temp;
                console.log('Current Temperature:', temperature);  // Log the current temperature
                displayExercises(exercises, temperature);

                $('#weather').html(`
                    <div class="alert alert-info">
                        <h4>${weatherResponse[0].name}</h4>
                        <p>${weatherResponse[0].weather[0].description}</p>
                        <p>Temperature: ${temperature}°C</p>
                    </div>
                `);
            }).fail(function(err) {
                console.error('Error:', err);
                $('#weather').html('<p class="alert alert-danger">Unable to retrieve weather or exercise data.</p>');
            });
        }, function(error) {
            console.error('Error getting location:', error);
            $('#weather').html('<p class="alert alert-danger">Unable to retrieve your location. Please enable location services and try again.</p>');
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        $('#weather').html('<p class="alert alert-danger">Geolocation is not supported by this browser.</p>');
    }
});
