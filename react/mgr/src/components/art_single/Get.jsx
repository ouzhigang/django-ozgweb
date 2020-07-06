
import React from 'react';
import { Row, Col, Card, Timeline, Icon, Button, message } from 'antd';
import Editor from 'react-umeditor';
import BreadcrumbCustom from '../BreadcrumbCustom';
import axios from 'axios';
import { cfg, func } from '../../common';

import '../../style/css/art_single/Get.css';

export default class ArtSingleGet extends React.Component {

	handleChange = (content) => {
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
	
	onSubmit = () => {
		var that = this;

        axios.post(cfg.web_server_root + "art_single/update", {
        	id: that.state.id,
            content: that.state.content
        }).then(function (response) {
            if(response.data.code === 0) {
                message.info(response.data.msg);
                that.loadData();
            }
            else {
                message.error(response.data.msg);
            }
        }).catch(function (error) {
            message.error(error);
        });
	};
	
	loadData() {
		var that = this;
		axios.get(cfg.web_server_root + "art_single/get?id=" + this.state.id).then(function (response) {					
			if(response.data.code === 0) {
                that.setState({
                	id: response.data.data.id,
                	name: response.data.data.name,
                	content: response.data.data.content,
                });
			}                    
			else {
				message.error(response.data.msg);
				that.props.history.push('/login');
			}
		}).catch(function (error) {
			console.log(error);
		});
	}
	
	constructor(props) {
		super(props);
    	
    	this.state = {
    		id: func.get_rest_param("get"),
    		name: "",
    		content: ""
    	};
    	
    	document.title = cfg.web_title;
	}
	
	componentWillMount() {
		
	}
	
	componentDidMount() {
		this.loadData();
		
	}
	
    render() {
    	var editor_icons = this.getIcons();
			
        return (
            <div>
                <BreadcrumbCustom first="区域管理" second={this.state.name} />
                <Row gutter={10}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="art-single">
                                	<Editor ref="editor" icons={editor_icons} value={this.state.content} defaultValue="" onChange={this.handleChange} />
                                </div>
                                <div className="art-single2">
                                	<Button type="primary" onClick={this.onSubmit}>更新</Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>                
            </div>
        )
    }
}
