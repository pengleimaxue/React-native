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
  View,
  Button,
  Image,
  KeyboardAvoidingView,
  TextInput
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


import  ToastView from './src/ToastView'
import LoadingView from './src/LoadingView'
import  ModalDialog from './src/ModalDialog'


type Props = {};

export default class App extends Component<Props> {
    isShow = false;
  render() {
    return (

          <View style={styles.container}>

              <Button
                  style={styles.viewContent}
                  onPress={()=>this.plToast.show('我是测试toast','top')}
                  title='头部显示toast'
              />

              <Button
                  style={styles.viewContent}
                  onPress={this.show}
                  title ='中部显示toast'
              />

              <Button
                  style={styles.viewContent}
                  onPress={()=>this.plLoading.show()}
                  title ='无文字loading'
              />

              <Button
                  style={styles.viewContent}
                  onPress={()=>this.plLoading.show('加载中...')}
                  title ='loading'
              />

              <Button
                  style={styles.viewContent}
                  onPress={this.funAlert1}
                  title ='alert 底部button多个按钮'
              />

              <Button
                  style={styles.viewContent}
                  onPress={this.funAlert2}
                  title ='alert两个button按钮'
              />

              <Button
                  style={styles.viewContent}
                  onPress={this.funAlert3}
                  title ='alert自定义title内容'
              />

              <Button
                  style={styles.viewContent}
                  onPress={()=>this.plToast.show('我是测试toast','bottom')}
                  title ='底部显示toast'
              />

              <KeyboardAvoidingView behavior='padding'>

              <TextInput
                  style={{height:50, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text)=>this.plToast.show(text,'center')}
                  placeholder='输入测试'
              />

              </KeyboardAvoidingView>

              <ToastView
                  onDismiss={() => {
                      //alert('toast消失了');
                  }}
                  ref={(element) => {
                      this.plToast = element;
                  }}
              />

              <LoadingView
                  onDismiss={() => {

                  }}
                  ref={(element) => {
                      this.plLoading = element;
                  }}
              />

              <ModalDialog ref="doAlert1"/>
              <ModalDialog ref="doAlert2"/>
              <ModalDialog  components={<MyView/>} ref="doAlert3" />

          </View>
    );
  }

    show=() =>{
      if(this.isShow) {
          this.plToast.show('我是测试toast我是测试toast我是测试toast我是测试toast我是测试toast我是测试toast我是测试toast我是测试toast');
          this.isShow = false;
      } else  {
          this.plToast.show('我是测试toast');
          this.isShow = true;
      }
}
    funAlert1=()=>{
        var options={
            headTitle:'提示title',
            innersWidth:300,
            innersHeight:150,
            messText:'title内容',
            headStyle:{
                backgroundColor:'#e6456e',
                color:'#ffffff'
            },
            buttons:[
                {
                    txt:'按钮1'
                },
                {
                    txt:'按钮2'
                },
                {
                    txt:'按钮3'
                },
                {
                    txt:'按钮4'
                }
            ]
        }
        this.refs.doAlert1.show(options)
    }

    funAlert2=()=>{
        var options={
            headTitle:'购买',
            messText:'支付前请确认支付信息',
            headStyle:{backgroundColor:'#ff6600',color:'#ffffff',fontSize:18},
            buttons:[
                {
                    txt:'取消',
                    btnStyle:{backgroundColor:'transparent'},
                    txtStyle:{color:'#ff6600'},
                    onpress:this.cancelButton
                },
                {
                    txt:'确定',
                    btnStyle:{backgroundColor:'#ff6600'},
                    txtStyle:{color:'#ffffff'},
                }
            ]
        }
        this.refs.doAlert2.show(options)
    }

    funAlert3=()=>{
        var options={
            headTitle:'提示title',
            messText:'我是其他内置信息',
            headStyle:{
                backgroundColor:'#e6456e',
                color:'#ffffff'
            },
            buttons:[
                {
                    txt:'取消'
                },
                {
                    txt:'确定'
                }
            ]
        }
        this.refs.doAlert3.show(options)
    }
    cancelButton=()=>{
        this.refs.doAlert1.show({
            hiddenTitle:true,
            headStyle:{backgroundColor:'#ff6600',color:'#ffffff',fontSize:24},
            messText:'你已经取消支付',
            buttons:[{txt:'点击确认'}],
            innersWidth:300,
            innersHeight:150,
        })
    }

}
class MyView extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={[styles.conView]}>
                <Image source={require('./src/57-57.png')} style={{width:32,height:32}} />
                <Text style={[styles.textView,{width:120,paddingLeft:15}]}>我是外部自定义内容</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin:20
  },
  viewContent: {
      width: 100,
      height: 100,

  },
  conView:{
      flex: 1,
      flexDirection:'row',
      justifyContent: 'center',
      alignItems: 'center',

  },
  textView:{
      textAlign:'center',
      textAlignVertical:'center',
  }

});
