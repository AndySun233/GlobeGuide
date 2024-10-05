// Display selected file name
document.getElementById('image').addEventListener('change', function(event) {
    var fileName = event.target.files[0]?.name || '';
    document.getElementById('file-name').textContent = fileName;
});

document.getElementById('tour-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var location = document.getElementById('location').value;
    var image = document.getElementById('image').files[0];

    if (!location || !image) {
        alert('Please enter the location name and upload an image.');
        return;
    }

    var formData = new FormData();
    formData.append('location', location);
    formData.append('image', image);

    // Show loading message
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Generating the tour guide, please wait...</p>';

    // Send request to the backend
    fetch('/process', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(data) {
        // Display the result from the backend
        resultDiv.innerHTML = '';

        // Display the textual description
        var textParagraph = document.createElement('p');
        textParagraph.textContent = data.text;
        resultDiv.appendChild(textParagraph);

        // Display the audio guide
        if (data.audio_url) {
            var audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.src = data.audio_url;
            resultDiv.appendChild(audioPlayer);
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>Sorry, an error occurred while generating the tour guide.</p>';
    });
});
