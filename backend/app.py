from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
import io
import os
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS, cross_origin
from dentist import Dentist

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


available_dentists = {"General Dentist" : [Dentist("Dr Sammy", "General Dentist", "")],
                      "Pediatric Dentist" : [Dentist("Dr Bob", "Pediatric Dentist", "")],
                      "Orthodontist":[Dentist("Dr Mark", "Orthodontist", "")],
                      "Periodontist":[Dentist("Dr Taha", "Periodontist", "")],
                      "Endodontist":[Dentist("Dr Leonardo", "Endodontist", "")],
                      "Prosthodontist":[Dentist("Dr Manny", "Prosthodontist", "")],
                      "Cosmetic Dentist": [Dentist("Dr Rachel", "Cosmetic Dentist", "")]}


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
            "text": "Based on what you can see of the teeth, are there any issues? Please tell the issues you see. If you are unable to see clearly simply say Unable to see teeth clearly. If there are no issues, say there are no issues."
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"{base64_image}"
            }
            }
        ]
        },
        {
        "role": "user",
        "content": [
            {
            "type":"text",
            "text": "Now based on your previous response of the issues that this person has with their teeth, along with their age being 21 years old, can you suggest what dentist they should visit from the following list: [General Dentist, Pediatric Dentist, Orthodontist, Periodontist, Endodontist, Prosthodontist, Cosmetic Dentist]. Answer in the following format: {The complete answer you gave to the original question I asked before in full detail here}, then {enter a new line here}, Dentist type: {Enter dentist type here} - {Enter explanation why you have chosen that dentist type here}"
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
