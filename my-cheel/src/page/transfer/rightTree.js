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
];

let obj = {}
let newTreeData = []
let leftTreeData = []




function RightTree(){
  const [checkedKeys, setCheckedKeys] = useState(treeData);
  const [treeDataList, setTreeDataList] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [info, setInfo] = useState(false)
  useEffect(()=>{
    PubSub.subscribe('right', (msg, info)=>{
      console.log('msg',msg,info);
      const {rightTreeData} = info
      if(rightTreeData){
        treeData = rightTreeData
        setTreeDataList(rightTreeData)
      } 
    })
  },[info])
  useEffect(()=>{
    PubSub.subscribe('rightData', (msg, info)=>{
      console.log('msg, info----',msg, info);
      filterLeftData()
    })
  },[info.left])

  const checkSaveKey =(value)=>{
    const {checkedNodes} = value
    let rightData = []
    const surplus = []
    console.log('checkedNodes',checkedNodes);
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
    if(leftTreeData.length){
      leftTreeData.map(item=>{
        rightData.map(item2=>{
          if(item.key !== item2.key){
            leftTreeData = [...rightData]
          }
        })
      })
    }else{
      leftTreeData = [...rightData]
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
    // 创建一个新的obj
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
    console.log('最终的newTreeData',newTreeData);
    leftTreeData = newTreeData
  }
  
  // 发送数据给左边
  const filterLeftData = () => {
    console.log('6666',leftTreeData);
    if(leftTreeData.length){
      renderLeft()
    }
  }
  
  // 发送数据给左边
  const renderLeft=()=>{
    // 发送数据之前，处理右边的数据
    disposeRightTreeData()
    PubSub.publish('leftTreeData',{
      leftTreeData: leftTreeData
    })
  }
  
  // 点击向左边传输数据的时候，处理左边的数据
  const disposeRightTreeData =()=>{
    treeData.map(titem=>{
      leftTreeData.map(ritem=>{
        if(ritem.key === titem.key){
          titem.children.filter(tfitem=>{
            ritem.children.filter(rfitem=>{
              if(tfitem.key === rfitem.key){
                // 给勾选了打上一个标识，用于向右边传输数据的时候，删除左边的数据
                tfitem.signLeft = true
              }
            })
          })
        }
      })
    })
    console.log('treeData',treeData);
    deleteSignData()
  }
  // 删除已经被表示的item
  const deleteSignData =()=>{
    let newData = treeData.map(item=>{
      let newChildren = item.children.filter(ifItem=>!ifItem.signLeft)
      item.children = newChildren
      return item
    })
    treeData = newData.filter(item=>item.children.length)
    setTreeDataList(treeData)
    return
  }
  
  const onCheck = (checkedKeysValue, e) => {
    setCheckedKeys(checkedKeysValue);
    checkSaveKey(e)
  };
  
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  return(
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
    )
  }
  
  export default RightTree