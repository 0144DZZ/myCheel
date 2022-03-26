// import {Route,Switch,Redirect,Link,withRouter} from 'react-router-dom';
import { Layout, Menu } from 'antd';
import RouteView from '../../page/index'
import MySider from '../LayoutSider/sider'

const { SubMenu } = Menu;
const { Header, Sider, Footer, Content } = Layout;


function MyMenu(){
  return (
    <Layout>
      <Header>
        <div style={{color:'#1890FF'}}>我的组件库</div>
      </Header>
      <Layout>
        {/* 左侧导航区 */}
        <MySider Menu={Menu} Sider={Sider}/>
        {/* 中间内容区 */}
        <Content style={{ padding: '10px 24px'}}>
          <RouteView />
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>zhaoge轮子库</Footer>
    </Layout>
  )
}

export default MyMenu