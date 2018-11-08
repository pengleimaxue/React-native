/**
 * PercentageCircle
 * Created by penglei on 2018/6/25.
 * Copyright © 2018 penglei. All rights reserved.
 */

/*
* 用来为Wedge绘制的圆形设置动画效果，已经精简对外接口属性
* */

import React, {Component} from 'react';
import  PropTypes from 'prop-types'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated
} from 'react-native';

import Wedge from './Wedge';


const AnimatedWD = Animated.createAnimatedComponent(Wedge);


export default class PercentageCircle extends Component {

    static defaultProps = {
        durtime: 1000,
        needsContent:false,
        circleWidth:10,
        startAngle:0
    };

    //备注：设置圆弧颜色用ART绘图自带属性 fill 设置颜色即可，其他设置属性如下进行相应设置即可
    static propTypes = {
        durtime: PropTypes.number,//动画延长时间默认1000
        startAngle: PropTypes.number,//起始点角度
        circleWidth:PropTypes.number,//圆环宽度
        radius: PropTypes.number.isRequired,//圆半径
        needsContent:PropTypes.bool,//是否需要圆中心自定义视图
        percentValue:PropTypes.number.isRequired,//进度百分比
    };


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.startAnimate()
    }

    startAnimate = ()=> {
        if(this.props.percentValue){
            this.state.progress.setValue(this.props.startAngle);
            Animated.timing(this.state.progress, {
                toValue: this.props.percentValue * 360,//最终圆弧度
                duration: this.props.durtime
            }).start();
        }


    }

    render() {

        const {durtime,endAngle,innerRadius,outerRadius,originX,originY, ...other} = this.props;

        return (
            <AnimatedWD
                {...other}
                innerRadius = {this.props.radius}
                outerRadius={this.props.radius+this.props.circleWidth}
                originX={(this.props.radius+this.props.circleWidth)/2}
                originY={(this.props.radius+this.props.circleWidth)/2}
                endAngle={this.state.progress}
            />
        );
    }

}