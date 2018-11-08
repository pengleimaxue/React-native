/**
 * LoadingView
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
    ActivityIndicator
} from 'react-native';

import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');

// 显示时长
const DURATION = 1000;
// LoadingView提示框透明度
const OPACITY = 0.8;

export  default class LoadingView extends Component {

    static propTypes = {
        time: PropTypes.number,
        isShow:PropTypes.bool
    }

    dismissHandler = null;
    isShow = false;

    constructor(props) {
        super(props);
        this.state = {
            message:null,
            time:DURATION,
            isShow:false,
            opacityAnimate: new Animated.Value(OPACITY), // 动画 值初始化
        }
    }

    render() {
        return this.state.isShow ?(
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <ActivityIndicator animating={true} color={'white'} size={'large'} />
                    {this.state.message && <Text style={styles.defaultText}>{this.state.message}</Text>}
                </View>
            </View>
        ):null
    }


    componentWillUnmount() {
        // 在页面生命周期结束时，解除定时器，避免内存泄漏
        clearTimeout(this.dismissHandler)
    }

    show(message = null) {
        //如果正在点击就直接返回
       /* if(this.isShow) {
            return;
        }*/

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

const styles = StyleSheet.create({
    textContainer: {
        backgroundColor: 'rgba(0,0,0,.8)',
        borderRadius: 8,
        padding: 20,
        maxWidth: width / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20
    },
    defaultText: {
        color: "#FFF",
        fontSize: 15,
    },
    container: {
        position: "absolute",
        width: width,
        height: height,
        zIndex: 9999,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',

    }
});
