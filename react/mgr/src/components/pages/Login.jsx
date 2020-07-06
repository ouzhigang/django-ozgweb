
import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import axios from 'axios';

import { cfg, func } from '../../common';

const FormItem = Form.Item;

class Login extends React.Component {
	constructor(props) {
		super(props);
    	
    	this.state = {
    		css_vcode_div: {
    			display: 'none'
    		},
    		css_vcode_img: {
    			display: "block",
				position: "absolute",
				width: "118px",
				top: "-6px",
				left: "129px",
				cursor: "pointer",
    		},
    		vcode_img: cfg.web_server_root + "index/getvcode"
    	};
    	
    	document.title = cfg.web_title;
	}

    componentWillMount() {
        
    }
    componentDidUpdate(prevProps) { // React 16.3+弃用componentWillReceiveProps
        
    }
    handleSubmit = (e) => {
        e.preventDefault();
        
        var that = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                
                axios.post(cfg.web_server_root + "index/login", {
                    name: values.userName,
                    pwd: values.password,
                	vcode: values.vcode
                }).then(function (response) {
					
					if(response.data.code === 0) {
                        sessionStorage.setItem('user_name', response.data.data.name);
                        sessionStorage.setItem('user_id', response.data.data.id);
                        
                        that.props.history.push('/app/dashboard/index');
                    }
                    else if(response.data.code === 2) {
                        //需要输入验证码
                        values.vcode = "";
                        that.setState({
                        	css_vcode_div: {
								display: 'block'
							}
                        });
                    }
                    else if(response.data.code === 3) {
                        //验证码错误
                        message.info(response.data.msg);
                        
                        values.vcode = "";
                        that.refs.vcode_img.click();
                    }
                    else {
                         message.info(response.data.msg);
                    }
				}).catch(function (error) {
					console.log(error);
				});
                
            }
        });
    };
    vcodeUpdate = (e) => {
    	e.preventDefault();
    	
    	var el = e.currentTarget;
        el.src = this.state.vcode_img + "?dt=" + Math.random();
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>后台管理系统</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />                                
                            )}                            
                        </FormItem>
                        <FormItem style={this.state.css_vcode_div}>
                            {getFieldDecorator('vcode', {
                                rules: [
                                	{ max: 6, message: '输入内容过长!' }
                                ],
                            })(
                                <Input prefix={<Icon type="picture" style={{ fontSize: 13 }} />} placeholder="请输入验证码" />
                            )}
                            <img ref="vcode_img" alt="验证码" style={this.state.css_vcode_img} src={this.state.vcode_img} onClick={this.vcodeUpdate} />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>登录</Button>                            
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToPorps = state => {
    const { auth } = state.httpData;
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));