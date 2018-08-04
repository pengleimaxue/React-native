/**
 * example
 * Created by penglei on 2018/7/17.
 * Copyright © 2018 penglei. All rights reserved.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import CircleButton from './src/main'

export default class example extends Component {

    render() {
        return (
            <View style={{ flex: 1 }}>
                <CircleButton size={45} />
            </View>
        );
    }
}

const styles = StyleSheet.create({}); 