import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Steps, Button, message, Select, Form, Input, notification, Divider, Space, PageHeader } from 'antd';
import axios from 'axios'
import NewsEditor from '../../../component/NewsEditor/NewsEditor';

import './News.css'

const { Step } = Steps;

const { Option } = Select

const steps = [
    {
        title: '基本信息',
        content: '新闻标题，新闻分类',
    },
    {
        title: '新闻内容',
        content: '新闻主题内容',
    },
    {
        title: '新闻提交',
        content: '保存草稿或提交审核',
    },
];

const layout = {
    labelCol: {
        span: 0,
    },
    wrapperCol: {
        span: 4,
    },
};

export default function AddNews() {

    const navigate = useNavigate()

    const [current, setCurrent] = useState(0);

    const [categoryList, setCategoryList] = useState([]);

    const [formInfo, setFormInfo] = useState({});

    const [content, setContent] = useState('');

    const AddNews = useRef(null)

    const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])

    const next = () => {
        if (current === 0) {
            AddNews.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1);
            }).catch(err => {
                console.log(err)
            })
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error('新闻内容不能为空')
            } else {
                setCurrent(current + 1);
            }
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const save = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": userInfo.region ? userInfo.region : '全球',
            "author": userInfo.username,
            "roleId": userInfo.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            //"publishTime": 0
        }).then(res => {
            //navigate(+auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.info({
                message: '通知',
                description: `您可以到${+auditState === 0 ? '草稿箱' : '审核列表'}中查看`,
                placement: 'bottomRight'
            });
        })
    }

    return (
        <>
            <PageHeader 
                className='site-page-header'
                title='撰写新闻'
                subTitle=''
            />
            
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} description={item.content} />
                ))}
            </Steps>

            <div className="steps-content" style={{ marginTop: '20px' }}>
                <div className={current === 0 ? '' : 'hidden'}>
                    <Form {...layout} name="basic" ref={AddNews}>
                        <Form.Item
                            name="title"
                            label="新闻标题"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新闻标题'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="新闻分类"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择新闻分类'
                                },
                            ]}
                        >
                            <Select>
                                {
                                    categoryList.map(item => {
                                        return <Option value={item.id} key={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : 'hidden'}>
                    <NewsEditor getContent={value => {
                        setContent(value)
                    }} />
                </div>
                <div className={current === 2 ? '' : 'hidden'}>
                </div>
            </div>

            <div className="steps-action">
                {current < steps.length - 1 && (
                    <Button style={{ marginRight: '4px' }} type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <>
                        <Button type="primary" onClick={() => save(0)}>
                            保存草稿
                        </Button>
                        <Button type="primary" style={{ margin: '0 4px' }} danger onClick={() => save(1)}>
                            提交审核
                        </Button>
                    </>
                )}
                {current > 0 && (
                    <Button style={{ marginLeft: '4px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </>
    )
}
