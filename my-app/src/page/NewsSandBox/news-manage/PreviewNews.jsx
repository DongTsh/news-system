import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'

const auditList = ['未审核', '审核中', '已通过', '未通过']

const publishList = ['未发布', '待发布', '已发布', '已下线']

export default function PreviewNews() {

    const [newsInfo, setNewsInfo] = useState(null)

    const location = useLocation()

    useEffect(() => {
        axios.get(`/news/${location.state.id}?_expand=category&_expand=role`)
            .then(res => {
                setNewsInfo(res.data)
            })
    }, [location.state.id])

    return (
        <div className="site-page-header-ghost-wrapper">
            {
                newsInfo &&
                <>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:MM:SS')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.pulishTime ? moment(newsInfo.pulishTime).format('YYYY/MM/DD HH:MM:SS') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态">
                                <span style={{ color: 'red' }}>{auditList[newsInfo.auditState]}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="发布状态">
                                <span style={{ color: 'red' }}>{publishList[newsInfo.publishState]}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: newsInfo.content
                        }}
                        style={{ padding: '0 24px' }}
                    >
                    </div>
                </>
            }
        </div>
    )
}
