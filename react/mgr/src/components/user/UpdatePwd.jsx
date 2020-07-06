
import React from 'react';
import { Row, Col, Card, Icon, Input, Button, Form, message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import axios from 'axios';
import { cfg, func } from '../../common';

class UserUpdatePwd_ extends React.Component {
	constructor(props) {
		super(props);
    	
    	document.title = cfg.web_title;
	}
	
	confirmPassword = (rule, value, callback) => {
		const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('pwd')) {
            callback('两次输入不一致！');
        }
        callback();
	};
	
	onSubmit = () => {
		var that = this;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				axios.post(cfg.web_server_root + "user/updatepwd", {
					old_pwd: values.old_pwd,
					pwd: values.pwd,
					pwd2: values.pwd2
				}).then(function (response) {					
					if(response.data.code == 0) {
						message.info(response.data.msg);
						
						that.props.form.setFieldsValue({
							old_pwd: "",
							pwd: "",
							pwd2: "",
						});
					}
					else {
						message.error(response.data.msg);
					}
				}).catch(function (error) {
					message.error(error);
				});
			}
			else {
				message.error(err);
			}			
		});
	};
	
    render() {
		var that = this;
		const { getFieldDecorator } = that.props.form;
		
        return (
            <div>
                <BreadcrumbCustom first="用户管理" firsturl="/app/user/show" second="修改密码" />
                <Row gutter={10}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <Form style={ { width: '50%' } }>
									<Form.Item style={ { margin: '0' } } label="旧密码">
										{getFieldDecorator('old_pwd', {
											rules: [{ required: true, message: '请输入旧密码!' }],
										})(
											<Input placeholder="请输入旧密码" type="password" />
										)}
									</Form.Item>
									<Form.Item style={ { margin: '0', marginTop: '20px' } } label="新密码">
										{getFieldDecorator('pwd', {
											rules: [{ required: true, message: '请输入新密码!' }],
										})(
											<Input placeholder="请输入新密码" type="password" />
										)}
									</Form.Item>
									<Form.Item style={ { margin: '0', marginTop: '20px' } } label="确认密码">
										{getFieldDecorator('pwd2', {
											rules: [{ validator: this.confirmPassword }],
										})(
											<Input placeholder="请输入确认密码" type="password" />
										)}
									</Form.Item>
									<Form.Item style={ { margin: '0', marginTop: '20px', textAlign: 'center' } }>
										<Button type="primary" onClick={this.onSubmit}>修改</Button>
									</Form.Item>
								</Form>
                            </Card>
                        </div>
                    </Col>
                </Row>                
            </div>
        )
    }
}
const UserUpdatePwd = Form.create()(UserUpdatePwd_);
export default UserUpdatePwd;