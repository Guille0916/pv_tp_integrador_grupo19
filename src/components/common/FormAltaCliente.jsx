import { useState } from "react";
import { Form, Button, Row, Col, Alert, Card } from "react-bootstrap";

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
  phone: "",
};

const camposObligatorios = Object.keys(estadoInicial);

const normalizarFormulario = (formData) => Object.fromEntries(
  Object.entries(formData).map(([key, value]) => [key, value.trim()])
);

const crearClienteDesdeFormulario = (datos) => ({
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
  },
  phone: datos.phone,
});

const FormAltaCliente = ({ onClienteCreado }) => {
  const [formData, setFormData] = useState(estadoInicial);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }));

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      [name]: "",
    }));
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
      nuevosErrores.password = "La Contrasena debe tener al menos 4 caracteres.";
    }

    if (datos.number && (Number.isNaN(Number(datos.number)) || Number(datos.number) <= 0)) {
      nuevosErrores.number = "Ingresa un numero valido.";
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

    const nuevoCliente = crearClienteDesdeFormulario(datos);

    try {
      const response = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoCliente),
      });

      const data = await response.json();

      if (response.ok) {
        const clienteCreado = {
          ...nuevoCliente,
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
      } else {
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
    <Card className="registro-form-card">
      <Card.Body>
        <div className="registro-form-heading">
          <span className="registro-form-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
              <path d="M4 21a8 8 0 0 1 16 0" />
              <path d="M19 8v6M16 11h6" />
            </svg>
          </span>
          <div>
            <Card.Title>Registrar cliente</Card.Title>
          </div>
        </div>

        <Form noValidate onSubmit={handleSubmit}>
          <div className="registro-form-section">
            <div className="registro-section-head">
              <span>Datos personales</span>
            </div>
            <Row>
              <Col md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.firstname)}
                    name="firstname"
                    onChange={handleChange}
                    placeholder="Nombre del cliente"
                    required
                    value={formData.firstname}
                  />
                  <Form.Control.Feedback type="invalid">{errores.firstname}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.lastname)}
                    name="lastname"
                    onChange={handleChange}
                    placeholder="Apellido del cliente"
                    required
                    value={formData.lastname}
                  />
                  <Form.Control.Feedback type="invalid">{errores.lastname}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.email)}
                    name="email"
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                    type="email"
                    value={formData.email}
                  />
                  <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.phone)}
                    name="phone"
                    onChange={handleChange}
                    placeholder="Telefono de contacto"
                    required
                    value={formData.phone}
                  />
                  <Form.Control.Feedback type="invalid">{errores.phone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="registro-form-section">
            <div className="registro-section-head">
              <span>Cuenta y ubicacion</span>
            </div>
            <Row>
              <Col md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.username)}
                    name="username"
                    onChange={handleChange}
                    placeholder="Nombre de usuario"
                    required
                    value={formData.username}
                  />
                  <Form.Control.Feedback type="invalid">{errores.username}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Contrasena</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.password)}
                    name="password"
                    onChange={handleChange}
                    placeholder="Clave de acceso"
                    required
                    type="password"
                    value={formData.password}
                  />
                  <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Select
                    isInvalid={Boolean(errores.city)}
                    name="city"
                    onChange={handleChange}
                    required
                    value={formData.city}
                  >
                    <option value="" disabled>Ciudad</option>
                    <option value="San Salvador de Jujuy">San Salvador de Jujuy</option>
                    <option value="Palpala">Palpala</option>
                    <option value="El Carmen">El Carmen</option>
                    <option value="San Pedro de Jujuy">San Pedro de Jujuy</option>
                    <option value="Libertador General San Martin">Libertador General San Martin</option>
                    <option value="La Quiaca">La Quiaca</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.city}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Calle</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.street)}
                    name="street"
                    onChange={handleChange}
                    placeholder="Calle"
                    required
                    value={formData.street}
                  />
                  <Form.Control.Feedback type="invalid">{errores.street}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Numero</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.number)}
                    name="number"
                    onChange={handleChange}
                    placeholder="Altura"
                    required
                    type="number"
                    value={formData.number}
                  />
                  <Form.Control.Feedback type="invalid">{errores.number}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} lg={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Codigo postal</Form.Label>
                  <Form.Control
                    isInvalid={Boolean(errores.zipcode)}
                    name="zipcode"
                    onChange={handleChange}
                    placeholder="Codigo postal"
                    required
                    value={formData.zipcode}
                  />
                  <Form.Control.Feedback type="invalid">{errores.zipcode}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="registro-form-actions">
            <Button className="registro-submit" disabled={enviando} variant="primary" type="submit">
              <span>{enviando ? "Guardando..." : "Agregar Cliente"}</span>
              <svg className="btn-icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Button>

            {mensaje && (
              <Alert className="registro-alert registro-alert-bottom" variant={tipoMensaje}>
                {mensaje}
              </Alert>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );

};


export default FormAltaCliente;

