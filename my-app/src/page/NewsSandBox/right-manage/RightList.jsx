import React, { useEffect, useState } from 'react'
import { Popover, Modal, Button, Table, Tag, Switch } from 'antd';
import axios from 'axios'

import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

export default function RightList() {

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        axios.get('/rights?_embed=children')
            .then(res => {
                const list = res.data
                list.forEach(item => {
                    if (item.children.length === 0) item.children = ''
                })
                setDataSource(list)
            })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: key => <Tag color='volcano'>{key}</Tag>
        },
        {
            title: '操作',
            render: item => {
                return (
                    <>
                        <Popover 
                            content={
                                <div style={{textAlign: 'center'}}>
                                    <Switch checked={item.pagepermission} onChange={() => switchMethod(item)} />
                                </div>
                            } 
                            title="配置项"   
                            trigger={item.pagepermission === undefined ? "" : "click"}
                        >
                            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.pagepermission === undefined}></Button>
                        </Popover>
                        &nbsp;
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
                    </>
                )
            }
        }
    ];

    const switchMethod = item => {
        item.pagepermission = !item.pagepermission
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermission: item.pagepermission ? 1 : 0
            })
        } else {
            axios.delete(`/children/${item.id}`, {
                pagepermission: item.pagepermission ? 1 : 0
            })
        }
    }

    const deleteMethod = item => {
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            setDataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }

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

    return (
        <Table dataSource={dataSource} columns={columns}
            pagination={{
                pageSize: 5,
            }}
        />
    )
}
