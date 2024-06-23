import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Dentist from './dentist';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const webcamRef = useRef(null);


  const availableDentists = {
    "General Dentist": [new Dentist("Dr Sammy", "General Dentist", "")],
    "Pediatric Dentist": [new Dentist("Dr Bob", "Pediatric Dentist", "")],
    "Orthodontist": [new Dentist("Dr Mark", "Orthodontist", "")],
    "Periodontist": [new Dentist("Dr Taha", "Periodontist", "")],
    "Endodontist": [new Dentist("Dr Leonardo", "Endodontist", "")],
    "Prosthodontist": [new Dentist("Dr Manny", "Prosthodontist", "")],
    "Cosmetic Dentist": [new Dentist("Dr Rachel", "Cosmetic Dentist", "")]
  };

  function extractDentistType(text) {
    const regex = /Dentist type: ([^ -]+ [^ -]+) -/;
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    handleSubmit(imageSrc);
  }, [webcamRef]);

  const handleSubmit = async (imageSrc) => {
    try {
      const response = await fetch('http://127.0.0.1:4000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const content = result.choices[0].message.content;


      const type = extractDentistType(content)
      const doc = availableDentists[type][0]


      setSpecialist(doc);
      setAnalysis(content);
      // setSpecialist(result.specialist);
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  return (
    <div className="App">
      <h1>Dental Health Analysis</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Capture Photo</button>
      {analysis && (
        <div>
          <h2>Analysis Result:</h2>
          <p>{analysis}</p>
          {specialist && (
            <div>
              <h2>Recommended Specialist:</h2>
              <p>Name: {specialist.name}</p>
              <p>Contact: {specialist.contact}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;


