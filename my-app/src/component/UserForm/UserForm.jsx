import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';

const { Option } = Select;

function UserForm(props, ref) {

    const [isDisabled, setIsDisabled] = useState(false)

    const userInfo = JSON.parse(localStorage.getItem('token'))

    const checkRegionDisabled = item => {
        if (props.isUpdate) {
            if (+userInfo.roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (+userInfo.roleId === 1) {
                return false
            } else {
                return item.value !== userInfo.region
            }
        }
    }

    const checkRoleDisabled = item => {
        if (props.isUpdate) {
            if (+userInfo.roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (+userInfo.roleId === 1) {
                return false
            } else {
                return +item.id !== 3
            }
        }
    }

    useEffect(() => {
        setIsDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={!isDisabled ? [{ required: true, message: '请选择区域' }] : []}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
            >
                <Select onChange={value => {
                    if (value == 1) {
                        setIsDisabled(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item => <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
    )
}

export default forwardRef(UserForm)