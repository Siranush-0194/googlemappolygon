import React,{useState}  from "react";
import { Button, Card, Form, Input} from "antd";
import { Link,  useNavigate } from "react-router-dom";
import {  FaMapMarkerAlt } from "react-icons/fa";




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
            <div className="auth-container">
            <Card title="Login" className="auth-card">
            <div className="auth-header">
        <FaMapMarkerAlt className="map-icon"/>
        <h2>Google Maps</h2>
    </div>
                
                <Form onFinish={handleSubmit} className="auth-form">
                    <Form.Item 
                    name="email"   
                    rules={[
                    {required:true,message:"Please input your email!"},
                    {type:'email', message:"Please enter valid email address"}]}>
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

                    <div className="auth-footer">
                        <p> Don't have an account? <Link to ="/signup">Register </Link> </p>
                        
                    </div>
                </Form>

            </Card>
            </div>
        )
    }




export default Login;