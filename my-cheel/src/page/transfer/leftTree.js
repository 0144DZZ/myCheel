import React, {useState,useEffect} from 'react';
import PubSub from 'pubsub-js'
import {Tree} from 'antd';
let treeData = [
  {
    title: '助手',
    key: '1',
    children: [
      {
        title: '签到',
        key: '10',
      },
      {
        title: '睡觉',
        key: '11',
      },
      {
        title: '打豆豆',
        key: '12',
      },
    ],
  },
  {
    title: '浏览器',
    key: '2',
    children: [
      {
        title: '签到2',
        key: '22',
      },
      {
        title: '睡觉2',
        key: '23',
      },
    ],
  },
  {
    title: 'spay',
    key: '3',
    children: [
      {
        title: '畅想',
        key: '32',
      },
      {
        title: '华为',
        key: '33',
      },
      {
        title: '中心',
        key: '34',
      },
    ],
  }
];
let rightTreeData = []
let obj = {}
let newTreeData = []

function LeftTree() {
  const [checkedKeys, setCheckedKeys] = useState(treeData);
  const [treeDataList, setTreeDataList] = useState(treeData)
  // 右边传递过来的数据
  const [rightDataList, setRightDataList] = useState([])
  const [checkeEvent, setCheckedEvent] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [info, setInfo] = useState(false)
  useEffect(() => {
    PubSub.subscribe('left', (msg, info) => {
      setInfo(info.left)
    })
    PubSub.subscribe('leftTreeData', (msg, info)=>{
      // console.log('right',msg, info);
      setRightDataList(info.leftTreeData)
      rightData(info.leftTreeData)
    })
    PubSub.subscribe('rightData', (msg, info)=>{
      setInfo(info.left)
    })
    // rightData()
    filterLeftData()
    return () => {
      PubSub.unsubscribe(info)
    }
  }, [info])

  // 接收处理右边传递过来的数据
  const rightData =(data)=>{
    let newTreeDataList = JSON.parse(JSON.stringify(treeDataList))
    newTreeDataList.map(item=>{
        data.map(ditem=>{
          console.log('ditem',ditem);
          ditem.children.filter(dfitem=>{
            delete dfitem.sign
            delete dfitem.signLeft
            console.log('item,ditem',item,ditem);
            if(item.key === ditem.key){console.log('11111');
              item.children.push(dfitem)
            }else{
              console.log('我需要重写创建一个obj');
            }
          })
        })
      // 单独对item去重
      item.children = filteItem(item)
    })
    setTreeDataList(newTreeDataList)
  }
  const filteItem =(item)=>{
    let newObj = {}
    let newItem = item.children.reduce((item,next)=>{
      newObj[next.key] ? '' : newObj[next.key] = true && item.push(next);
      return item;
    },[])
    return newItem
  }

  const filterLeftData = () => {
    if (info) {
      if(!checkeEvent){
        // 没有勾选任何内容
        return
      }else{
        // 我要给右边的树发送数据了
        renderRight()
      }
      
    }
  }
  // 渲染右边的树组件
  const renderRight = ()=>{
    let r = 1
    // 发送数据之前，处理左边的数据
    disposeLeftTreeData()
    PubSub.publish('right',{
      r: r++,
      rightTreeData: rightTreeData
    })
  }
  // 点击向右边传输数据的时候，处理左边的数据
  const disposeLeftTreeData =()=>{
    treeData.map(titem=>{
      rightTreeData.map(ritem=>{
        if(ritem.key === titem.key){
          titem.children.filter(tfitem=>{
            ritem.children.filter(rfitem=>{
              if(tfitem.key === rfitem.key){
                // 给勾选了打上一个标识，用于向右边传输数据的时候，删除左边的数据
                tfitem.sign = true
              }
            })
          })
        }
      })
    })
    deleteSignData()
  }
  const deleteSignData =()=>{
    let newData = treeData.map(item=>{
      let newChildren = item.children.filter(ifItem=>!ifItem.sign)
      item.children = newChildren
      return item
    })
    treeData = newData.filter(item=>item.children)
    // console.log('treeData',treeData);
    setTreeDataList(treeData)
    return
  }


  // 勾选保存key
  const checkSaveKey =(value)=>{
    const {checkedNodes} = value
    // console.log('checkedNodes',checkedNodes);
    const rightData = []
    const surplus = []
    if(!checkedNodes.length){
      rightData = []
      return
    }
    // 判断是否勾选了全部
    checkedNodes.filter(item=>{
      if(item.children){
        rightData.push(item)
      }else{
        surplus.push(item)
      }
    })
    disposeSurplusKey(surplus)
    // push之前需要判断数据中是否存在相同的数据
    if(!rightData.length) return
    if(rightTreeData.length){
      rightTreeData.map(item=>{
        rightData.map(item2=>{
          if(item.key !== item2.key){
            rightTreeData = [...rightData]
          }
        })
      })
    }else{
      rightTreeData = [...rightData]
    }
    disposeSurplusKey(surplus)
  }
  // 处理剩余的key
  const disposeSurplusKey =(surplus)=>{
    treeData.map(item=>{
      item.children.filter(citem=>{
        surplus.filter(ritem=>{
          if(citem.key === ritem.key){
            // 创建新的活动对象
            activityObj(item,ritem)
          }
        })
      })
    })
  }

  const activityObj =(item,ritem)=>{
    let o = new Object()
    if(obj.key !== item.key){
      o.key = item.key
      o.title = item.title
      o.children = []
      o.children.push(ritem)
      obj = o
      newTreeData.push(obj)
    }else{
      obj.children.push(ritem)
    }
    // 数组对象去重
    removeDuplicates()
  }
  const removeDuplicates = ()=>{
    // 数组对象去重
    let newObj = {}
    newTreeData = newTreeData.reduce((item,next)=>{
      newObj[next.key] ? '' : newObj[next.key] = true && item.push(next);
      return item;
    },[])
    newTreeData.filter(fitem=>{
      let newFitem = fitem.children.reduce((item,next)=>{
        newObj[next.key] ? '' : newObj[next.key] = true && item.push(next);
        return item;
      },[])
      fitem.children = newFitem
    })
    rightTreeData = newTreeData
  }

  const onCheck = (checkedKeysValue, e) => {
    checkSaveKey(e)
    // 每次勾选都需要通过child的key去查找父亲的key
    setCheckedKeys(checkedKeysValue);
    setCheckedEvent(e)
  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  return ( 
    <div>
      <Tree 
        checkable 
        autoExpandParent = {true}
        defaultExpandParent = {false}
        defaultExpandAll = {true}
        onCheck = {onCheck}
        checkedKeys = {checkedKeys}
        onSelect = {onSelect}
        selectedKeys = {selectedKeys}
        treeData = {treeDataList}
      />
    </div>
  )
}

export default LeftTree