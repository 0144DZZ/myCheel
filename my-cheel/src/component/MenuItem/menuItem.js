import React,{useState} from 'react';
import {Route,Switch,Redirect,Link,withRouter} from 'react-router-dom';

const routerData = [
  {path: '/mytransfer', title: '穿梭框'},
  {path: '/mytransfer', title: 'option2'},
  {path: '/mytransfer', title: 'option5'},
  {path: '/mytransfer', title: 'option6'},
  {path: '/mytransfer', title: 'option7'},
]

function MenuItem(props){
  const [routInfo, _] = useState(routerData)
  const {Menu} = props
  const { SubMenu } = Menu
  return(
    <Menu
    mode="inline"
    theme="light"
    style={{ height: '75vh', borderRight: 0 }}
    // inlineCollapsed
  >
    {
      routInfo.map((item, idx)=>{
        return (
          <Menu.Item key={idx}>
            <Link to={item.path}>{item.title}</Link>
          </Menu.Item>
        )
      })
    }
  </Menu>
  )
}

export default MenuItem