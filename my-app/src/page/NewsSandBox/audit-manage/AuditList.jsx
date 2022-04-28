import React, { useEffect, useState } from 'react'
import { Table, Tag, Modal, Button } from 'antd';
const { confirm } = Modal;
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

const colorList = ['', 'orange', 'green', 'red']

const auditList = ['未审核', '审核中', '已通过', '未通过']

const publishList = ['未发布', '待发布', '已上线', '已下线']

export default function AuditList() {

    const [dataSource, setDataSource] = useState([])
    
    const navigate = useNavigate()

    const userInfo = JSON.parse(localStorage.getItem('token'))

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
            title: '审核状态',
            dataIndex: 'auditState',
            render: auditState => <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
        },
        {
            title: '操作',
            render: item => {
                return (
                    <>
                        {
                            item.auditState === 1 && <Button onClick={() => {
                                setDataSource(dataSource.filter(data => data.id !== item.id))
                                axios.patch(`/news/${item.id}`, {
                                    auditState: 0
                                })
                            }}>撤销</Button>
                        }
                        {
                            item.auditState === 2 && <Button danger onClick={() => {
                                setDataSource(dataSource.filter(data => data.id !== item.id))
                                axios.patch(`/news/${item.id}`, {
                                    publishState: 2,
                                    publishTime: Date.now()
                                })
                            }}>发布</Button>
                        }
                        {
                            item.auditState === 3 && <Button type='primary' onClick={() => {
                                navigate(`/news-manage/update/${item.id}`, { state: { ...item } })
                            }}>更新</Button>
                        }
                    </>
                )
            }
        }
    ];

    useEffect(() => {
        axios.get(`/news?author=${userInfo.username}&auditState_ne=0&publishState_lte=1&_expand=category`)
            .then(res => {
                setDataSource(res.data)
            })
    }, [userInfo.username])

    return (
        <Table dataSource={dataSource} columns={columns}
            pagination={{
                pageSize: 5,
            }}
            rowKey={item => item.id}
        />
    )
}
