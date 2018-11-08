/**
 * Wedge
 * Created by penglei on 2018/6/25.
 * Copyright © 2018 penglei. All rights reserved.
 */

//画圆参考https://github.com/reactjs/react-art/blob/master/src/Wedge.art.js

/*
* 目前功能用来绘制圆形弧形以及自定义圆中心内容
* */

import React, { Component } from 'react';
import { ART, StyleSheet, View, Text } from 'react-native';
const { Shape, Path,Surface } = ART;
import  PropTypes from 'prop-types'

export default class Wedge extends Component<void, any, any> {

    static propTypes = {
        outerRadius: PropTypes.number.isRequired,//外圆半径
        startAngle: PropTypes.number.isRequired,//起始点角度
        endAngle: PropTypes.number.isRequired,//结束点角度
        originX: PropTypes.number.isRequired,//圆心坐标X
        originY: PropTypes.number.isRequired,//圆心坐标Y
        innerRadius: PropTypes.number,//内圆半径
        needsContent:PropTypes.bool,//是否需要自定义视图
    };


    constructor(props : any) {
        super(props);
        (this:any).circleRadians = Math.PI * 2;//360圆弧度
        (this:any).radiansPerDegree = Math.PI / 180;//每度对应弧度值
        (this:any)._degreesToRadians = this._degreesToRadians.bind(this);
    }

    /**
     弧度转换
     */
    _degreesToRadians(degrees: number) : number {
        if (degrees !== 0 && degrees % 360 === 0) { // 360, 720, etc.
            return (this:any).circleRadians;
        }
        return degrees * (this:any).radiansPerDegree % (this:any).circleRadians;
    }

    /**
     * _createCirclePath(or, ir)
     *
     * Creates the ReactART Path for a complete circle.
     *
     * @param {number} or The outer radius of the circle
     * @param {number} ir The inner radius, greater than zero for a ring
     * @return {object}
     * 画圆
     */
    _createCirclePath(or : number, ir : number) : Path {
        const path = new Path();

        path.move(0, or)//移动起始点坐标
            .arc(or * 2, 0, or)//画圆弧
            .arc(-or * 2, 0, or);

        if (ir) {
            path.move(or - ir, 0)
                .counterArc(ir * 2, 0, ir)
                .counterArc(-ir * 2, 0, ir);
        }

        path.close();

        return path;
    }

    /**
     * _createArcPath(sa, ea, ca, or, ir)
     *
     * Creates the ReactART Path for an arc or wedge.
     *
     * @param {number} startAngle The starting degrees relative to 12 o'clock
     * @param {number} endAngle The ending degrees relative to 12 o'clock
     * @param {number} or The outer radius in pixels
     * @param {number} ir The inner radius in pixels, greater than zero for an arc
     * @return {object}
     * 圆弧具体画法参考画圆参考https://github.com/reactjs/react-art/blob/master/src/Wedge.art 官方源码
     * 里面有些路径绘制我也不是很明白
     */
    _createArcPath(originX : number, originY : number, startAngle : number, endAngle : number, or : number, ir : number) : Path {
        const path = new Path();

        // angles in radians
        const sa = this._degreesToRadians(startAngle);
        const ea = this._degreesToRadians(endAngle);

        // central arc angle in radians 中心圆心弧度角
        const ca = sa > ea ? (this:any).circleRadians - sa + ea : ea - sa;

        // cached sine and cosine values
        const ss = Math.sin(sa);
        const es = Math.sin(ea);
        const sc = Math.cos(sa);
        const ec = Math.cos(ea);

        // cached differences
        const ds = es - ss;
        const dc = ec - sc;
        const dr = ir - or;

        // if the angle is over pi radians (180 degrees)
        // we will need to let the drawing method know.
        const large = ca > Math.PI;

        // TODO (sema) Please improve theses comments to make the math
        // more understandable.
        //
        // Formula for a point on a circle at a specific angle with a center
        // at (0, 0):
        // x = radius * Math.sin(radians)
        // y = radius * Math.cos(radians)
        //
        // For our starting point, we offset the formula using the outer
        // radius because our origin is at (top, left).
        // In typical web layout fashion, we are drawing in quadrant IV
        // (a.k.a. Southeast) where x is positive and y is negative.
        //
        // The arguments for path.arc and path.counterArc used below are:
        // (endX, endY, radiusX, radiusY, largeAngle)

        path.move(or + or * ss, or - or * sc) // move to starting point
            .arc(or * ds, or * -dc, or, or, large) // outer arc
            .line(dr * es, dr * -ec);   // width of arc or wedge

        if (ir) {
            path.counterArc(ir * -ds, ir * dc, ir, ir, large); // inner arc
        }

        return path;
    }

    //圆中间自定义视图 主要设计计算得到最大内圆正方形
    getCenterView() {

        const centerW = Math.sqrt(2)*this.props.innerRadius;//计算内部最大正方形边长 圆内最大正方形的面积=直径×半径＝2×半径的平方
            return (
                <View key="centerView" style={[myStyles.centerViewStyle, {
                    width: centerW,
                    height: centerW,
                    top: this.props.outerRadius-(centerW)/2,
                    left: this.props.outerRadius-(centerW)/2,
                    backgroundColor:"transparent"
                }]}>
                    {this.props.children}
                </View>
            );
    }

    render(){
        // angles are provided in degrees
        const startAngle = this.props.startAngle;
        const endAngle = this.props.endAngle;
        // if (startAngle - endAngle === 0) {
        //  return null;
        // }

        // radii are provided in pixels
        const innerRadius = this.props.innerRadius || 0;
        const outerRadius = this.props.outerRadius;

        const { originX, originY } = this.props;

        // sorted radii
        const ir = Math.min(innerRadius, outerRadius);
        const or = Math.max(innerRadius, outerRadius);
        let path;
        let circlePath = this._createCirclePath(or, ir);
        if (endAngle >= startAngle + 360) {
            path = this._createCirclePath(or, ir);
        } else {
            path = this._createArcPath(originX, originY, startAngle, endAngle, or, ir);
        }

        return (
         <View >
             <Surface width={this.props.outerRadius *2} height={this.props.outerRadius*2}>
                 <Shape {...this.props} startAngle ={0} endAngle = {360} fill = "#e3e3e3" d={circlePath} />
                 <Shape {...this.props} d={path} />
             </Surface>
            {this.props.needsContent?this.getCenterView():null}
         </View>

        );
    }
}

const myStyles = StyleSheet.create({

    centerViewStyle: {
        position: 'absolute',
    }
});