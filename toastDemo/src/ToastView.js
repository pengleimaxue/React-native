/**
 * ToastView
 * Created by penglei on 2018/6/15.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React,{Component}from 'react';
import {
    StyleSheet,
    View,
    Easing,
    Dimensions,
    Text,
    Animated,
    ActivityIndicator,
    Keyboard,
    Platform
} from 'react-native';

import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
// 显示时长
const DURATION = 1000;
// Toast提示框透明度
const OPACITY = 0.8;

export  default  class ToastView extends Component {

    static propTypes = {
        message:PropTypes.string,
        time: PropTypes.number,
        isShow:PropTypes.bool,
        toastStartPosition:PropTypes.string,
        keyboardHeight:PropTypes.number,
        marginBottom:PropTypes.number,
        containerTop:PropTypes.number
    }

    dismissHandler = null;
    isShow = false;

    constructor(props) {
        super(props);
        this.state = {
            message:'',
            time:DURATION,
            isShow:false,
            toastStartPosition:'center',//toast展示的位置，默认中间位置
            opacityAnimate: new Animated.Value(OPACITY), // 动画 值初始化
            keyboardHeight:0,//键盘高度
            marginBottom:0,//距离底部高度
            containerTop:0//距离顶部偏移
        }
    }

    render() {
        return this.state.isShow ?(
            <View style={[styles.container,{marginTop:this.state.containerTop}]} pointerEvents='none' >{/*pointerEvents='none'*/}
                    <Animated.View style={[styles.textContainer, { opacity: this.state.opacityAnimate,alignSelf:this.state.toastStartPosition,marginBottom:this.state.marginBottom +this.state.keyboardHeight}]}>
                        <Text
                        style={styles.defaultText}>{this.state.message}
                        </Text>
                    </Animated.View>
            </View>
        ):null
    }
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.state.keyboardHeight = 0;
        // 在页面生命周期结束时，解除定时器，避免内存泄漏
        clearTimeout(this.dismissHandler)
        //移除键盘监听
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    //键盘监听事件
    _keyboardDidShow =(e) =>{
        this.state.keyboardHeight=e.endCoordinates.height;
    }

    _keyboardDidHide= ()=> {
        if(this.state) {
            this.state.keyboardHeight = 0;
        }
    }

    show(message, position = 'center') {
       if(this.isShow){
           clearTimeout(this.dismissHandler);
           this.state.isShow = false;
       }
        this.isShow = true;
        switch (position) {
            case 'top': {
                this.state.toastStartPosition = 'flex-start';
                this.state.marginBottom = 0;
                if(isIphoneX() && height>width){
                    this.state.containerTop = 10;
                }
                if (height<width){
                    this.state.containerTop = -20;

                }
            }
               break;
            case  'center':{
                this.state.toastStartPosition = 'center';
                this.state.marginBottom = 0;
                this.state.containerTop = 0;
            }
                break;
            case 'bottom': {
                this.state.toastStartPosition = 'flex-end';
                if(isIphoneX()) {
                    this.state.marginBottom = 44;
                }else {
                    this.state.marginBottom =20;
                    this.state.containerTop= 0;
                }
            }
                break;
            default:
                break;
        }
        this.setState({
            isShow:true,
            message:message
        });
        this.state.opacityAnimate.setValue(OPACITY);
        this.state.isShow =true;
        if (this.dismissHandler) {
            clearTimeout(this.dismissHandler);
        }
        this.dismissHandler = setTimeout(() => {
            // 开启动画
            Animated.timing(this.state.opacityAnimate, {
                toValue: 0.0,
                duration: 600,
            }).start(() => {
                // 动画结束后，初始化状态
                this.setState({
                    isShow: false,
                });
                this.isShow = false;
                this.onDismiss();
            });
        }, this.state.time);
    }

    onDismiss = () => {
        if (this.props.onDismiss) {
            this.props.onDismiss()
        }
    }
}

//判读是否是iPhoneX
function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((height=== X_HEIGHT && width=== X_WIDTH) ||
            (height === X_WIDTH && width === X_HEIGHT))
    )
}

const styles = StyleSheet.create({
    textContainer: {
        backgroundColor: 'rgba(0,0,0,.8)',
        borderRadius: 8,
        padding: 10,
        maxWidth: width/5*4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultText: {
        color: "#FFF",
        fontSize: 15,
    },
    container: {
        position: "absolute",
        width: width,
        height: height,
        zIndex: 99999,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',

    }
});
