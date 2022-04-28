import React from 'react'
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';

export default function NewsPublish(props) {

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => <Link to={`/news-manage/preview/${item.id}`} state={{ ...item }}>{title}</Link>
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
                        {props.button(item.id)}
                    </>
                )
            }
        }
    ];

    return (
        <Table dataSource={props.dataSource} columns={columns}
            pagination={{
                pageSize: 5,
            }}
            rowKey={item => item.id}
        />
    )
}
