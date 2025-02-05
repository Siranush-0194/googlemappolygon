import React, {useState} from "react";
import { Button, Card, Form, Input, Select } from "antd";
import {FaMapMarkerAlt} from "react-icons/fa"
import './SignUp.scss';
import { useNavigate } from "react-router-dom";

const {Option} = Select;

const SignUp = () => {
   const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    nickname:"",
    role:"editor"
   });
  
   const [form]= Form.useForm();
    const navigate = useNavigate();

   const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData({...formData,[name]:value});
   };
   const handleRoleChange = (value) => {
    setFormData({...formData,role:value});
   }
   const handleSubmit = () => {   
    sessionStorage.setItem("user",JSON.stringify(formData));
    alert("User registered successfully!");
    setTimeout(()=>{
        form.resetFields();
    },0)

    
   console.log("Stored User:", sessionStorage.getItem("user"));

   };

  

return (
    <Card title={<><FaMapMarkerAlt/>Sign Up </>} className="container">
        <Form form={form} onFinish={handleSubmit} className="form">
        <Form.Item 
            name="name"
            rules={[{required:true,message:"Please input your name!"}]}
        >
                <Input 
                className="input-field"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                />
            </Form.Item>
            <Form.Item 
                name="email"
                rules={[{required:true,message:"Please input your email!"}]}
                >
            <Input 
            className="input-field"
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </Form.Item>
            <Form.Item 
                name="password"
                rules={[{required:true,message:"Please input your password!"}]}
                >
            <Input.Password 
                className="input-field"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                />
            </Form.Item>
            <Form.Item 
                name="nickname"
                rules={[{required:true,message:"Please input your nickname!"}]}
                >
            <Input
                className="input-field"
                text="text"
                name="nickname"
                placeholder="Nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                />
            </Form.Item>

            <Form.Item name="role">
                <Select 
                    name="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                    className="input-field"
                    >
                        <Option value="admin">Admin</Option>
                        <Option value="editor">Editor</Option>
                </Select>
            </Form.Item>
            
            <div className="submit-button-wrapper">
            <Button type="primary" htmlType="submit" className="submit-button">
          Sign Up
        </Button>

        </div>
        <>
        <Button type="default" className="login-button" onClick={()=>navigate("/login")}>
            Go to Login
            </Button>
        </>
        </Form>

    </Card>
)
}


export default SignUp