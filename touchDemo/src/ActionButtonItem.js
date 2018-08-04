/**
 * ActionButtonItem
 * Created by penglei on 2018/7/23.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
} from "react-native";

export default  class ActionButtonItem extends  Component {
    click = () => {
        this.props.onClick();
        if (this.props.item.onpress) {
            this.props.item.onpress()
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.click}
                activeOpacity={1}
                style={[styles.buttonLeft,{width:this.props.width, height:this.props.width}]}>
                <Animated.Image
                    source={this.props.item.ImagePath}
                    resizeMode ='contain'
                    style={{opacity: this.props.opacity,width:this.props.size, height:this.props.size}}
                />
            </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({
    buttonLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'green'
    }
});