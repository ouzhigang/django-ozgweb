
import React from 'react';
import { Row, Col, Card, Timeline, Icon, Table, Popconfirm, Button, Modal, Form, Input, message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import axios from 'axios';
import { cfg, func } from '../../common';

import '../../style/css/common.css';

class UserShow_ extends React.Component {
	
	loadData(req_obj) {
		if(!req_obj || !req_obj.page) {
			req_obj = {
				page: 1
			};
		}
		
		var that = this;
		axios.get(cfg.web_server_root + "user/show?page=" + req_obj.page).then(function (response) {
            if(response.data.code === 0) {
                that.setState({
                	maindata: response.data.data.list,
    				page: response.data.data.page,
            		page_count: response.data.data.page_count,
            		page_size: response.data.data.page_size,
            		total: response.data.data.total,
                });
                
            }
            else {
                message.error(response.data.msg);
                that.props.history.push('/login');
            }
        }).catch(function (error) {
            message.error(error);
        });
	}
	
	onPage = (page, pageSize) => {
		
		this.loadData({
			page: page
		});
		
	};
	
	onManyDelete(event) {
		var that = this;
		if(that.state.selected_rows.length === 0) {
			message.error("请选择要删除的用户");
		}
		else {
			var url = cfg.web_server_root + "user/del?ids=";
			for(var i = 0; i < that.state.selected_rows.length; i++) {
				url += that.state.selected_rows[i].id;
				if(i + 1 < that.state.selected_rows.length) {
					url += ",";
				}
			}
			
			axios.get(url).then(function (response) {
				if(response.data.code === 0) {
					that.loadData({
						page: that.state.page,
					});
					that.setState({
						selected_rows: [],
					});
					
					for(var item of document.querySelectorAll(".ant-table-tbody .ant-checkbox-input")) {
						if(item.checked) {
							item.click();
						}
					}
					
					message.info(response.data.msg);
				}
				else {
					message.error(response.data.msg);
				}
			}).catch(function (error) {
				message.error(error);
			});
		}
		
	}
	onDelete(id, event) {
		
		var that = this;
        var url = cfg.web_server_root + "user/del?ids=" + id;
		
        axios.get(url).then(function (response) {
            if(response.data.code === 0) {
                that.loadData({
					page: that.state.page
				});
                
                message.info(response.data.msg);
            }
            else {
                message.error(response.data.msg);
            }
        }).catch(function (error) {
            message.error(error);
        });
		
	}
	
	onAddBtnClick(event) {
		this.setState({
			is_add_visible: true,
		});
	}
	
	onAddSubmit(event) {
        var that = this;
		
		this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.post(cfg.web_server_root + "user/add", {
                    name: values.name,
                    pwd: values.pwd
                }).then(function (response) {					
					if(response.data.code === 0) {
                        
						that.props.form.setFieldsValue({
							name: "",
							pwd: "",
						});
						
						that.setState({
							page: 1
						});
						that.loadData();
						message.info(response.data.msg);
						
						that.setState({
							is_add_visible: false,
						});
                    }                    
                    else {
                         message.info(response.data.msg);
                    }
				}).catch(function (error) {
					message.error(error);
				});                
            }
			else {
				message.error(err);
			}
        });
		
	}
	
	onAddCancel(event) {
		this.setState({
			is_add_visible: false,
		});
	}
	
	constructor(props) {
		super(props);
    	
    	this.state = {
    		maindata: [],
    		page: 1,
            page_count: 1,
            page_size: 1,
            total: 1,
            is_add_visible: false,
			selected_rows: [],
    	};
    	
    	document.title = cfg.web_title;
	}
	
	componentDidMount() {
		this.loadData();		
		
	}
	
    render() {
    	
    	const main_data_columns = [
    		{
				title: '用户名',
				dataIndex: 'name',
			},
			{
				title: '添加时间',
				dataIndex: 'add_time_s',
			},
			{
				title: '错误登录次数',
				dataIndex: 'err_login',
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<span>
						<Popconfirm title="确定删除吗？" onConfirm={this.onDelete.bind(this, record.id)} okText="删除" cancelText="取消">
							<a href="#">删除</a>
						</Popconfirm>
					</span>
				),
			}
		];
		
		var that = this;
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				//console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
				that.setState({
					selected_rows: selectedRows
				});
			},
			getCheckboxProps: record => ({
				name: "id_" + record.id,
			}),
		};
    	
    	const { getFieldDecorator } = that.props.form;
        return (        
            <div>
                <BreadcrumbCustom first="用户管理" firsturl="/app/user/show" second="用户列表" />
                <Row gutter={10}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={ { padding: '5px 0' } }>
                                	<Modal title="添加用户" visible={this.state.is_add_visible} onOk={this.onAddSubmit.bind(this)} onCancel={this.onAddCancel.bind(this)} okText="添加" cancelText="取消">
										<Form>
											<Form.Item style={ { margin: '0' } } label="用户名">
												{getFieldDecorator('name', {
													rules: [{ required: true, message: '请输入用户名!' }],
												})(
													<Input placeholder="请输入用户名" />
												)}
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '20px' } } label="密码">
												{getFieldDecorator('pwd', {
													rules: [{ required: true, message: '请输入密码!' }],
												})(
													<Input placeholder="请输入密码" />
												)}
											</Form.Item>
										</Form>
									</Modal>
                                	<Button style={ { float: 'right' } } onClick={this.onAddBtnClick.bind(this)} icon="plus">添加</Button>
                                	<div className="clear" />
                                </div>
                                <Table rowSelection={rowSelection} columns={main_data_columns} dataSource={this.state.maindata} locale={ { emptyText: "没有数据" } } pagination={ { current: this.state.page, pageSize: this.state.page_size, total: this.state.total, onChange: this.onPage } } />
                            	
								<div ref="action_btn_div" style={ { position: 'absolute', marginTop: '-48px' } }>
									<Popconfirm title="确定删除吗？" onConfirm={this.onManyDelete.bind(this)} okText="删除" cancelText="取消">
										<Button icon="delete">删除</Button>
									</Popconfirm>
								</div>
                            </Card>
                        </div>
                    </Col>
                </Row>                
            </div>
        )
    }
}
const UserShow = Form.create()(UserShow_);
export default UserShow;
