import React, { useEffect, useState } from 'react'
import { Table, Tag, Modal, Button, notification } from 'antd';
import axios from 'axios'
import { Link } from 'react-router-dom';

const colorList = ['', 'orange', 'green', 'red']

const auditList = ['未审核', '审核中', '已通过', '未通过']

const publishList = ['未发布', '待发布', '已上线', '已下线']

export default function Audit() {

    const [dataSource, setDataSource] = useState([])

    const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get(`/news?auditState=1&_expand=category`)
            .then(res => {
                setDataSource(+userInfo.roleId === 1 ? res.data : [
                    ...res.data.filter(item => item.author === userInfo.username),
                    ...res.data.filter(item => item.region === userInfo.region && +item.roleId === 3)
                ])
            })
    }, [userInfo.roleId])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <Link to={`/news-manage/preview/${item.id}`} state={{ ...item }}>{title}</Link>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => <div>{category.title}</div>
        },
        {
            title: '操作',
            render: item => {
                return (
                    <>
                        <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>&nbsp;&nbsp;
                        <Button danger onClick={() => handleAudit(item, 3, 0)}>撤销</Button>
                    </>
                )
            }
        }
    ];

    const handleAudit = (item, auditState, publishState) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState,
        })
    }

    return (
        <Table dataSource={dataSource} columns={columns}
            pagination={{
                pageSize: 5,
            }}
            rowKey={item => item.id}
        />
    )
}
