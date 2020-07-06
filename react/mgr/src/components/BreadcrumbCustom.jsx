
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

class BreadcrumbCustom extends React.Component {
    render() {
        const first = this.props.first !== undefined ? (this.props.firsturl !== undefined ? <Breadcrumb.Item><Link to={this.props.firsturl}>{this.props.first}</Link></Breadcrumb.Item> : <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item>) : '';
        const second = <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item> || '';
        return (
            <span>
                <Breadcrumb style={{ margin: '12px 0' }}>
                    {/*<Breadcrumb.Item><Link to={'/app/dashboard/index'}>首页</Link></Breadcrumb.Item>*/}
                        {first}
                        {second}
                </Breadcrumb>
            </span>
        )
    }
}

export default BreadcrumbCustom;
