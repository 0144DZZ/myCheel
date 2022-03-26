import React, { useState, useEffect } from 'react';
import PubSub from 'pubsub-js'
import { Button } from 'antd';
import LeftTree from './leftTree'
import RightTree from './rightTree'
import './Transfer.css'
function TreeTransfer(){
  let i = 1
  const left =()=>{
    // 发布我要给右边穿梭框提供数据的消息
    PubSub.publish('left',{
      left: i++
    })
  }
  const right =()=> {
    PubSub.publish('rightData',{
      left: i++
    })
  }

  return (
    <div className='max-tree-transfer'>
      <div className='tree-transfer-left'>
        <LeftTree/>
      </div>
      <div className='transfer-direction'>
        <div className='direction-button'>
          <Button onClick={left}>&gt;</Button>
          <br/>
          <br/>
          <Button onClick = {right}>&lt;</Button>

        </div>
        <div className='transfer-change-left'>
        </div>
        <div className='transfer-change-right'>
        </div>
      </div>
      <div className='tree-transfer-right'>
        <RightTree/>
      </div>
    </div>
  )
}

export default TreeTransfer