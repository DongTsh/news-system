import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Table, notification } from 'antd';
import axios from 'axios'

import {
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

export default function DraftNews() {

    const [dataSource, setDataSource] = useState([])

    const navigate = useNavigate()

    const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get(`/news?author=${userInfo.username}&auditState=0&_expand=category`)
            .then(res => {
                const list = res.data
                setDataSource(list)
            })
    }, [userInfo.username])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) =>
                <Link to={`/news-manage/preview/${item.id}`}
                    state={{
                        ...item
                    }}
                >{title}</Link>
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => category.title
        },
        {
            title: '操作',
            render: item => {
                return (
                    <>
                        <Button type='primary' shape='circle' icon={<UploadOutlined />} onClick={() => {
                            handleCheck(item.id)
                        }}></Button>&nbsp;
                        <Button shape='circle' icon={<EditOutlined />} onClick={() => {
                            navigate(`/news-manage/update/${item.id}`, { state: { ...item } })
                        }}></Button>&nbsp;
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
                    </>
                )
            }
        }
    ];

    const handleCheck = id => {
        setDataSource(dataSource.filter(data => data.id != id))
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到审核列表中查看',
                placement: 'bottomRight'
            });
        })
    }

    const deleteMethod = item => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
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
            rowKey={item => item.id}
        />
    )
}
