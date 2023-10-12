import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import useLocalStorage from '../../@hooks/useLocalStorage';

export default function UserLoginModal({ isDisplay = false }: { isDisplay: boolean }) {
  const [show, setShow] = useState(isDisplay);
  const [userName, setuserName] = useState('');
  const [validated, setValidated] = useState(false);
  const [_user, setUser] = useLocalStorage('user', {});

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    setValidated(true);
    setUser({ userName });
    handleClose(); // Close Modal
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Hi, We don&apos;t know you &#128517;</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="login.name">
            <Form.Label>Your Nick Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Radha"
              isInvalid={!userName}
              onChange={(e) => setuserName(e.target.value)} />
            <Form.Text id="passwordHelpBlock" muted>
              This will visible to others while chat.
            </Form.Text>
          </Form.Group>

          <Button variant="outline-dark" type='submit'>Save</Button>
        </Form>
      </Modal.Body>
    </Modal >
  );
}
