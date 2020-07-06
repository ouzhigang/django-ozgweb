
import React from 'react';
import { Row, Col, Card, Timeline, Icon, Form, Tree, Button, Modal, Input, InputNumber, Popconfirm, Menu, Dropdown, message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import axios from 'axios';
import { cfg, func } from '../../common';

import '../../style/css/common.css';
import '../../style/css/data_cat/Show.css';

const SubMenu = Menu.SubMenu;

class DataCatShow_ extends React.Component {
	
	loadData() {

		var that = this;
		var type = parseInt(func.get_rest_param("type"));
		axios.get(cfg.web_server_root + "data_cat/show?type=" + type).then(function (response) {
			if(response.data.code === 0) {
				that.setState({
					maindata: response.data.data
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
	
	loadDataCatData() {
		var that = this;
		
		if(parseInt(that.state.type) === 2) {
			return;
		}
			
		axios.get(cfg.web_server_root + "data_cat/show?type=" + that.state.type).then(function (response) {
			if(response.data.code === 0) {
				that.setState({
					data_cat_data: that.renderDropdownNodes(response.data.data),
				});
			}
			else {
				message.error(response.data.msg);				
			}
		}).catch(function (error) {
			message.error(error);
		});
	}
	
	onDropdownSubMenuClick(id, title, event) {
		this.setState({
			data_cat_selected_text: title,
			data_cat_selected_parent_id: id,
		});
		document.querySelector(".ant-dropdown").setAttribute("class", "ant-dropdown ant-dropdown-placement-bottomRight ant-dropdown-hidden");
	}
	renderDropdownNodes = (data) => {
		return data.map((item) => {			
			if (item.children && item.children.length > 0) {				
				return (					
					<SubMenu title={ item.name } key={ item.id } onTitleClick={this.onDropdownSubMenuClick.bind(this, item.id, item.name)}>
						{this.renderDropdownNodes(item.children)}
					</SubMenu>
				);
			}
			return <Menu.Item key={ item.id }>{ item.name }</Menu.Item>;
		});
	}
	
	onAddBtnClick(event) {
		this.setState({
			is_add_visible: true,
			add_btn_text: "添加",
			edit_data: { id: 0 },
		});
		this.loadDataCatData();
	}
	onEditBtnClick(edit_data, event) {
		var that = this;
		if(edit_data.parent_id != 0) {
			axios.get(cfg.web_server_root + "data_cat/get?id=" + edit_data.parent_id).then(function (response) {
				if(response.data.code === 0) {
					that.setState({
						is_add_visible: true,
						add_btn_text: "修改",
						edit_data: edit_data,
						data_cat_selected_text: response.data.data.name,
						data_cat_selected_parent_id: response.data.data.id,
					});
					
					that.props.form.setFieldsValue({
						name: edit_data.name,
						sort: edit_data.sort,
					});
					
					that.loadDataCatData();
				}
				else {
					message.error(response.data.msg);
				}
			}).catch(function (error) {
				message.error(error);
			});
		}
		else {
			//顶级分类
			
			that.setState({
				is_add_visible: true,
				add_btn_text: "修改",
				edit_data: edit_data,
			});
			
			that.props.form.setFieldsValue({
				name: edit_data.name,
				sort: edit_data.sort,
			});
			
			that.loadDataCatData();
		}
	}
	onDeleteBtnClick(id, event) {
		var that = this;
        var url = cfg.web_server_root + "data_cat/del?id=" + id;
		
        axios.get(url).then(function (response) {
            if(response.data.code === 0) {
                that.loadData();
                
                message.info(response.data.msg);
            }
            else {
                message.error(response.data.msg);
            }
        }).catch(function (error) {
            message.error(error);
        });
	}
	onAddSubmit(event) {
        var that = this;
		this.props.form.validateFields((err, values) => {
            if (!err) {
				var post_data = {
                    name: values.name,
                    sort: values.sort,
					parent_id: that.state.data_cat_selected_parent_id,
					type: that.state.type,
                };
				
				if(that.state.edit_data.id !== 0) {
					post_data.id = that.state.edit_data.id;
				}
				
                axios.post(cfg.web_server_root + "data_cat/add", post_data).then(function (response) {					
					if(response.data.code === 0) {    
                    
						that.resetAddForm();
						
						that.props.form.setFieldsValue({
							sort: 0,
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
		this.resetAddForm();
	}
	
	resetAddForm() {
		var that = this;
		//that.props.form.resetFields();
		that.props.form.setFieldsValue({
			name: "",
			sort: 0,
		});
		that.setState({
			data_cat_selected_text: "请选择分类",
			data_cat_selected_parent_id: 0,
		});
	}
	
	onDropdown(event) {
		this.setState({
			data_cat_selected_text: event.item.props.children,
			data_cat_selected_parent_id: event.key,
		});
	}
	
	constructor(props) {
		super(props);
    	
		var type = parseInt(func.get_rest_param("type"));
    	this.state = {
    		first_type_name: type === 2 ? "" : "分类管理",
    		second_type_name: type === 2 ? "" : "分类列表",
			type_name: type === 2 ? "" : "分类",
			type: type,
			
			maindata: [],
			data_cat_data: null,
			is_add_visible: false,
			add_btn_text: "",
			edit_data: { id: 0 },
			data_cat_selected_text: "请选择分类",
			data_cat_selected_parent_id: 0,
    	};
		
    	document.title = cfg.web_title;
	}
	
	renderTreeNodes = (data) => {
		return data.map((item) => {
			var item_html = (
				<div>
					<span>{item.name}</span>
					<Popconfirm title="确定删除吗？" onConfirm={this.onDeleteBtnClick.bind(this, item.id)} okText="删除" cancelText="取消">
						<a href="javascript:void(0)" className="action-btn">删除</a>
					</Popconfirm>					
					<a href="javascript:void(0)" className="action-btn" style={ { marginRight: '10px' } } onClick={this.onEditBtnClick.bind(this, item)}>修改</a>					
				</div>
			);
			
			if (item.children && item.children.length > 0) {				
				return (					
					<Tree.TreeNode title={item_html} key={item.id} dataRef={item}>
					{this.renderTreeNodes(item.children)}
					</Tree.TreeNode>
				);
			}
			return <Tree.TreeNode {...item} title={item_html} dataRef={item} />;
		});
	}

	componentDidMount() {
		this.loadData();
		
		this.props.form.setFieldsValue({
			sort: "0",
		});
	}
	
    render() {
		
		var that = this;
		const { getFieldDecorator } = that.props.form;
        return (
            <div>
                <BreadcrumbCustom first={this.state.first_type_name} second={this.state.second_type_name} />
                <Row gutter={10}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={ { padding: '5px 0' } }>
                                	<Modal title={ this.state.type_name + this.state.add_btn_text } visible={this.state.is_add_visible} onOk={this.onAddSubmit.bind(this)} onCancel={this.onAddCancel.bind(this)} okText={ this.state.add_btn_text } cancelText="取消">
										<Form>
											<Form.Item style={ { margin: '0' } } label="分类名称">
												{getFieldDecorator('name', {
													rules: [{ required: true, message: '请输入分类名称!' }],
												})(
													<Input placeholder="请输入分类名称" />
												)}
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '20px' } } label="排序">
												{getFieldDecorator('sort', {
													rules: [{ required: true, message: '请输入排序!' }],
												})(
													<InputNumber placeholder="请输入排序" min={0} value="0" />
												)}
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '20px', display: this.state.type !== 2 ? 'block' : 'none' } } label="分类">
												<Dropdown.Button overlay={ (<Menu onClick={ this.onDropdown.bind(this) }><Menu.Item key={ 0 }>请选择分类</Menu.Item>{ this.state.data_cat_data }</Menu>) }>
													<span>{ this.state.data_cat_selected_text }</span>
												</Dropdown.Button>
											</Form.Item>
										</Form>
									</Modal>
                                	<Button style={ { float: 'right' } } onClick={this.onAddBtnClick.bind(this)} icon="plus">添加</Button>
                                	<div className="clear" />
                                </div>
								<Tree>
								{this.renderTreeNodes(this.state.maindata)}
								</Tree>
								
                            </Card>
                        </div>
                    </Col>
                </Row>                
            </div>
        )
    }
}
const DataCatShow = Form.create()(DataCatShow_);
export default DataCatShow;
