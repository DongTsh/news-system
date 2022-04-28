import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux';
import axios from 'axios'

import {
	HomeOutlined,
	UserOutlined,
	AlignRightOutlined,
	EditOutlined,
	AuditOutlined,
	SendOutlined
} from '@ant-design/icons';

import './SideMenu.css'

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
	"/home":<HomeOutlined />,
	"/user-manage":<UserOutlined />,
	"/right-manage":<AlignRightOutlined />,
	"/news-manage":<EditOutlined />,
	"/audit-manage":<AuditOutlined />,
	"/publish-manage":<SendOutlined />,
}

function SideMenu(props) {

	const [menu, setMenu] = useState([])

	useEffect(() => {
		axios.get('/rights?_embed=children')
			.then(res => {
				setMenu(res.data)
			})
	}, [])

	const navigate = useNavigate()

	const location = useLocation()

	const selectedKeys = [location.pathname]
	const openKeys = ['/' + location.pathname.split('/')[1]]

	const userInfo = JSON.parse(localStorage.getItem('token'))

	const checkPermission = item => item.pagepermission === 1 && userInfo.role.rights.includes(item.key)

	const renderMenu = menu => {
		return menu.map(item => {
			if (item.children?.length > 0 && checkPermission(item)) {
				return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
					{renderMenu(item.children)}
				</SubMenu>
			}
			return checkPermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => navigate(item.key)}>{item.title}</Menu.Item>
		})
	}

	return (
		<Sider trigger={null} collapsible collapsed={props.isCollapsed}>
			<div style={{display: 'flex', height: '100%', 'flexDirection': 'column'}}>
				<div className="logo" style={props.isCollapsed ? {height: '25vh'} : {}}>{props.isCollapsed ? '' : '新闻管理系统'}</div>
				<div style={{flex: 1, 'overflow': 'auto'}}>
					<Menu theme="dark" mode="inline" defaultOpenKeys={openKeys} selectedKeys={selectedKeys}>
						{renderMenu(menu)}
					</Menu>
				</div>
			</div>
		</Sider>
	)
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return { isCollapsed }
}

export default connect(mapStateToProps)(SideMenu)