from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
import io
import os
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS, cross_origin

load_dotenv()

app = Flask(__name__)

allowed_origins = [
    'http://localhost:3000',
    'https://tutoringclient.vercel.app'
]

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# Configure OpenAI API
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({"error": "No image provided"}), 400

    data = request.get_json()
    base64_image = data['image']

    try:
        # Here, you would call an image analysis service. For this example, we mock this step.
        image_analysis = analyze_image(base64_image)

        # Use GPT-4 for text analysis
        # analysis = get_gpt_analysis(image_analysis)

        # Find the specialist from a mock function
        # specialist = find_specialist(analysis)

        # return jsonify({"analysis": analysis, "specialist": specialist})
        return jsonify(image_analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def analyze_image(base64_image):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
    "model": "gpt-4o",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "Based on what you can see of the teeth, are there any issues? Please tell the issues you see."
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"{base64_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return response.json()


# def get_gpt_analysis(image_analysis):
#     response = openai.Completion.create(
#         model='text-davinci-003',
#         prompt=f"Analyze the following dental image analysis result and provide a detailed report:\n{image_analysis}",
#         max_tokens=150,
#     )
#     return response.choices[0].text.strip()

def find_specialist(analysis):
    # Mock specialist database query
    return {
        "name": "Dr. John Doe",
        "contact": "123-456-7890"
    }

if __name__ == '__main__':
    app.run(debug=True, port=4000)
