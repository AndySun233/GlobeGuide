import os
from mistralai import Mistral

api_key = "pqmKVrIjJjkKQMhvRslPapP7QzNV2A1I"
model = "pixtral-12b-2409"

client = Mistral(api_key=api_key)

def generate_text_from_image(location, image_data):
    """
    Calls the Mistral AI API to generate text based on the location and image.

    Args:
        location (str): The name of the location.
        image_data (bytes): The image data in bytes.

    Returns:
        str: The generated text description.
    """
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Tell me about this image in this {location}."
                },
                {
                    "type": "image",
                    "image": image_data 
                }
            ]
        }
    ]

    # Call Mistral AI API
    chat_response = client.chat.complete(
        model=model,
        messages=messages
    )

    generated_text = chat_response.choices[0].message.content
    return generated_text
