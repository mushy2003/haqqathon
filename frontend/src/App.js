import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const webcamRef = useRef(null);

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
      // setAnalysis(result.analysis);
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


