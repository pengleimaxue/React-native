/**
 * CircularProgress
 * Created by penglei on 2018/6/22.
 * Copyright © 2018 penglei. All rights reserved.
 */


//使用参考https://reactnative.cn/post/306

import React, { Component } from 'react';
import    PropTypes from  'prop-types';
import {
    AppRegistry,
    StyleSheet,
    Animated,
    TouchableOpacity,
    View
} from 'react-native';

import Svg,{
    Circle,
    Text
} from 'react-native-svg';

let AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default class CircularProgress extends Component {

    static propTypes = {
        strokeWidth: PropTypes.number,//圆弧宽度
        radius: PropTypes.number,//圆半径
        arcColor:PropTypes.string,//圆弧颜色
        fillColor:PropTypes.string//填充颜色
    };
    static defaultProps ={
        strokeWidth:0,
        radius:50,
        fillColor:"transparent",
        arcColor:"red",
        messageText:""
    }
    constructor(props){
        super(props);
        this.state = {
            circleFillAnimation: new Animated.Value(0),
        };
        this.circleAnimation = this.state.circleFillAnimation.interpolate({
            inputRange: [
                0,
                100,
            ],
            outputRange: [
                this.props.radius * Math.PI *2,//圆周长
                0
            ]
        });
    }
    componentDidMount() {
        this.startAnimation();
    }

    render() {

        return (

                <Svg
                    height={(this.props.radius+this.props.strokeWidth)*2}
                    width={(this.props.radius+this.props.strokeWidth) *2}>
                    <Circle
                        cx={this.props.radius+this.props.strokeWidth}
                        cy={this.props.radius+this.props.strokeWidth}
                        r={this.props.radius}
                        stroke="gray"
                        strokeWidth={this.props.strokeWidth}
                        fill={this.props.fillColor}
                    />
                    <AnimatedCircle
                        cx={this.props.radius+this.props.strokeWidth}
                        cy={this.props.radius+this.props.strokeWidth}
                        r={this.props.radius}
                        stroke={this.props.arcColor}
                        strokeWidth={this.props.strokeWidth}
                        strokeLinecap="round"
                        fill={this.props.fillColor}
                        strokeDasharray={[100,this.props.radius * Math.PI *2-100]} strokeDashoffset={-20}//strokeDasharray属性用来设置描边的点划线的图案范式。设置实线和虚线的宽度
                                                                                    // strokeDashoffse就是设置实线和虚线的宽度就是实线虚线绘制的起点距路径开始的距离
                    />
                    <Text
                        fill="none"
                        stroke="black"
                        //fontSize="20"
                        //fontWeight="bold"
                        x={this.props.radius+this.props.strokeWidth}
                        y={this.props.radius+this.props.strokeWidth}
                        textAnchor="middle"
                    >{this.props.messageText}</Text>
                </Svg>

        );
    }
    startAnimation =()=>{
        this.state.circleFillAnimation.setValue(0);

        Animated.spring(
            this.state.circleFillAnimation,
            {
                toValue:10,
                friction: 5,
                tension: 0
            }
        ).start();
    }
}

