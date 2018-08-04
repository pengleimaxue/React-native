/**
 * AssistiveTouchView
 * Created by penglei on 2018/7/23.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, { Component } from 'react';
import ReactNative,{
    AppRegistry,
    StyleSheet,
    Text,
    View,
    PanResponder,
    Animated,
    Dimensions,
    UIManager,
    Modal,
    Platform
} from 'react-native';
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

// 定时器时长
const DURATION = 3000;
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812
import PropTypes from 'prop-types';
import AssistiveButton from "./AssistiveButton";
import Orientation from 'react-native-orientation';

import iconCenterNomal from './images/gf_sdk_float_logo_normal.png';
import iconCenterTransparent from'./images/gf_sdk_float_logo_transparent.png'


export  default  class AssistiveTouchView extends Component{

    constructor(props) {
        //加载父类方法,不可省略
        super(props);
        //设置初始的状态
        this.state = {
            top:deviceHeight>deviceWidth?44:10,
            left:0,
            progress: new Animated.ValueXY({x:0,y:deviceHeight>deviceWidth?44:10}),
        };
    }
    componentWillMount() {
        this._animatedValue = new Animated.ValueXY();
        this._buttonTimer = null;
        this._value = {x:0,y:deviceHeight>deviceWidth?44:10};
        this._top = this._value.y;
        this._left = this._value.x;
        //监听value值变化
        this.state.progress.addListener((value) => {this._value = value});
        this._panResponder = PanResponder.create({
            //用户开始触摸屏幕的时候，是否愿意成为响应者
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            //在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            //开始手势操作
            onPanResponderGrant: this._handlePanResponderGrant,
            //移动距离
            onPanResponderMove:this._handlePanResponderMove,
            // 用户放开了所有的触摸点，且此时视图已经成为了响应者。一般来说这意味着一个手势操作已经成功完成。
            onPanResponderRelease: this._handlePanResponderEnd,
            //另一个组件已经成为了新的响应者，所以当前手势将被取消
            onPanResponderTerminate: this._handlePanResponderEnd,
        });
    }
    componentWillUnmount() {
      this._clearTimer();
    }

    componentDidMount() {
        this._buttonTimer = setTimeout(() => {
            // this.setState({
            //     left:-this.props.size/2
            // },()=>{
            //     this.refs.actionButton.setState({iconButtonCenter:iconCenterTransparent});
            // });
            this.refs.actionButton.setState({iconButtonCenter:iconCenterTransparent},()=>{
                //this.state.progress.setValue({x:-this.props.size/2,y:this._value.y})
                Animated.timing(this.state.progress, {
                    toValue: {x:-this.props.size/2,y:this._value.y},
                    tension: 80
                }).start(()=>{
                    this._left = this._value.x;
                    this._top = this._value.y;
                });
            });
        },DURATION/2);
    }
    _handleStartShouldSetPanResponder = (e, gestureState)=>{
        return true;
    }
    _handleMoveShouldSetPanResponder=(e, gestureState)=>{
        return true;
    }
    _handlePanResponderGrant=(e, gestureState)=>{
        this._clearTimer();
        this.refs.actionButton._closeButtonView();
        let offSetOriginalX=this._value.x;
        if(offSetOriginalX===-this.props.size/2){
            this.refs.actionButton.setState({iconButtonCenter:iconCenterNomal},()=>{
                //this.state.progress.setValue({x:0,y:this._value.y})
                Animated.timing(this.state.progress, {
                    toValue: {x:0,y:this._value.y},
                    tension: 80
                }).start();
            });

        }else  if(offSetOriginalX===deviceWidth-this.props.size/2){
            let offSetX = deviceWidth-this.props.size;
            this.refs.actionButton.setState({iconButtonCenter:iconCenterNomal},()=>{
                Animated.timing(this.state.progress, {
                    toValue: {x:offSetX,y:this._value.y},
                    tension: 80
                }).start();
            });

        }else {
            this.refs.actionButton.setState({iconButtonCenter:iconCenterNomal});
        }

    }

    _handlePanResponderMove=(e, gestureState)=>{

        this.state.progress.setValue({x:this._left+gestureState.dx,y:this._top+gestureState.dy})
    }
    _handlePanResponderEnd=(e, gestureState)=>{
        //手势停止获取绝对位置
        UIManager.measure(ReactNative.findNodeHandle(this.refs.actionButton), (x, y, width, height, pageX, pageY)=>{
            let offSetY = pageY;
            let offSetX= pageX;
            if(pageY<44 ){
                if(deviceWidth>deviceHeight){
                    offSetY = 10;
                }else {
                    offSetY =44;
                }
            } else if  (pageY>=deviceHeight-this.props.size/2-40){
                offSetY = deviceHeight-this.props.size/2-40;
            }
            if(pageX>=deviceWidth/2){
             offSetX = deviceWidth-this.props.size;
                this.refs.actionButton.setState({position:"left"});
            }else  {
              offSetX = 0;
              this.refs.actionButton.setState({position:"right"});
            }
            Orientation.getSpecificOrientation((error,specificOrientation)=>{
                //alert(specificOrientation)
                if((specificOrientation==='LANDSCAPE-LEFT' &&pageX<deviceWidth/2) ||(specificOrientation==='LANDSCAPE-RIGHT'&&pageX>=deviceWidth/2)){
                    if ( (deviceWidth>deviceHeight&&isIphoneX() && pageY<= deviceHeight/2-this.props.size)){
                        offSetY = 10;
                    } else  if (deviceWidth>deviceHeight&&isIphoneX() && pageY> deviceHeight/2-this.props.size){
                        offSetY = deviceHeight-this.props.size-30;
                    }
                }
                Animated.timing(this.state.progress, {
                    toValue: {x:offSetX,y:offSetY},
                    tension: 80
                }).start(()=>{
                    this._left = offSetX;
                    this._top = offSetY;
                    this._buttonTimer = setTimeout(() => {
                        let setX = offSetX;
                        if(offSetX>0){
                            setX=offSetX+this.props.size/2;
                        }else {
                            setX = -this.props.size/2;
                        }
                        this.refs.actionButton.setState({iconButtonCenter:iconCenterTransparent},()=>{
                            Animated.timing(this.state.progress, {
                                toValue: {x:setX,y:this._value.y},
                                tension: 80
                            }).start(()=>{
                                this._left = this._value.x;
                                this._top = this._value.y;
                            });
                        });

                    },DURATION);
                });
            });

        });
    }

   _buttonClick = ()=>{
        this._clearTimer();
       let offSetOriginalX = this._value.x;
        if(offSetOriginalX===-this.props.size/2){
            let offSetX = 0;
            this.refs.actionButton.setState({iconButtonCenter:iconCenterNomal},()=>{
                Animated.timing(this.state.progress, {
                    toValue: {x:offSetX,y:this._value.y},
                    tension: 80
                }).start(()=>{
                    this._left = this._value.x;
                    this._top = this._value.y;
                    this._buttonTimer = setTimeout(() => {
                        this.refs.actionButton._closeButtonView();
                        this.refs.actionButton.setState({iconButtonCenter:iconCenterTransparent},()=>{
                            Animated.timing(this.state.progress, {
                                toValue: {x:offSetOriginalX,y:this._value.y},
                                tension: 80
                            }).start(()=>{
                                this._left = this._value.x;
                                this._top = this._value.y;
                            });
                        });
                    },DURATION);
                });
            });

        }else  if(offSetOriginalX===deviceWidth-this.props.size/2){
            let offSetX = deviceWidth-this.props.size;
            this.refs.actionButton.setState({iconButtonCenter:iconCenterNomal},()=>{
                Animated.timing(this.state.progress, {
                    toValue: {x:offSetX,y:this._value.y},
                    tension: 80
                }).start(()=>{
                    this._left = this._value.x;
                    this._top = this._value.y;
                    this._buttonTimer = setTimeout(() => {
                        this.refs.actionButton._closeButtonView();
                        this.refs.actionButton.setState({iconButtonCenter:iconCenterTransparent},()=>{
                            Animated.timing(this.state.progress, {
                                toValue: {x:offSetOriginalX,y:this._value.y},
                                tension: 80
                            }).start(()=>{
                                this._left = this._value.x;
                                this._top = this._value.y;
                            });
                        });
                    },DURATION);
                });
            });
        }else if(offSetOriginalX===0){
            this._buttonTimer = setTimeout(() => {
                this.refs.actionButton._closeButtonView();
                this.refs.actionButton.setState({iconButtonCenter:iconCenterTransparent},()=>{
                    Animated.timing(this.state.progress, {
                        toValue: {x:-this.props.size/2,y:this._value.y},
                        tension: 80
                    }).start(()=>{
                        this._left = this._value.x;
                        this._top = this._value.y;
                    });
                });
            },DURATION);
        } else if (offSetOriginalX===deviceWidth-this.props.size){
            this._buttonTimer = setTimeout(() => {
                this.refs.actionButton._closeButtonView();
                this.refs.actionButton.setState({iconButtonCenter:iconCenterTransparent},()=>{
                    Animated.timing(this.state.progress, {
                        toValue: {x:deviceWidth-this.props.size/2,y:this._value.y},
                        tension: 80
                    }).start(()=>{
                        this._left = this._value.x;
                        this._top = this._value.y;
                    });
                });
            },DURATION);
        }
   }


    _clearTimer = ()=>{
        if(this._buttonTimer) {
            // 在页面生命周期结束时，解除定时器，避免内存泄漏
            clearTimeout(this._buttonTimer);
            this._buttonTimer = null;
        }
    }
    render() {
        return (
                <Animated.View
                    style={[
                        styles.box,
                        {left:this.state.progress.x,top:this.state.progress.y}
                    ]}

                    {...this._panResponder.panHandlers}
                >
                    <AssistiveButton size={this.props.size}
                                     ref="actionButton"
                                     buttons={this.props.buttons}
                                     buttonClick={this._buttonClick}
                    />
                </Animated.View>
        );
    }

}

//判读是否是iPhoneX
function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((deviceHeight=== X_HEIGHT && deviceWidth=== X_WIDTH) ||
            (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
    )
}


AssistiveTouchView.defaultProps = {
    size: 40,
    buttons:[],                  //底部按钮数组
};

AssistiveTouchView.propTypes = {
    size: PropTypes.number,
    buttons:PropTypes.array
};


var styles = StyleSheet.create({
    box: {
        position:'absolute',
        zIndex: 99999,
        elevation: 99999,//针对安卓加上该属性
    }
});