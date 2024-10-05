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
    fetch('http://localhost:5000/process', {
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
        // Clear previous result
        resultDiv.innerHTML = '';

        if (data.error) {
            resultDiv.innerHTML = '<p>Error: ' + data.error + '</p>';
            return;
        }

        // Display the textual description
        var textParagraph = document.createElement('p');
        textParagraph.textContent = data.text;
        resultDiv.appendChild(textParagraph);

        // Since we're not handling audio, remove any audio-related code
    })
    .catch(function(error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>Sorry, an error occurred while generating the tour guide.</p>';
    });
});
