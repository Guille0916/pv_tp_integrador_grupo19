import React, { useState } from 'react';

import { Form, Button, Card, Alert } from 'react-bootstrap';

export default function FormularioCliente() {
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    city: ''
  });

  
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setShowAlert(false);

    try {
      
      const response = await fetch('https://fakestoreapi.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          name: {
            firstname: formData.firstname,
            lastname: formData.lastname
          },
          address: {
            city: formData.city
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        setSuccessMessage(`¡Cliente creado con éxito! ID asignado por el servidor: ${data.id}`);
        setIsError(false);
        setShowAlert(true);
        
        
        setFormData({ email: '', username: '', firstname: '', lastname: '', city: '' });
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setSuccessMessage("Hubo un problema al conectar con el servidor. Inténtalo de nuevo.");
      setIsError(true);
      setShowAlert(true);
    }
  };

  return (
    <Card className="shadow-sm p-4 my-3">
      <Card.Title className="mb-4 text-primary">Alta de Nuevo Cliente</Card.Title>
      
      {/* Alerta temporal de feedback visual requerida por la cátedra */}
      {showAlert && (
        <Alert variant={isError ? "danger" : "success"} onClose={() => setShowAlert(false)} dismissible>
          {successMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formFirstname">
          <Form.Label>Nombre</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ej: Juan" 
            name="firstname" 
            value={formData.firstname} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formLastname">
          <Form.Label>Apellido</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ej: Pérez" 
            name="lastname" 
            value={formData.lastname} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="usuario@correo.com" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ej: juan.perez" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formCity">
          <Form.Label>Ciudad</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ej: San Salvador de Jujuy" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Dar de Alta Cliente
        </Button>
      </Form>
    </Card>
  );
}