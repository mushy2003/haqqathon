import React, { useState, useRef, useCallback } from 'react';
import { Container, Row, Col, Button, Modal, Navbar, Form, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import Webcam from 'react-webcam';
import Dentist from './dentist';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const webcamRef = useRef(null);


  const availableDentists = {
    "General Dentist": [new Dentist("Dr Sammy", "General Dentist")],
    "Pediatric Dentist": [new Dentist("Dr Bob", "Pediatric Dentist")],
    "Orthodontist": [new Dentist("Dr Mark", "Orthodontist")],
    "Periodontist": [new Dentist("Dr Taha", "Periodontist")],
    "Endodontist": [new Dentist("Dr Leonardo", "Endodontist")],
    "Prosthodontist": [new Dentist("Dr Manny", "Prosthodontist")],
    "Cosmetic Dentist": [new Dentist("Dr Rachel", "Cosmetic Dentist")]
  };

  function extractDentistType(text) {
    const regex = /Dentist type: ([\w\s]+) -/;
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
      setShowModal(true);
      // setSpecialist(result.specialist);
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Dental Health Analysis</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>Take a photo of your teeth</Card.Title>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                />
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="primary" onClick={capture}>
                    Capture Photo
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Anslysis Result
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {analysis && (
            <Card className="mb-3">
              <Card.Body>
                <Card.Text>{analysis}</Card.Text>
              </Card.Body>
            </Card>
          )}
          {specialist && (
            <Card className="mt-3">
              <Card.Header as="h5">Recommended Specialist</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Name:</strong> {specialist.name}</ListGroup.Item>
                <ListGroup.Item><strong>Speciality:</strong> {specialist.specialty}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>Contact:</strong>
                  <a href={specialist.contact} target="_blank" rel="noopener noreferrer">
                    {specialist.contact}
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} variant='outline-dark'>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;


