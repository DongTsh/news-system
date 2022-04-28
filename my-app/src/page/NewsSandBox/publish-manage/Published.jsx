import React from 'react'
import NewsPublish from '../../../component/NewsPublish/NewsPublish'
import usePublish from '../../../component/NewsPublish/usePublish'
import { Button } from 'antd'

export default function Published() {

    const {dataSource, handleSunset} = usePublish(2)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={id => <Button onClick={() => handleSunset(id)}>下线</Button>}/>
        </div>
    )
}
