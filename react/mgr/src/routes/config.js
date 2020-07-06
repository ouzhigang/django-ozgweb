export default {
    menus: [ // 菜单相关路由
        { key: '/app/dashboard/index', title: '系统首页', icon: 'home', component: 'Dashboard' },
        {
            key: '/app/data_cat/show', title: '产品分类', icon: 'project',
            subs: [
                { key: '/app/data_cat/show/type/1', title: '分类列表', component: 'DataCatShow'},
            ],
        },
        {
            key: '/app/data/show_1', title: '产品管理', icon: 'table',
            subs: [
                { key: '/app/data/show/type/1', title: '产品列表', component: 'DataShow'},
            ],
        },
        {
            key: '/app/data/show_2', title: '新闻管理', icon: 'global',
            subs: [
                { key: '/app/data/show/type/2', title: '新闻列表', component: 'DataShow'},
            ],
        },
        {
            key: '/app/data/art_single', title: '区域管理', icon: 'appstore',
            subs: [
                { key: '/app/art_single/get/1', title: '关于我们', component: 'ArtSingleGet'},
                { key: '/app/art_single/get/2', title: '公司简介', component: 'ArtSingleGet'},
                { key: '/app/art_single/get/3', title: '人才招聘', component: 'ArtSingleGet'},
                { key: '/app/art_single/get/4', title: '解决方案', component: 'ArtSingleGet'},
                { key: '/app/art_single/get/5', title: '联系我们', component: 'ArtSingleGet'},
                { key: '/app/art_single/get/6', title: '联系我们(首页)', component: 'ArtSingleGet'},
                { key: '/app/art_single/get/7', title: '联系我们(内页)', component: 'ArtSingleGet'},
                { key: '/app/art_single/get/8', title: '页脚部分', component: 'ArtSingleGet'},
            ],
        },
        {
            key: '/app/user', title: '用户管理', icon: 'user',
            subs: [
                { key: '/app/user/show', title: '用户列表', component: 'UserShow'},
            ],
        },
    ],
    others: [
        { key: '/app/user/update_pwd', title: '修改密码', component: 'UserUpdatePwd' },
    ] // 非菜单相关路由
}