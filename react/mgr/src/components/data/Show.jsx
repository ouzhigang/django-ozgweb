
import React from 'react';
import { Row, Col, Card, Timeline, Icon, Table, Popconfirm, Button, Modal, Form, Input, InputNumber, Menu, Dropdown, Checkbox, Upload, message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import Editor from 'react-umeditor';
import axios from 'axios';
import { cfg, func } from '../../common';

import '../../style/css/common.css';
import '../../style/css/data/Show.css';

const SubMenu = Menu.SubMenu;

class DataShow_ extends React.Component {

	loadData(req_obj) {
		if(!req_obj || !req_obj.page) {
			req_obj = {
				page: 1
			};
		}
		
		var that = this;
		var url = cfg.web_server_root + "data/show?type=" + that.state.type + "&page=" + req_obj.page;
		
		if(req_obj.name && req_obj.name != "") { url += "&name=" + encodeURI(req_obj.name); }
		
		if(that.state.data_cat_id != 0 && !req_obj.data_cat_id) { req_obj.data_cat_id = that.state.data_cat_id; }
		if(req_obj.data_cat_id && req_obj.data_cat_id != 0) { url += "&data_cat_id=" + req_obj.data_cat_id; }
		
		axios.get(url).then(function (response) {
            if(response.data.code == 0) {
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
		if(this.state.is_search_visible) {
			//搜索
			this.setState({
				data_cat_selected_text: title,
				data_cat_selected_id: id,
			});
		}
		else {
			//添加或修改
			this.setState({
				data_cat_selected_text: title,
				data_cat_selected_id: id,
			});
		}
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
	
	onPage = (page, pageSize) => {
		var req_obj = {
			page: page,
		}
		this.loadData(req_obj);		
	};
	
	onManyDelete(event) {
		var that = this;
		if(that.state.selected_rows.length === 0) {
			message.error("请选择要删除的" + this.state.type_name);
		}
		else {
			var url = cfg.web_server_root + "data/del?ids=";
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
        var url = cfg.web_server_root + "data/del?ids=" + id;
		
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
			edit_data: { id: 0 },
		});
	}
	
	onEditBtnClick(edit_data, event) {
		var that = this;
		
		that.setState({
			is_add_visible: true,
			edit_data: edit_data,
		});
		
		that.props.form.setFieldsValue({
			name: edit_data.name,
			sort: edit_data.sort,
		});
		
		var i = 0;
		var upload_file_list = [];
		for(var item of edit_data.picture) {
			upload_file_list.push({
				uid: i + 1,
				name: item,
				status: 'done',
				url: cfg.web_res_root + 'upload/' + item,
			});
			
			i++;
		}
		
		that.setState({
			content: edit_data.content,
			is_index_show: edit_data.is_index_show,
			recommend: edit_data.recommend,
			is_index_top: edit_data.is_index_top,
			upload_file_list: upload_file_list
		});
		
		//console.log(edit_data);
		//console.log(edit_data.is_index_show);
		//console.log(that.state.is_index_show);
		//setTimeout是为了解决第1次加载时找不到对象的问题
		setTimeout(function() {
			for(var item of document.getElementsByTagName("input")) {
				if(item.getAttribute("name") == "is_index_show" || item.getAttribute("name") == "recommend" || item.getAttribute("name") == "is_index_top") {
					//console.log(edit_data[item.getAttribute("name")]);
					if(edit_data[item.getAttribute("name")]) {
						item.click();
					}
				}
			}
		}, 50);
		
		if(edit_data.type == 1) {
			axios.get(cfg.web_server_root + "data_cat/get?id=" + edit_data.data_cat).then(function (response) {
				if(response.data.code === 0) {
					that.setState({					
						data_cat_selected_text: response.data.data.name,
						data_cat_selected_id: response.data.data.id,
					});
				}
				else {
					message.error(response.data.msg);
				}
			}).catch(function (error) {
				message.error(error);
			});
		}
	}
	
	onAddSubmit(event) {
        var that = this;
		this.props.form.validateFields((err, values) => {
            if (!err) {
				var post_data = {
                    name: values.name,
                    sort: values.sort,
					content: that.state.content,
					type: that.state.type,
                };
				
				if(that.state.is_index_show) {
					post_data.is_index_show = 1;
				}
				if(that.state.recommend) {
					post_data.recommend = 1;
				}
				if(that.state.is_index_top) {
					post_data.is_index_top = 1;
				}
				
				if(that.state.type !== 2) {
					post_data.data_cat_id = that.state.data_cat_selected_id;
					
					if(that.state.upload_file_list.length > 0) {
						post_data.picture = [];						
						for(var item of that.state.upload_file_list) {
							if(item.response && item.response.code === 0) {
								post_data.picture.push(item.response.data.filepath);
							}
							else if(item.status == "done") {
								post_data.picture.push(item.name);
							}
						}
					}
				}
				
				if(that.state.edit_data.id !== 0) {
					post_data.id = that.state.edit_data.id;
				}
				
                axios.post(cfg.web_server_root + "data/add", post_data).then(function (response) {					
					if(response.data.code === 0) {
                        
						that.resetAddForm();
						
						that.setState({
							page: 1,
							name: "",
						});
						that.props.form.setFieldsValue({
							name: "",
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
	
	onDropdown(event) {
		if(this.state.is_search_visible) {
			//搜索
			this.setState({
				data_cat_selected_text: event.item.props.children,
				data_cat_selected_id: event.key,
			});
		}
		else {
			//添加或修改
			this.setState({
				data_cat_selected_text: event.item.props.children,
				data_cat_selected_id: event.key,
			});
		}
	}
	
	onAddChkChange(name, event) {
		var obj = {};
		obj[name] = event.target.checked;
		this.setState(obj);
	}
	
	onSearchBtnClick(event) {
		this.setState({
			is_search_visible: true,
		});
	}
	
	onSearchSubmit(event) {
		var that = this;
		
		that.setState({
			is_search_visible: false,
		});
        
		that.props.form.validateFields((err, values) => {
			//这里不需要验证所以忽略了err
			that.setState({
				name: values.name,
				data_cat_id: that.state.data_cat_selected_id,
				page: 1,
			});
			that.loadData({
				page: 1,
				name: values.name,
				data_cat_id: that.state.data_cat_selected_id,
			});
		});
	}
	
	onSearchCancel(event) {
		this.setState({
			is_search_visible: false,
		});
		
	}
	
	resetAddForm() {
		var that = this;
		//that.props.form.resetFields();
		that.props.form.setFieldsValue({
			name: "",
			sort: 0,
		});
		that.setState({
			content: "",
			is_index_show: false,
			recommend: false,
			is_index_top: false,
			data_cat_selected_text: "请选择分类",
			data_cat_selected_id: 0,
			upload_file_list: [],
		});
		
		for(var item of document.getElementsByTagName("input")) {
			if(
				(item.getAttribute("name") == "is_index_show" || item.getAttribute("name") == "recommend" || item.getAttribute("name") == "is_index_top")
				&& item.checked
			) {
				item.click();
			}
		}
		
	}
	
	handleEditorChange = (content) => {
		this.setState({
			content: content
		})
	};
	
	getIcons() {
		var icons = [
			"source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
			"paragraph fontfamily fontsize | superscript subscript | ",
			"forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
			"cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
			"horizontal date time  | spechars inserttable"
		];
		return icons;
	}
	
	constructor(props) {
		super(props);
    	
    	var type = parseInt(func.get_rest_param("type"));		
    	this.state = {
    		first_type_name: type === 2 ? "新闻管理" : "产品管理",
    		second_type_name: type === 2 ? "新闻列表" : "产品列表",
    		type_name: type === 2 ? "新闻" : "产品",
    		type: type,
			
    		maindata: [],
    		page: 1,
            page_count: 1,
            page_size: 1,
            total: 1,
            is_add_visible: false,
			selected_rows: [],
			is_search_visible: false,
			data_cat_data: [],
			content: "",
			is_index_show: false,
			recommend: false,
			is_index_top: false,
			edit_data: { id: 0 },
			data_cat_selected_text: "请选择分类",
			data_cat_selected_id: 0,
			name: "",		
			upload_file_list: [],
    	};
    	
    	document.title = cfg.web_title;
	}

	componentDidMount() {
		this.loadData();
		this.loadDataCatData();
		
		this.props.form.setFieldsValue({
			sort: "0",
		});
		
	}
	
    render() {
    
    	const main_data_columns = [
    		{
				title: '名称',
				dataIndex: 'name',
			},
			{
				title: '分类',
				dataIndex: 'dc_name',
			},
			{
				title: '点击',
				dataIndex: 'hits',
			},
			{
				title: '时间',
				dataIndex: 'add_time_s',
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<span>
						<a href="javascript:void(0)" style={ { marginRight: '15px' } } onClick={this.onEditBtnClick.bind(this, record)}>修改</a>
						<Popconfirm title="确定删除吗？" onConfirm={this.onDelete.bind(this, record.id)} okText="删除" cancelText="取消">
							<a href="javascript:void(0)">删除</a>
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
		
		var editor_icons = that.getIcons();
    	const { getFieldDecorator } = that.props.form;
		
		//=================================================================
		const upload_props = {
			action: cfg.web_server_root + "data/upload",
			fileList: that.state.upload_file_list,
			onChange({ file, fileList }) {
				for(var item of fileList) {
					if (item.status !== 'uploading') {
						if(item.response && item.response.code !== 0) {
							item.status = "error";
						}
					}
				}
				that.setState({
					upload_file_list: fileList,
				});
				
				//console.log(fileList);
			},
			onRemove(file) {
				//console.log(that.state.upload_file_list);
				//console.log("=======================");
				//console.log(file);
				
				return true;
			}
		};
		//=================================================================
		
        return (
            <div>
                <BreadcrumbCustom first={this.state.first_type_name} second={this.state.second_type_name} />
                <Row gutter={10}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={ { padding: '5px 0' } }>
                                	<Modal title={ (this.state.edit_data.id === 0 ? '添加' : '修改') + this.state.type_name } visible={this.state.is_add_visible} onOk={this.onAddSubmit.bind(this)} onCancel={this.onAddCancel.bind(this)} okText={ this.state.edit_data.id === 0 ? '添加' : '更新' } cancelText="取消" width="90%">
										<Form>
											<Form.Item style={ { margin: '0' } }>
												{getFieldDecorator('name', {
													rules: [{ required: true, message: '请输入' + this.state.type_name + '名称!' }],
												})(
													<Input placeholder={ '请输入' + this.state.type_name + '名称' } />
												)}
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '10px', display: this.state.type !== 2 ? 'block' : 'none' } }>
												<Dropdown.Button overlay={ (<Menu onClick={ this.onDropdown.bind(this) }><Menu.Item key={ 0 }>请选择分类</Menu.Item>{ this.state.data_cat_data }</Menu>) }>
													<span>{ this.state.data_cat_selected_text }</span>
												</Dropdown.Button>
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '10px' } } label="排序">
												{getFieldDecorator('sort', {
													rules: [{ required: true, message: '请输入排序!' }],
												})(
													<InputNumber placeholder="请输入排序" min={0} value="0" />
												)}
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '10px', display: this.state.type !== 2 ? 'block' : 'none' } } label={ this.state.type_name + '图片' }>
												<Upload {...upload_props}>
													<Button>
														<Icon type="upload" /> 上传
													</Button>
												</Upload>
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '10px' } } className="add-chk-div">
												<Checkbox name="is_index_show" onChange={this.onAddChkChange.bind(this, "is_index_show")}>首页显示</Checkbox>
												<Checkbox name="recommend" onChange={this.onAddChkChange.bind(this, "recommend")}>推荐</Checkbox>
												<Checkbox name="is_index_top" onChange={this.onAddChkChange.bind(this, "is_index_top")} style={ { display: this.state.type === 2 ? 'inline-block' : 'none' } }>顶部显示</Checkbox>
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '10px' } } className="data">
												<Editor ref="editor" icons={editor_icons} value={this.state.content} defaultValue="" onChange={this.handleEditorChange} />
											</Form.Item>
										</Form>
									</Modal>
									<Modal title={ '搜索' + this.state.type_name } visible={this.state.is_search_visible} onOk={this.onSearchSubmit.bind(this)} onCancel={this.onSearchCancel.bind(this)} okText="搜索" cancelText="取消">
										<Form>
											<Form.Item style={ { margin: '0' } }>
												{getFieldDecorator('name', {
												})(
													<Input placeholder={ '请输入搜索的' + this.state.type_name + '名称' } />
												)}
											</Form.Item>
											<Form.Item style={ { margin: '0', marginTop: '10px', display: this.state.type !== 2 ? 'block' : 'none' } }>
												<Dropdown.Button overlay={ (<Menu onClick={ this.onDropdown.bind(this) }><Menu.Item key={ 0 }>请选择分类</Menu.Item>{ this.state.data_cat_data }</Menu>) }>
													<span>{ this.state.data_cat_selected_text }</span>
												</Dropdown.Button>
											</Form.Item>
										</Form>
									</Modal>
									<Button style={ { float: 'right' } } onClick={this.onAddBtnClick.bind(this)} icon="plus">添加</Button>
                                	<Button style={ { float: 'right', marginRight: '10px' } } onClick={this.onSearchBtnClick.bind(this)} icon="search">搜索</Button>
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

const DataShow = Form.create()(DataShow_);
export default DataShow;
