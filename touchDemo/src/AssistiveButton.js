/**
 * AssistiveButton
 * Created by penglei on 2018/7/23.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    Easing,
    ImageBackground,
} from 'react-native';

import iconNomal from'./images/gf_sdk_float_logo_normal.png'

import ActionButtonItem from './ActionButtonItem'
import iconBackGourndImage from './images/gf_sdk_float_bg.png'

export  default  class AssistiveButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isClicked: false,
            position:'lefts',
            iconButtonCenter:iconNomal
        };
        this._buttonCenter.bind(this)
        this.rotateAnimated = new Animated.Value(0);
        this.scaleAnimated = new Animated.Value(0);
        this.bringToLeftAnimated = new Animated.Value(0);
        this.bringToRightAnimated = new Animated.Value(0);
        this.fadeAnimated = new Animated.Value(0);

    }


    createAnimation(obj, toValue, duration, startFunc=()=>{}) {
        return Animated.timing(obj, {
            toValue,
            duration,
        }).start(startFunc());
    }


    startAnimation() {
        this.createAnimation(this.rotateAnimated, 1, 200);
        this.createAnimation(this.scaleAnimated, 1, 200);
        this.createAnimation(this.bringToLeftAnimated, 1, 200);
        this.createAnimation(this.bringToRightAnimated, 1, 200);
        this.createAnimation(this.fadeAnimated, 1, 200);
    }

    endAnimation() {
        this.createAnimation(this.rotateAnimated, 2, 200);
        this.createAnimation(this.scaleAnimated, 0, 200);
        this.createAnimation(this.bringToLeftAnimated, 0, 200);
        this.createAnimation(this.bringToRightAnimated, 0, 200);
        this.createAnimation(this.fadeAnimated, 0, 200);

    }

    _buttonClick= ()=>{
        this.setState({isClicked: !this.state.isClicked});
        this.endAnimation();
        if(this.props.buttonClick) {
            this.props.buttonClick();
        }
    }

    _buttonCenter =()=>{

        if (this.state.isClicked) {
            this.endAnimation()
        } else  {
            this.startAnimation();

        };
        this.setState({isClicked: !this.state.isClicked});
        if(this.props.buttonClick) {
            this.props.buttonClick();
        }

    }

    _closeButtonView = ()=>{
        if(this.state.isClicked) {
            this.setState({isClicked: !this.state.isClicked});
            this.endAnimation();
        }
    }

    render() {
        const {size, primaryColor, secondaryColor,children} = this.props;

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems:'center',
            },
            buttonWrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position:'absolute',
                left:0,
            },
            buttonCenter: {
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                borderRadius: 360,
                //backgroundColor: primaryColor,
            },
            centerImage: {
                width: size,
                height: size,
            },

            childImage: {
                width: size - 15,
                height: size - 15,
            },

            circle: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 160,
                //backgroundColor:secondaryColor,
                //backgroundImage:iconBackGourndImage,
                transform:[{scale:0.9}]
            },
        });

        const rotateMe = this.rotateAnimated.interpolate({
            inputRange: [0, 1, 2],
            outputRange: ['0deg', '45deg', '0deg'],
        });

        const scaleMeHeight = this.scaleAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [size, size],
        });

        const scaleMeWidth = this.scaleAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [size, size*(this.props.buttons.length+1)],
        });

        const bringMeToLeft = this.bringToLeftAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(this.props.buttons.length-1/6)*size],
        });

        const bringMeToRight= this.bringToRightAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(this.props.size/6)],
        });



        return (
            <View style={[styles.container]}>
                <Animated.Image
                    style={{ position: 'absolute',
                        left: this.state.position==='left'?bringMeToLeft:bringMeToRight,
                        height:scaleMeHeight,width:scaleMeWidth,

                        transform:[{scale:0.9}]
                    }}
                    source={iconBackGourndImage}
                    resizeMode ='stretch'
                    capInsets={{top:0,left: this.props.size/2, bottom:0, right:this.props.size/2}}
                >
                </Animated.Image>
                <Animated.View style={[styles.circle,{left: this.state.position==='left'?bringMeToLeft:bringMeToRight,width:scaleMeWidth, height: scaleMeHeight}]}>
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',

                        //justifyContent:'flex-start',
                        //backgroundColor:'red'
                    },{marginLeft:this.state.position==='left'?0:this.props.size, marginRight:this.state.position==='left'?this.props.size:0, justifyContent:this.state.position==='left'?"flex-end":"flex-start"}]}>

                        {
                            this.props.buttons.length>0 &&this.state.isClicked&& this.props.buttons.map((item,i)=>this.CreateBtns(item,i))
                        }
                    </View>

                </Animated.View>

                <Animated.View
                    style={[styles.buttonWrapper]}>
                    <TouchableOpacity
                        onPress={this._buttonCenter}
                        activeOpacity={1}
                        style={styles.buttonCenter}>
                        <Animated.Image
                            source={this.state.iconButtonCenter}
                            style={styles.centerImage}
                        />
                    </TouchableOpacity>
                </Animated.View>

            </View>
        );
    }

    CreateBtns(item,i){
        const fadeInOut = this.fadeAnimated.interpolate({
            inputRange: [0,1],
            outputRange: [0,1],
        });
        return <ActionButtonItem key={i} size={this.props.size-15} width= {this.props.size-5} onClick={this._buttonClick} item={item} opacity={fadeInOut}/>
    }
}




AssistiveButton.defaultProps = {
    size: 40,
    iconButtonCenter: iconNomal,
    primaryColor: '#41727E',
    secondaryColor: '#F5F5F5',
    buttons:[],                  //底部按钮数组
    buttonClick:null
};

AssistiveButton.propTypes = {
    size: PropTypes.number,
    iconButtonCenter: PropTypes.number,
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    button:PropTypes.array

};

