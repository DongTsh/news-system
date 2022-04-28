import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import Home from '../../page/NewsSandBox/home/Home'
import UserList from '../../page/NewsSandBox/user-manage/UserList'
import RoleList from '../../page/NewsSandBox/right-manage/RoleList'
import RightList from '../../page/NewsSandBox/right-manage/RightList'
import NoPermission from '../../page/NewsSandBox/nopermission/NoPermission'
import AddNews from '../../page/NewsSandBox/news-manage/AddNews'
import DraftNews from '../../page/NewsSandBox/news-manage/DraftNews'
import CategoryNews from '../../page/NewsSandBox/news-manage/CategoryNews'
import PreviewNews from '../../page/NewsSandBox/news-manage/PreviewNews'
import UpdateNews from '../../page/NewsSandBox/news-manage/UpdateNews'
import Audit from '../../page/NewsSandBox/audit-manage/Audit'
import AuditList from '../../page/NewsSandBox/audit-manage/AuditList'
import Published from '../../page/NewsSandBox/publish-manage/Published'
import Sunset from '../../page/NewsSandBox/publish-manage/Sunset'
import Unpublished from '../../page/NewsSandBox/publish-manage/Unpublished'
import { Spin } from 'antd'

const LocalRouterList = {
    '/home': <Home />,
    '/user-manage/list': <UserList />,
    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,
    '/news-manage/add': <AddNews />,
    '/news-manage/draft': <DraftNews />,
    '/news-manage/category': <CategoryNews />,
    '/news-manage/preview/:id': <PreviewNews />,
    '/news-manage/update/:id': <UpdateNews />,
    '/audit-manage/audit': <Audit />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <Unpublished />,
    '/publish-manage/published': <Published />,
    '/publish-manage/sunset': <Sunset />,
}

function NewsRouter(props) {

    const userInfo = JSON.parse(localStorage.getItem('token'))

    const [routeList, setRouteList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res => {
            setRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    const checkRoute = item => {
        return LocalRouterList[item.key] && (+item.pagepermission || +item.routepermission)
    }

    const checkUserPermission = item => {
        return userInfo.role.rights.includes(item.key)
    }

    return (
        <Spin spinning={props.isLoading}>
            <Routes>
                {
                    routeList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} element={LocalRouterList[item.key]} />
                        }
                        return null
                    })
                }

                <Route path='/' element={<Navigate to='/home' />} />
                {
                    routeList.length > 0 && <Route path='*' element={<NoPermission />} />
                }
            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
    return { isLoading }
}

export default connect(mapStateToProps)(NewsRouter)