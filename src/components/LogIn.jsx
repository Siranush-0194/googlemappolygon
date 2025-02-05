import React,{useState,useHistory}  from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";


const {Title} = Typography

const Login = () => {
  
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
    const navigate=useNavigate()

  

    const handleSubmit=(e) =>{
     
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if(
            storedUser &&
            storedUser.email === email &&
            storedUser.password === password
        ) {
            if(storedUser.role ==="admin") {
                navigate("/admin-dashboard")
            } else if( storedUser.role === "editor"){
                navigate("/editor-dashboard");
            }
        } else {
            alert ("Invalid login credentials!");
        }
    };
        return (
            <Card title="Login" className="container">
                <Form onFinish={handleSubmit} className="form">
                    <Form.Item name="email">
                        <Input
                            className="input-field"
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}                          
                            required
                        />
                    </Form.Item>

                    <Form.Item name="password">
                        <Input.Password
                            className="input-field"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}                          
                            required
                        />
                    </Form.Item>

                    <div className="submit-button-wrapper">
                        <Button type="primary" htmlType="submit" className="submit-button">Login</Button>
                    </div>

                    <div className="signup-prompt">
                        <Title level={5}>Don't have an account?</Title>
                        <Link to="/signup"> Sign Up</Link>
                    </div>
                </Form>

            </Card>
        )
    }




export default Login;