import MenuItem from "../MenuItem/menuItem";

function Sider(props){
  const { Menu, Sider } = props
  return(
      <Sider 
        style={{width: 200}} 
        className="site-layout-background" 
        collapsed={false}
        // inlineCollapsed
      >
        <MenuItem Menu={Menu}/>
      </Sider>
  )
}

export default Sider