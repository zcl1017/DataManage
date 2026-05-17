module.exports = {
    name: '淘宝',
    desc: '淘宝电商系统',
    homePage: '',
    menu: [{
        key: 'product',
        name: '商品管理(拼多多)'
    }, {
        key: 'client',
        name: '客户管理(拼多多)'
    }, {
        key: 'data',
        name: '数据分析',
        menuType: 'module',
        moduleType: 'sider',
        siderConfig: {
            menu: [{
                key: 'analysis',
                name: '电商罗盘',
                menuType: 'module',
                moduleType: 'custom',
                customConfig: {
                    path: '/todo'
                }
            }, {
                key: 'analysis',
                name: '电商罗盘',
                moduleType: 'iframe',
                customConfig: {
                    path: '/todo'
                }
            }, {
                key: 'analysis',
                name: '电商罗盘',
                moduleType: 'custom',
                customConfig: {
                    path: '/todo'
                }
            }]
        }
    }]
}