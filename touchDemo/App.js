
//参考地址:http://xgfe.github.io/2016/08/21/lulutia/react-native-touch-animation/

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PanResponder,
    Animated,
    Dimensions,
    NativeModules,
    TouchableOpacity,
    ImagePickerIOS,
    Image,
    CameraRoll,
    Alert,
    ScrollView
} from 'react-native';
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');


import iconNoPhotos from './src/images/NoPhotos.png'

import  AssistiveTouchViewHandler from './src/AssistiveTouchViewHandler'
import ScreenShot from './src/ScreenShot'

import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions'


export  default  class App extends Component{
    constructor(props) {
        super(props);
        this.state ={
            uri: null,
            defaultUri:iconNoPhotos,
            selecetImage:[]
        }
    }
    render() {
       return(
           <View style={styles.container}>
               <ScrollView contentContainerStyle={styles.scrollView}
                           showsVerticalScrollIndicator={false}
               >
                   <TouchableOpacity onPress={this.showAssistiView}
                                     style={styles.text}
                                     activeOpacity={1}
                   >
                       <Text>点我显示悬浮球</Text>

                   </TouchableOpacity>
                   <TouchableOpacity onPress={this.hideAssistiView}
                                     style={styles.text}
                                     activeOpacity={1}
                   >
                       <Text>点我显示隐藏悬浮球</Text>

                   </TouchableOpacity>
                   <TouchableOpacity onPress={this.checkCameraAndPhotos}
                                     style={styles.text}
                                     activeOpacity={1}
                   >
                       <Text>点我判断权限</Text>

                   </TouchableOpacity>

                   <TouchableOpacity onPress={this.onPressButton}
                                     ref={ touchView => this.touchView= touchView }
                                     style={styles.text}
                                     activeOpacity={1}
                   >
                       <Text>点我截图</Text>

                   </TouchableOpacity>
                   <TouchableOpacity onPress={this.onPressButton2}
                                     style={styles.text}
                                     activeOpacity={1}
                   >
                       <Text>全屏截图</Text>

                   </TouchableOpacity>
                   <TouchableOpacity onPress={this.onPressButton3}
                                     style={styles.text}
                                     activeOpacity={1}
                   >
                       <Text>选择图片</Text>

                   </TouchableOpacity>
                   <Image style={styles.image} source={this.state.uri?{uri: this.state.uri}:require('./src/images/NoPhotos.png')}/>
                   <View style={styles.imageBox}>

                       {
                           this.state.selecetImage.length>0 &&  this.state.selecetImage.map((item,i)=>this.CreateImage(item,i))
                       }

                   </View>

               </ScrollView>
           </View>

       )

    }
    CreateImage(item,i){

        return  <Image style={styles.selectedImage} source={item.path?{uri:item.path}:require('./src/images/NoPhotos.png')}/>
    }

    showAssistiView =()=>{
        AssistiveTouchViewHandler.showAssistiVewTouchView();
    }
    hideAssistiView=()=>{
        AssistiveTouchViewHandler.hideAssistiVewTouchView();
    }
    onPressButton2 = ()=>{
        ScreenShot('window',(uri)=>{
            this.setState({uri:uri})
            Alert.alert(
                '提示:',
               '是否将截图保存到相册?',
                [
                    {text: 'Cancel', onPress: () => {}},
                    {text: 'OK', onPress: () => {this.saveImage(uri)}},
                ],
                { cancelable: false }
            )
        })
    }
    saveImage=(uri)=>{
        CameraRoll.saveToCameraRoll(uri).then(function(result) {
            // if(resultFunction){
            //     resultFunction({path:result});
            // }
            alert('保存图片成功path:'+result)
        }).catch(function(error) {
            alert('保存图片失败error:'+error)
        })
    }
    onPressButton = ()=>{
        ScreenShot(this.touchView,(uri)=>{
            this.setState({uri:uri})
            Alert.alert(
                '提示:',
                '是否将截图保存到相册?',
                [
                    {text: 'Cancel', onPress: () => {}},
                    {text: 'OK', onPress: () => {this.saveImage(uri)}},
                ],
                { cancelable: false }
            )
        })
    }

    onPressButton3= ()=>{
        ImagePicker.openPicker({
            multiple: true,
            mediaType:'photo',
            maxFiles:6
        }).then(images => {
            this.setState({selecetImage:images})
        });
    }

    checkCameraAndPhotos = () => {
        // var permissions={authorized:"用户已经授权","denied":"用户已经拒绝",'restricted':"无法开启此权限","undetermined":"尚未授权"};
        // Permissions.checkMultiple(['camera', 'photo']).then(response => {
        //     //response is an object mapping type to permission
        //      alert('相机权限:'+permissions[response.camera]+"\n相册权限:"+permissions[response.photo])
        //
        // })
        ImagePickerIOS.canUseCamera(() => alert('能获取图片'))
        ImagePickerIOS.openSelectDialog({showVideos:false}, (imagerUri) => {

            //this.setState({ image: imageUri });
            this.setState({uri:imagerUri})
            alert('imagerUri = '+imagerUri)

        }, error => console.error(error));
    }
    _requestPermission = () => {
        Permissions.request('photo').then(response => {
            // Returns once the user has chosen to 'allow' or to 'not allow' access
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            // console.log('photo: ' + response)

            alert(response)
        })
        //
        // Alert.alert(
        //     'Can we access your photos?',
        //     'We need access so you can set your profile pic',
        //     [
        //         {
        //             text: 'No way',
        //             onPress: () => console.log('Permission denied'),
        //             style: 'cancel',
        //         },
        //         this.state.photoPermission == 'undetermined'
        //             ? { text: 'OK', onPress: this._requestPermission }
        //             : { text: 'Open Settings', onPress: Permissions.openSettings },
        //     ],
        // )
    }


}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:44,
        marginBottom:44,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:'green'
        //height:150
    },
    scrollView:{
        //flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:'red'
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        //backgroundColor: 'black',
    },
    selectedImage:{
        width:50,
        height:50,
        padding:20
    },
    imageBox:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10
    },
    text: {
        alignItems: 'center',
        justifyContent: 'center',
        height:50,
        width:50,
        backgroundColor:'green',
        marginBottom:20
    }
});