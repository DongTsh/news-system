import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Table, Modal, Tree } from 'antd';

import {
    UnorderedListOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

export default function RoleList() {

    const [dataSource, setDataSource] = useState([])

    const [rightList, setRightList] = useState([])

    const [currentRights, setCurrentRights] = useState([])

    const [currentId, setCurrentId] = useState(0)

    const [isModalVisible, setIsModalVisible] = useState(false)

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: item => {
                return (
                    <>
                        <Button type='primary' shape='circle' icon={<UnorderedListOutlined />} onClick={() => {
                            setIsModalVisible(true)
                            setCurrentRights(item.rights)
                            setCurrentId(item.id)
                        }}></Button>
                        &nbsp;
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
                    </>
                )
            }
        }
    ]

    useEffect(() => {
        axios.get('/roles')
            .then(res => {
                setDataSource(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get('/rights?_embed=children')
            .then(res => {
                setRightList(res.data)
            })
    }, [])

    const deleteMethod = item => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
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

    const handleOk = () => {
        setIsModalVisible(false)
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))

        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const onCheck = (checkedKeys, e) => {
        console.log(checkedKeys, e)
        let checkedList = checkedKeys.checked
        if (e.node.children.lenght !== 0 && !e.checked) {
            e.node.children.map(child => {
                checkedList.splice(checkedList.indexOf(child.key), 1)
            })
        } else {
            e.node.children.map(child => {
                checkedList.push(child.key)
            })
        }
        setCurrentRights(checkedList)
    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>

            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly
                    onCheck={onCheck}
                    checkedKeys={currentRights}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
