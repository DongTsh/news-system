import React, { useEffect, useRef, useState } from 'react'
import { Popover, Modal, Button, Table, Switch } from 'antd';
import axios from 'axios'

import UserForm from '../../../component/UserForm/UserForm';

import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

export default function UserList() {

    const [dataSource, setDataSource] = useState([])

    const [isAddVisible, setIsAddVisible] = useState(false)

    const [isUpdateVisible, setIsUpdateVisible] = useState(false)

    const [roleList, setRoleList] = useState([])

    const [regionList, setRegionList] = useState([])

    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)

    const [current, setCurrent] = useState(null)

    const addForm = useRef()

    const updateForm = useRef()

    const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get('/users?_expand=role')
            .then(res => {
                setDataSource(+userInfo.roleId === 1 ? res.data : [
                    ...res.data.filter(item => item.username === userInfo.username),
                    ...res.data.filter(item => item.region === userInfo.region && +item.roleId === 3)
                ])
            })
    }, [])

    useEffect(() => {
        axios.get('/regions')
            .then(res => {
                setRegionList(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get('/roles')
            .then(res => {
                setRoleList(res.data)
            })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                {
                    text: '亚洲',
                    value: '亚洲'
                },
                {
                    text: '欧洲',
                    value: '欧洲'
                },
                {
                    text: '北美洲',
                    value: '北美洲'
                },
                {
                    text: '南美洲',
                    value: '南美洲'
                },
                {
                    text: '非洲',
                    value: '非洲'
                },
                {
                    text: '大洋洲',
                    value: '大洋洲'
                },
                {
                    text: '南极洲',
                    value: '南极洲'
                },
                {
                    text: '全球',
                    value: '全球'
                }
            ],
            onFilter: (value, item) => {
                if (value === '全球') {
                    return item.region === ''
                } else {
                    return item.region === value
                }
            },
            render: region => region.length ? <b>{region}</b> : <b>全球</b>
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: role => role.roleName
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
            }
        },
        {
            title: '操作',
            render: item => {
                return (
                    <>
                        <Popover
                            content={
                                <div style={{ textAlign: 'center' }}>
                                    <Switch checked={item.pagepermission} onChange={() => switchMethod(item)} />
                                </div>
                            }
                            title="配置项"
                            trigger={item.pagepermission === undefined ? "" : "click"}
                        >
                            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)}></Button>
                        </Popover>
                        &nbsp;
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default}></Button>
                    </>
                )
            }
        }
    ];

    const handleChange = item => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])

        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    const deleteMethod = item => {
        setDataSource(dataSource.filter(data => data.id !== item.id))

        axios.delete(`/users/${item.id}`)
    }

    const confirmMethod = item => confirm({
        title: '是否要删除此项',
        icon: <ExclamationCircleOutlined />,
        okText: '是',
        cancelText: '否',
        onOk() {
            deleteMethod(item)
        },
        onCancel() {

        },
    });

    const addFormOk = () => {
        addForm.current.validateFields().then(value => {

            setIsAddVisible(false)

            addForm.current.resetFields()

            axios.post(`/users`, {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === +res.data.roleId)[0]
                }])
            })

        }).catch(err => {
            console.log(err)
        })
    }

    const handleUpdate = item => {

        setTimeout(() => {
            if (+item.roleId === 1) {
                setIsUpdateDisabled(true)
                return updateForm.current.setFieldsValue(item)
            } else {
                setIsUpdateDisabled(false)
                return updateForm.current.setFieldsValue(item)
            }   
        })
        setIsUpdateVisible(true)

        setCurrent(item)
    }

    const updateFormOk = () => {
        updateForm.current.validateFields().then(value => {

            setIsUpdateVisible(false)

            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))

            setIsUpdateDisabled(!isUpdateDisabled)

            axios.patch(`/users/${current.id}`, value)

        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <Button style={{marginBottom: '8px'}} type='primary' onClick={() => setIsAddVisible(true)}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                rowKey={item => item.id}
                pagination={{
                    pageSize: 5,
                }}
            />

            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => setIsAddVisible(false)}
                onOk={() => addFormOk()}
            >
                <UserForm roleList={roleList} regionList={regionList} ref={addForm} />
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOk()}
            >
                <UserForm roleList={roleList} regionList={regionList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
            </Modal>

        </div>
    )
}
