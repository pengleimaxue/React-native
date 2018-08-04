/**
 * AssistiveTouchViewHandler
 * Created by penglei on 2018/7/27.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, { Component } from 'react';

import  AssistiveTouchView  from './AssistiveTouchView'
import RootSiblings from 'react-native-root-siblings';

import iconAdd from './images/gf_sdk_float_btn_account_manager_pressed.png';
import iconSetting from './images/gf_sdk_float_btn_client_server_pressed.png';
import iconEmail from './images/gf_sdk_float_btn_member_normal.png';

var elements = [];

export default  class AssistiveTouchViewHandler extends Component{

   static showAssistiVewTouchView(size = 55) {
       let sibling = new RootSiblings( <AssistiveTouchView
           size={size}
           buttons={[
               {ImagePath:iconAdd,onpress:this.onPressButton},
               {ImagePath:iconSetting,onpress:this.onPressButton},
               {ImagePath:iconEmail,onpress:this.onPressButton}
           ]}
       >
       </AssistiveTouchView>
       );
        onPressButton =()=>{

       }
       elements.push(sibling);
}

 static hideAssistiVewTouchView(){
       let lastSibling = elements.pop();
        lastSibling && lastSibling.destroy();
 }

}
