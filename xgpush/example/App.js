/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import XGPush from '@sdk-react-native/xgpush'

type Props = {};

export default class App extends Component<Props> {

    componentDidMount() {

        XGPush.listenXGPushDidRegisterDeviceTokenEvent(
            (reminder) => (this.setState({token:'token ='+reminder.deviceToken}))
        )

        XGPush.listenDidReceiveRemoteNotification(this.getNotificationText);
        XGPush.listenDidLaunchAppByOpenNotification(this.getNotificationText);

        XGPush.listenXGPushDidFinishStartEvent(
            (reminder) => (this.setState({xgStartMs:'信鸽启动状态'+reminder.isSuccess}))
        );

        XGPush.listenDidRegisterForRemoteNotification(
            (deviceToken) => (this.setState({token:'token ='+deviceToken}))
        );

        XGPush.listenDidFailToRegisterForRemoteNotification((error)=>{
            alert('注册失败');
        });
        XGPush.listenXGPushRegisterEvent(
            (deviceToken) => (this.setState({token:'token ='+deviceToken}))
        );

        XGPush.enableDebug(true);//开启信鸽Debug日志
        if (Platform.OS == "android") {
            XGPush.registerPush();//注册信鸽推送
        }
        if (Platform.OS == "iOS") {
            XGPush.starXG(2200279983,'IXSP7W75E58Q');//设置信鸽参数
        }

    }

    componentWillUnmount() {
        XGPush.removeAllListener();
    }

    constructor(props){
        super(props);
        this.state = {
            token:'',
            message:'暂时没有推送',
            xgStartMs:''
        }
    }
    getNotificationText=(userInfo)=> {
        if (userInfo.aps) {
            let myAlert = userInfo.aps.alert;
            if (myAlert) {
                this.setState({message: myAlert.body})

            }
        } else {
            this.setState({message: '标题:'+userInfo.Title+' 内容:'+userInfo.Content})
        }
    }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
            {this.state.xgStartMs}
        </Text>
        <Text style={styles.instructions}>
            {this.state.token}
        </Text>
        <Text style={styles.instructions}>
         推送消息: {this.state.message}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
