
import React, { Component } from 'react';
import { Menu, Icon, Layout, Badge, Popover, Modal, message } from 'antd';
import screenfull from 'screenfull';
import avater from '../style/imgs/b1.jpg';
import SiderCustom from './SiderCustom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { cfg, func } from '../common';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderCustom extends Component {
    state = {
        user: '',
        visible: false,
        modalVisible: false,
        modalContent: "",        
    };
    componentDidMount() {
        
    };
    screenFull = () => {
        if (screenfull.enabled) {
        	if(!screenfull.isFullscreen) {
            	screenfull.request();
            }
            else {
            	screenfull.exit();
            }
        }
    };
    menuClick = e => {
        console.log(e);
        e.key === 'logout' && this.logout();
    };
    userUpdatePwd = () => {
    	
    	this.props.history.push('/app/user/update_pwd');
    	
    };
    logout = () => {
    	this.setState({
    		modalVisible: true,
    		modalContent: "确定退出吗？"
    	});
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };
    
    modalHandleOk = () => {
    	var that = this;
		axios.get(cfg.web_server_root + "other/logout").then(function (response) {
            if(response.data.code === 0) {
                sessionStorage.removeItem('user_id');
        		sessionStorage.removeItem('user_name');
        		that.props.history.push('/login');                
            }
            else {
                message.error(response.data.msg);
                that.props.history.push('/login');
            }
        }).catch(function (error) {
            message.error(error);
        });
    	
    };
    modalHandleCancel = () => {
    	this.setState({
    		modalVisible: false
    	});
    };
    render() {
        const { responsive, path } = this.props;
        return (
            <Header className="custom-theme header" >
                {
                    responsive.data.isMobile ? (
                        <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                            <Icon type="bars" className="header__trigger custom-trigger" />
                        </Popover>
                    ) : (
                        <Icon
                            className="header__trigger custom-trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                        />
                    )
                }
                <Menu mode="horizontal" style={{ lineHeight: '64px', float: 'right' }} onClick={this.menuClick}>
                    <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>
                    <SubMenu title={<span className="avatar"><img src={avater} alt="头像" /><i className="on bottom b-white" /></span>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="setting:1">你好 - {sessionStorage.user_name}</Menu.Item>
                            <Menu.Item key="userUpdatePwd"><span onClick={this.userUpdatePwd}>修改密码</span></Menu.Item>
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
                <Modal title={cfg.web_title} visible={this.state.modalVisible} onOk={this.modalHandleOk} onCancel={this.modalHandleCancel} okText="确定" cancelText="取消">
                	{this.state.modalContent}
                </Modal>
            </Header>
        )
    }
}

const mapStateToProps = state => {
    const { responsive = {data: {}} } = state.httpData;
    return {responsive};
};

export default withRouter(connect(mapStateToProps)(HeaderCustom));
