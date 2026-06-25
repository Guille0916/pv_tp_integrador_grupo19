import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";

const FormAltaCliente = () => {

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    city: "",
    street: "",
    number: "",
    zipcode: "",
    lat: "",
    long: "",
    phone: "",
  });

  const [mensaje, setMensaje] = useState("");


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoCliente = {
      email: formData.email,
      username: formData.username,
      password: formData.password,

      name: {
        firstname: formData.firstname,
        lastname: formData.lastname,
      },

      address: {
        city: formData.city,
        street: formData.street,
        number: Number(formData.number),
        zipcode: formData.zipcode,

        geolocation: {
          lat: formData.lat,
          long: formData.long,
        },
      },

      phone: formData.phone,
    };


    try {

      const response = await fetch(
        "https://fakestoreapi.com/users",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify(nuevoCliente)
        }
      );


      const data = await response.json();


      if(response.ok){
        setMensaje(`Cliente creado correctamente. ID: ${data.id}`);
      }
      else{
        setMensaje("No se pudo crear el cliente");
      }


    } catch(error){

      setMensaje("Error de conexión");

    }

  };


  return (

    <Container className="mt-4">


      <Card>

        <Card.Body>

          <Card.Title>
            Alta de Cliente
          </Card.Title>


          {mensaje && 
            <Alert variant="success">
              {mensaje}
            </Alert>
          }


          <Form onSubmit={handleSubmit}>


            <Row>


              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Nombre
                  </Form.Label>

                  <Form.Control
                    name="firstname"
                    onChange={handleChange}
                  />

                </Form.Group>
              </Col>



              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Apellido
                  </Form.Label>

                  <Form.Control
                    name="lastname"
                    onChange={handleChange}
                  />

                </Form.Group>
              </Col>


            </Row>




            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                  />

                </Form.Group>

              </Col>



              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Usuario
                  </Form.Label>

                  <Form.Control
                    name="username"
                    onChange={handleChange}
                  />

                </Form.Group>

              </Col>

            </Row>



            <Form.Group className="mb-3">

              <Form.Label>
                Contraseña
              </Form.Label>

              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
              />

            </Form.Group>




            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Ciudad
                  </Form.Label>

                  <Form.Control
                    name="city"
                    onChange={handleChange}
                  />

                </Form.Group>

              </Col>


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Calle
                  </Form.Label>

                  <Form.Control
                    name="street"
                    onChange={handleChange}
                  />

                </Form.Group>

              </Col>


            </Row>




            <Row>

              <Col md={4}>

                <Form.Control
                  className="mb-3"
                  placeholder="Número"
                  name="number"
                  onChange={handleChange}
                />

              </Col>


              <Col md={4}>

                <Form.Control
                  className="mb-3"
                  placeholder="Código Postal"
                  name="zipcode"
                  onChange={handleChange}
                />

              </Col>


              <Col md={4}>

                <Form.Control
                  className="mb-3"
                  placeholder="Teléfono"
                  name="phone"
                  onChange={handleChange}
                />

              </Col>


            </Row>




            <Row>

              <Col>

                <Form.Control
                  className="mb-3"
                  placeholder="Latitud"
                  name="lat"
                  onChange={handleChange}
                />

              </Col>


              <Col>

                <Form.Control
                  className="mb-3"
                  placeholder="Longitud"
                  name="long"
                  onChange={handleChange}
                />

              </Col>


            </Row>



            <Button variant="primary" type="submit">
              Agregar Cliente
            </Button>


          </Form>


        </Card.Body>

      </Card>


    </Container>

  );

};


export default FormAltaCliente;