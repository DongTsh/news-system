import React from 'react'
import NewsPublish from '../../../component/NewsPublish/NewsPublish'
import usePublish from '../../../component/NewsPublish/usePublish'
import { Button } from 'antd'

export default function Sunset() {

    const {dataSource, handleDelete} = usePublish(3)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={id => <Button danger onClick={() => handleDelete(id)}>删除</Button>}/>
        </div>
    )
}
