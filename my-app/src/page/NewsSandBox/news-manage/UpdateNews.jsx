import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Steps, Button, message, Select, Form, Input, notification, PageHeader } from 'antd';
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
        span: 20,
    },
};

export default function UpdateNews() {

    const navigate = useNavigate()

    const [current, setCurrent] = useState(0);

    const [categoryList, setCategoryList] = useState([]);

    const [formInfo, setFormInfo] = useState({});

    const [content, setContent] = useState('');

    const EditNews = useRef(null)

    const location = useLocation()

    //const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`/news/${location.state.id}?_expand=category&_expand=role`)
            .then(res => {
                EditNews.current.setFieldsValue({
                    title: res.data.title,
                    categoryId: res.data.categoryId
                })
                setContent(res.data.content)
            })
    }, [location.state.id])

    const next = () => {
        if (current === 0) {
            EditNews.current.validateFields().then(res => {
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
        axios.patch(`/news/${location.state.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            navigate(+auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
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
                title='修改新闻'
                onBack={() => window.history.back()}
                subTitle=''
            />

            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} description={item.content} />
                ))}
            </Steps>

            <div className="steps-content" style={{ marginTop: '20px' }}>
                <div className={current === 0 ? '' : 'hidden'}>
                    <Form {...layout} name="basic" ref={EditNews}>
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
                    <NewsEditor 
                        getContent={value => {
                            setContent(value)
                        }}
                        content={content}
                    />
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
