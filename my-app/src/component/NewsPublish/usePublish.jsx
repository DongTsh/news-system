import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'

export default function usePublish(type) {
    
    const [dataSource, setDataSource] = useState([])

    const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get(`/news?author=${userInfo.username}&publishState=${type}&_expand=category`)
            .then(res => {
                setDataSource(res.data)
            })
    }, [userInfo.username, type])

    const handlePublish = id => {
        setDataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已发布】中查看',
                placement: 'bottomRight'
            });
        })
    }

    const handleSunset = id => {
        setDataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已下线】中查看',
                placement: 'bottomRight'
            });
        })
    }

    const handleDelete = id => {
        setDataSource(dataSource.filter(data => data.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: '通知',
                description: '该新闻已删除',
                placement: 'bottomRight'
            });
        })
    }



    return {
        dataSource,
        handlePublish,
        handleDelete,
        handleSunset
    }
}