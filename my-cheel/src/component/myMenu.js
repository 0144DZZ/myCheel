import { Layout, Menu } from 'antd';
import RouteView from '../page/index'

const { SubMenu } = Menu;
const { Header, Sider, Footer, Content } = Layout;


function MyMenu(){
  return (
    <Layout>
      <Header>
        <div style={{color:'#1890FF'}}>我的组件库</div>
      </Header>
      <Layout hasSider>
        <Sider  style={{width: 200}} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            theme="light"
            style={{ height: '75vh', borderRight: 0 }}
          >
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
            <SubMenu defaultCollapsed={true} key="sub1" title="subnav 1">
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280, marginLeft: 200 }}>
          <RouteView />
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>zhaoge轮子库</Footer>
    </Layout>
  )
}

export default MyMenu