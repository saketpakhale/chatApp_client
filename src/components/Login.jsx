import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "./loginsignup.css";

function Login({ onIdSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loginUser() {
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("token", responseData.token);
        onIdSubmit(email);
        navigate("/");
      } else {
        setError(responseData.result);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred.");
    }
  }

  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  function handleSetPassword(e) {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      loginUser();
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div style={{height:'100vh', width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} className="background">
    <Container style={{height:'400px', width:'400px', borderRadius:"10px", background:''}} className="pl-2">
      <Row className="justify-content-md-center">
        <Col className="m-3">
          <div className="login-container">
            <h1 className="m-4" style={{display:'flex', justifyContent:'center', color:'white'}}>Login Page</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} >
              <Form.Group controlId="formBasicEmail" className="m-4" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleSetEmail}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="m-4" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                {/* <Form.Label>Password</Form.Label> */}
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleSetPassword}
                  required
                />
              </Form.Group>
                <div  style={{display:'flex', width:'100%', justifyContent:'center'}}>
              <Button variant="primary" type="submit" >
                Login
              </Button>
              </div>
            </Form>

            <p className="m-4" style={{display:'flex', justifyContent:'center', color:'white',fontSize:'20px', fontWeight:'bold'}}>
              Don't have an account   :  <Link to="/signup" style={{}}> Signup</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Login;
