import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./loginsignup.css";
import config from "../config/config";

function SignUp() {

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cnfPassword, setCnfPassword] = useState("");
    const navigate = useNavigate();
    const backendUrl = config.backendUrl;

    async function signupUser() {
        const data = {
            email: email,
            password: password,
            cnfPassword: cnfPassword,
        }
        await fetch(`${backendUrl}/signup`, {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        }).then ((data) => {
            return data.json();
        }).then ((data)=> {
            if(data.result==="Password and Confirm Password not matching") {
                alert(data.result);
            } else {
                alert(data.result);
                navigate("/login");
            }
        })
        
    }

    function handleSetEmail(e) {
        setEmail(e.target.value)

    }

    function handleSetPassword(e) {
        setPassword(e.target.value)
    }

    function handleSetCnfPassword(e) {
        setCnfPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(email!=="" && password!=="" && cnfPassword!=="") {
            signupUser();
        }
        
        setEmail("");
        setPassword(""); 
        setCnfPassword("");       
    } 

    return (
        <>
        
            <div style={{height:'100vh', width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} className="background">
            <Container style={{height:'400px', width:'400px', borderRadius:"10px", background:''}} className="pl-2">
              <Row className="justify-content-md-center">
                <Col className="m-3">
                  <div className="login-container">
                    <h1 className="m-4" style={{display:'flex', justifyContent:'center', color:'white'}}>SignUp Page</h1>
                    
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

                      <Form.Group controlId="formBasicPassword" className="m-4" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        {/* <Form.Label>Password</Form.Label> */}
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password"
                          value={cnfPassword}
                          onChange={handleSetCnfPassword}
                          required
                        />
                      </Form.Group>
                        <div  style={{display:'flex', width:'100%', justifyContent:'center'}}>
                      <Button variant="primary" type="submit" >
                        Signup
                      </Button>
                      </div>
                    </Form>
        
                    <p className="m-4" style={{display:'flex', justifyContent:'center', color:'white',fontSize:'20px', fontWeight:'bold'}}>
                      Already have an account   :  <Link to="/Login" style={{}}> Login</Link>
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
            </div>
            </>
    );
}

export default SignUp;