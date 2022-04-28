import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import SideMenu from '../../component/SideMenu/SideMenu'
import TopHeader from '../../component/TopHeader/TopHeader'


import './NewsSandBox.css'

import { Layout } from 'antd';
import NewsRouter from '../../component/NewsRouter/NewsRouter'

const { Content } = Layout;

export default function NewsSandBox() {
    NProgress.start()

    useEffect(() => {
        NProgress.done()
    })

    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}
                >
                    <NewsRouter />
                </Content>
            

            </Layout>
        </Layout>
    )
}
