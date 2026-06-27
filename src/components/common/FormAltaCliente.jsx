import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";

const estadoInicial = {
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
};

const camposObligatorios = [
  "firstname",
  "lastname",
  "email",
  "username",
  "password",
  "city",
  "street",
  "number",
  "zipcode",
  "lat",
  "long",
  "phone",
];

const normalizarFormulario = (formData) => Object.fromEntries(
  Object.entries(formData).map(([key, value]) => [key, value.trim()])
);

const FormAltaCliente = ({ onClienteCreado }) => {

  const [formData, setFormData] = useState(estadoInicial);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrores({
      ...errores,
      [e.target.name]: "",
    });
  };

  const validarFormulario = (datos) => {
    const nuevosErrores = {};

    camposObligatorios.forEach((campo) => {
      if (!datos[campo]) {
        nuevosErrores[campo] = "Este campo es obligatorio.";
      }
    });

    if (datos.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      nuevosErrores.email = "Ingresa un email valido.";
    }

    if (datos.password && datos.password.length < 4) {
      nuevosErrores.password = "La contrasena debe tener al menos 4 caracteres.";
    }

    if (datos.number && (Number.isNaN(Number(datos.number)) || Number(datos.number) <= 0)) {
      nuevosErrores.number = "Ingresa un numero valido.";
    }

    if (datos.lat && Number.isNaN(Number(datos.lat))) {
      nuevosErrores.lat = "Ingresa una latitud valida.";
    }

    if (datos.long && Number.isNaN(Number(datos.long))) {
      nuevosErrores.long = "Ingresa una longitud valida.";
    }

    if (datos.phone && datos.phone.length < 6) {
      nuevosErrores.phone = "Ingresa un telefono valido.";
    }

    return nuevosErrores;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const datos = normalizarFormulario(formData);
    const erroresFormulario = validarFormulario(datos);

    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario);
      setTipoMensaje("danger");
      setMensaje("Completa todos los datos correctamente antes de agregar el cliente.");
      return;
    }

    setEnviando(true);

    const nuevoCliente = {
      email: datos.email,
      username: datos.username,
      password: datos.password,

      name: {
        firstname: datos.firstname,
        lastname: datos.lastname,
      },

      address: {
        city: datos.city,
        street: datos.street,
        number: Number(datos.number),
        zipcode: datos.zipcode,

        geolocation: {
          lat: datos.lat,
          long: datos.long,
        },
      },

      phone: datos.phone,
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
        const clienteCreado = {
          ...nuevoCliente,
          id: `local-${Date.now()}`,
          apiId: data.id ?? null,
          creadoLocalmente: true,
        };

        const nombreCompleto = `${clienteCreado.name.firstname} ${clienteCreado.name.lastname}`;

        onClienteCreado?.(clienteCreado);
        setTipoMensaje("success");
        setMensaje(`Se registro ${nombreCompleto} correctamente.`);
        setErrores({});
        setFormData(estadoInicial);
        setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 3000);
      }
      else{
        setTipoMensaje("danger");
        setMensaje("No se pudo crear el cliente");
      }


    } catch {

      setTipoMensaje("danger");
      setMensaje("Error de conexion");

    } finally {
      setEnviando(false);
    }

  };


  return (

    <Container className="registro-form-container mt-4">


      <Card className="registro-form-card">

        <Card.Body>

          <Card.Title>
            Registrar cliente
          </Card.Title>


          {mensaje && 
            <Alert variant={tipoMensaje}>
              {mensaje}
            </Alert>
          }


          <Form noValidate onSubmit={handleSubmit}>


            <Row>


              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Nombre
                  </Form.Label>

                  <Form.Control
                    isInvalid={Boolean(errores.firstname)}
                    name="firstname"
                    onChange={handleChange}
                    required
                    value={formData.firstname}
                  />
                  <Form.Control.Feedback type="invalid">{errores.firstname}</Form.Control.Feedback>

                </Form.Group>
              </Col>



              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Apellido
                  </Form.Label>

                  <Form.Control
                    isInvalid={Boolean(errores.lastname)}
                    name="lastname"
                    onChange={handleChange}
                    required
                    value={formData.lastname}
                  />
                  <Form.Control.Feedback type="invalid">{errores.lastname}</Form.Control.Feedback>

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
                    isInvalid={Boolean(errores.email)}
                    name="email"
                    onChange={handleChange}
                    required
                    type="email"
                    value={formData.email}
                  />
                  <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>

                </Form.Group>

              </Col>



              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Usuario
                  </Form.Label>

                  <Form.Control
                    isInvalid={Boolean(errores.username)}
                    name="username"
                    onChange={handleChange}
                    required
                    value={formData.username}
                  />
                  <Form.Control.Feedback type="invalid">{errores.username}</Form.Control.Feedback>

                </Form.Group>

              </Col>

            </Row>



            <Form.Group className="mb-3">

              <Form.Label>
                Contraseña
              </Form.Label>

              <Form.Control
                isInvalid={Boolean(errores.password)}
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={formData.password}
              />
              <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>

            </Form.Group>




            <Row>

                <Col md={6}>
  <Form.Group className="mb-3">
    <Form.Label>Ciudad</Form.Label>
    <Form.Select
      isInvalid={Boolean(errores.city)}
      name="city"
      onChange={handleChange}
      required
      value={formData.city}
    >
      <option value="" disabled>Selecciona tu ciudad...</option>
      <option value="San Salvador de Jujuy">San Salvador de Jujuy</option>
      <option value="Palpalá">Palpalá</option>
      <option value="El Carmen">El Carmen</option>
      <option value="San Pedro de Jujuy">San Pedro de Jujuy</option>
      <option value="Libertador General San Martín">Libertador General San Martín</option>
      <option value="La Quiaca">La Quiaca</option>
    </Form.Select>
    <Form.Control.Feedback type="invalid">{errores.city}</Form.Control.Feedback>
  </Form.Group>
</Col>

              


              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Calle
                  </Form.Label>

                  <Form.Control
                    isInvalid={Boolean(errores.street)}
                    name="street"
                    onChange={handleChange}
                    required
                    value={formData.street}
                  />
                  <Form.Control.Feedback type="invalid">{errores.street}</Form.Control.Feedback>

                </Form.Group>

              </Col>


            </Row>




            <Row>

              <Col md={4}>

                <Form.Control
                  className="mb-3"
                  isInvalid={Boolean(errores.number)}
                  name="number"
                  onChange={handleChange}
                  placeholder="Numero"
                  required
                  type="number"
                  value={formData.number}
                />
                <Form.Control.Feedback type="invalid">{errores.number}</Form.Control.Feedback>

              </Col>


              <Col md={4}>

                <Form.Control
                  className="mb-3"
                  isInvalid={Boolean(errores.zipcode)}
                  name="zipcode"
                  onChange={handleChange}
                  placeholder="Codigo postal"
                  required
                  value={formData.zipcode}
                />
                <Form.Control.Feedback type="invalid">{errores.zipcode}</Form.Control.Feedback>

              </Col>


              <Col md={4}>

                <Form.Control
                  className="mb-3"
                  isInvalid={Boolean(errores.phone)}
                  name="phone"
                  onChange={handleChange}
                  placeholder="Telefono"
                  required
                  value={formData.phone}
                />
                <Form.Control.Feedback type="invalid">{errores.phone}</Form.Control.Feedback>

              </Col>


            </Row>




            <Row>

              <Col>

                <Form.Control
                  className="mb-3"
                  isInvalid={Boolean(errores.lat)}
                  name="lat"
                  onChange={handleChange}
                  placeholder="Latitud"
                  required
                  type="number"
                  value={formData.lat}
                />
                <Form.Control.Feedback type="invalid">{errores.lat}</Form.Control.Feedback>

              </Col>


              <Col>

                <Form.Control
                  className="mb-3"
                  isInvalid={Boolean(errores.long)}
                  name="long"
                  onChange={handleChange}
                  placeholder="Longitud"
                  required
                  type="number"
                  value={formData.long}
                />
                <Form.Control.Feedback type="invalid">{errores.long}</Form.Control.Feedback>

              </Col>


            </Row>



            <Button className="registro-submit" disabled={enviando} variant="primary" type="submit">
              {enviando ? "Guardando..." : "Agregar Cliente"}
            </Button>


          </Form>


        </Card.Body>

      </Card>


    </Container>

  );

};


export default FormAltaCliente;
