import React from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux';

import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;

function TopHeader(props) {

    //const [collapsed, setCollapsed] = useState(false)

    const navigate = useNavigate()

    const changeCollapsed = () => {
        props.changeCollapsed()
    };

    const userInfo = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu style={{ 'marginTop': '20px' }}>
            <Menu.Item key={userInfo.role.roleName}>
                {userInfo.role.roleName}
            </Menu.Item>
            <Menu.Item
                danger
                key='logout'
                style={{ textAlign: 'center' }}
                onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login', 'replace')
                }}
            >
                退出
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                欢迎&nbsp;<span style={{ color: 'skyblue', fontWeight: 'bold' }}>{userInfo.username}</span>&nbsp;回来&nbsp;
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <Avatar size={32} icon={<UserOutlined />} />
                    </a>
                </Dropdown>
            </div>
        </Header>
    )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return { isCollapsed }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change_collapsed'
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)