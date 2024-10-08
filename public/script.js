// Display selected file name
document.getElementById('image').addEventListener('change', function(event) {
    var fileName = event.target.files[0]?.name || '';
    document.getElementById('file-name').textContent = fileName;
});

document.getElementById('tour-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默认的表单提交行为

    var location = document.getElementById('location').value;
    var image = document.getElementById('image').files[0];

    if (!location || !image) {
        alert('Please enter the location name and upload an image.');
        return;
    }

    var formData = new FormData();
    formData.append('location', location);
    formData.append('image', image);

    // 显示加载消息
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Generating the tour guide, please wait...</p>';

    // 发送请求到后端，使用相对路径
    fetch('/process', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        console.log('Received response:', response);
        
        // 检查响应的状态
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status + ' ' + response.statusText);
        }
        
        // 尝试解析JSON
        return response.json().catch(function(err) {
            throw new Error('Failed to parse JSON: ' + err.message);
        });
    })
    .then(function(data) {
        console.log('Parsed JSON data:', data);
    
        // 清除之前的结果
        resultDiv.innerHTML = '';
    
        // 检查是否有错误信息
        if (data.error) {
            console.error('Server returned an error:', data.error);
            resultDiv.innerHTML = '<p>Error: ' + data.error + '</p>';
            return;
        }
    
        // 显示文本描述
        var textParagraph = document.createElement('p');
        textParagraph.textContent = data.text;
        resultDiv.appendChild(textParagraph);
    
        // 如果需要处理音频，可以在这里添加相关代码
    })
    .catch(function(error) {
        console.error('Error during fetch or processing:', error);
        resultDiv.innerHTML = '<p>Sorry, an error occurred while generating the tour guide. Error: ' + error.message + '</p>';
    });
    
});
