import os
from mistralai import Mistral

api_key = "pqmKVrIjJjkKQMhvRslPapP7QzNV2A1I"

model = "pixtral-12b-2409"

client = Mistral(api_key=api_key)

chat_response = client.chat.complete(
    model= model,
    messages = messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What's in this image?"
                },
                {
                    "type": "image_url",
                    "image_url": "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg"
                }
            ]
        }
    ]
)
print(chat_response.choices[0].message.content)