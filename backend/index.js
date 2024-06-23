const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const cors = require('cors');


const app = express();
app.use(express.json());
const allowedOrigins = [
    'http://localhost:3000'
];
app.use(cors({ credentials: true, origin: allowedOrigins }));
const port = 4000;
const upload = multer({ dest: 'uploads/' });
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);

app.post('/analyze', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;

    try {
        const imageBuffer = fs.readFileSync(imagePath);
        // Convert the image to a base64 encoded string
        const base64Image = imageBuffer.toString('base64');
        // Here, you would call an image analysis service. For this example, we mock this step.
        const imageAnalysis = await analyzeImage(base64Image);

        // // Use GPT-4 for text analysis
        // const analysis = await getGPTAnalysis(imageAnalysis);

        // // Find the specialist from a mock function
        // const specialist = await findSpecialist(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up the uploaded file
        fs.unlinkSync(imagePath);
    }
});

const analyzeImage = async (base64Image) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "Does the picture show any dental issues?" },
                    {
                        type: "image_url",
                        image_url: {
                            "url": base64Image,
                        },
                    },
                ],
            },
        ],
    });
    console.log(response.choices[0]);
    return response.choices[0];
};




const getGPTAnalysis = async (imageAnalysis) => {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Analyze the following dental image analysis result and provide a detailed report:\n${imageAnalysis}`,
        max_tokens: 150,
    });
    return response.data.choices[0].text.trim();
};

const findSpecialist = async (analysis) => {
    // Mock specialist database query
    return {
        name: 'Dr. John Doe',
        contact: '123-456-7890'
    };
};

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
