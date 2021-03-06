import React, { Component } from 'react'
import { Link, Redirect, withRouter } from "react-router-dom"
import { Menu } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';

import "./index.css"
import Logo from "../../assets/image/logo.png"
import itemList from "../../config/menuConfig"
import memoryUtils from "../../utils/memoryUtils";
import cookie from "react-cookies"

const { SubMenu } = Menu;


class LeftNav extends Component {

  /*
判断当前登陆用户对item是否有权限
 */
  hasAuth = (item) => {
    const { key, isPublic } = item

    // const user = JSON.parse(cookieStr.slice(2, cookieStr.length))
    //   const menus = user.role.menus;
    //   const username = user.username

    console.log('leftnav',memoryUtils.user)
    if(memoryUtils.user === {}){
      return <Redirect to="/login"/>
    }
    const username = memoryUtils.user.username
    const menus = memoryUtils.user.role.menus
    // const username = '123'
    // const menus = []

    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }

    return false
  }

  // 使用map+递归调用
  // getMenuNodes = (itemList) => {
  //     // path 有可能是子路由
  //     const path = this.props.location.pathname
  //     return itemList.map((item) => {
  //         // console.log(item.key)
  //         if (!item.children) {
  //             return (
  //                 <Menu.Item key={item.key} icon={<PieChartOutlined />}>
  //                     <Link to={item.key}>{item.title}</Link>
  //                 </Menu.Item>
  //             )
  //         } else {

  //             const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
  //             if(cItem){
  //                 this.openKey = item.key
  //             }
  //             return (
  //                 <SubMenu key={item.key} icon={<PieChartOutlined />} title={item.title}>
  //                     {this.getMenuNodes(item.children)}
  //                 </SubMenu>
  //             )
  //         }
  //     })
  // }
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname

    return menuList.reduce((pre, item) => {

      // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        // 向pre添加<Menu.Item>
        if (!item.children) {
          pre.push((
            <Menu.Item key={item.key} icon={<PieChartOutlined />}>
              <Link to={item.key}>

                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {

          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key
          }


          // 向pre添加<SubMenu>
          pre.push((
            <SubMenu
              icon={<PieChartOutlined />}
              key={item.key}
              title={
                <span>

                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }

      return pre
    }, [])
    // 第三个参数是一个空数组
  }

  // UNSAFE_componentWillMount(){
  //     this.menuNodes = this.getMenuNodes
  // }
  render() {
    // 这一步应该放到willmount声明周期函数里，因为它只需要执行一次
    const menuNodes = this.getMenuNodes(itemList)
    let path = this.props.location.pathname
    // console.log(path)
    if (path.indexOf('/product') === 0) {
      path = "/product"
    }
    const openkey = this.openKey

    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={Logo} alt="" />
          <h2>后台应用</h2>
        </Link>

        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openkey]}
          mode="inline"
          theme="dark"
        >
          {
            menuNodes
          }


        </Menu>

      </div>
    )
  }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav)

// 静态左侧导航

{/* <Menu.Item key="home" icon={<PieChartOutlined />}>
                            <Link to="/home">首页</Link> 
                        </Menu.Item>

                        <SubMenu key="sub1" icon={<MailOutlined />} title="商品">

                            <Menu.Item key="category" icon={<PieChartOutlined />}>
                                <Link to="/category">品类管理</Link>
                            </Menu.Item>
                            <Menu.Item key="product" icon={<PieChartOutlined />}>
                                <Link to="/product">商品管理</Link>
                            </Menu.Item>

                        </SubMenu>
                        <Menu.Item key="user" icon={<PieChartOutlined />}>
                            <Link to="/user">用户管理</Link>
                        </Menu.Item>
                        <Menu.Item key="role" icon={<PieChartOutlined />}>
                            <Link to="/role">角色管理 </Link>
                        </Menu.Item>
                        <SubMenu key="sub2" icon={<MailOutlined />} title="图形图表">

                            <Menu.Item key="7" icon={<PieChartOutlined />}>品类管理</Menu.Item>
                            <Menu.Item key="8" icon={<PieChartOutlined />}>商品管理</Menu.Item>

                        </SubMenu>
                         */}
