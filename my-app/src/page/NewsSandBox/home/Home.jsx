import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Col, Row, List, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'

const { Meta } = Card;

export default function Home() {

    const [viewList, setViewList] = useState([])

    const [likeList, setLikeList] = useState([])

    const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get('http://localhost:8000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6')
            .then(res => {
                setViewList(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8000/news?publishState=2&_expand=category&_sort=like&_order=desc&_limit=6')
            .then(res => {
                setLikeList(res.data)
            })
    }, [])

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size='default'
                            dataSource={viewList}
                            renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`} state={{ ...item }}>{item.title}</Link></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="点赞最多" bordered={true}>
                        <List
                            size='default'
                            dataSource={likeList}
                            renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`} state={{ ...item }}>{item.title}</Link></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={userInfo.username}
                            description={
                                <div>
                                    <b>{userInfo.region ? userInfo.region : '全球'}</b>&nbsp;&nbsp;
                                    <span>{userInfo.role.roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
