# app.py

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import uuid

# Import the function from utils/ai_plug.py
from utils.ai_plug import generate_text_from_image

app = Flask(__name__)
CORS(app)

# 设置模板和静态文件目录
app.template_folder = 'templates'
app.static_folder = 'templates'  # 因为您的 script.js 在 templates/ 目录下

app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Route to render the index.html
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# Route to process the form data
@app.route('/process', methods=['POST'])
def process():
    try:
        location = request.form.get('location')
        image = request.files.get('image')

        if not location or not image:
            return jsonify({'error': 'Missing required parameters.'}), 400

        # Save the uploaded image temporarily
        image_filename = str(uuid.uuid4()) + "_" + image.filename
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image.save(image_path)

        # Read image data
        with open(image_path, 'rb') as img_file:
            image_data = img_file.read()

        # Generate text using ai_plug.py
        generated_text = generate_text_from_image(location, image_data)

        # Remove the temporary image file
        os.remove(image_path)

        # Return the result
        return jsonify({
            'text': generated_text
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to generate tour guide.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
