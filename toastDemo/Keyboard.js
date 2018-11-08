/**
 * Keyboard
 * Created by penglei on 2018/6/20.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, {Component} from 'react';
import { View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import styles from './styles';
import logo from './src/57-57.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default class Demo extends Component{
    render() {
        return (
            <View  style={styles.container}>
            <KeyboardAwareScrollView
            >
                <View style={styles.containerView}>
                    <Image source={logo} style={styles.logo}/>
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Username"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Password"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        style={styles.input}
                    />

                </View>



            </KeyboardAwareScrollView>
    </View>
        )
    }
};
