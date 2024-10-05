# app.py

from flask import Flask, request, jsonify, render_template
import os
import uuid
import traceback

# 从 utils.ai_plug 导入生成文本的函数
from utils.ai_plug import generate_text_from_image

app = Flask(__name__)

# 配置上传文件夹
app.config['UPLOAD_FOLDER'] = 'uploads'

# 确保上传文件夹存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 路由以渲染 index.html
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# 路由以处理表单数据
@app.route('/process', methods=['POST'])
def process():
    try:
        location = request.form.get('location')
        image = request.files.get('image')

        if not location or not image:
            return jsonify({'error': 'Missing required parameters.'}), 400

        # 临时保存上传的图片
        image_filename = str(uuid.uuid4()) + "_" + image.filename
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image.save(image_path)

        # 读取图片数据
        with open(image_path, 'rb') as img_file:
            image_data = img_file.read()

        # 使用 ai_plug.py 生成文本
        generated_text = generate_text_from_image(location, image_data)

        # 删除临时图片文件
        os.remove(image_path)

        # 返回结果
        return jsonify({
            'text': generated_text
        })

    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to generate tour guide.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
