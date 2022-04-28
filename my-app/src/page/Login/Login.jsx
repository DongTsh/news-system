import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './Login.css'

export default function Login() {

    const navigate = useNavigate()

    const onFinish = values => {
        console.log('Received values of form: ', values);

        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then(res => {
                if (res.data.length !== 0) {
                    localStorage.setItem('token', JSON.stringify(res.data[0]))
                    navigate('../home', {replace: true})
                    location.reload();
                } else {
                    message.error('用户名或密码错误')
                }
            })
    };

    return (
        <div className='container'>
            <div className='formContainer'>
                <div className="loginTitle">新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
