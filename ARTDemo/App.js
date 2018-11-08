/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Animated,
    TouchableOpacity,
    View,
    ART
} from 'react-native';


import  CircularProgress from './src/CircularProgress'
import Wedge from './src/Wedge'
//import PercentageCircle from './src/PercentageCircle'
import PercentageCircle from '@sdk-react-native/percentage-circle'
export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                 <CircularProgress  strokeWidth ={10} radius={50} btnText="text" ref="alerts2" messageText="10%">

                        </CircularProgress>
                <CircularProgress  strokeWidth ={10} radius={50} btnText="text" ref="alerts1" messageText="10%" arcColor ="blue" fillColor="gray">

                </CircularProgress>
                <TouchableOpacity style={{marginTop:20}} onPress={this.funAlet}>
                    <Text>点我开启动画</Text>
                </TouchableOpacity>

                    <PercentageCircle
                        radius = {50}
                        circleWidth={10}
                        startAngle={10}
                        fill="#f39c12"
                        ref="alert1"
                        needsContent={true}
                        percentValue={0.1}
                    >
                        <View style={styles.container}>
                            <Text style={styles.checkin}>40</Text>
                            <Text style={styles.desc}>人已统计</Text>
                        </View>

                    </PercentageCircle>

                    <PercentageCircle
                        radius = {50}
                        circleWidth={10}
                        startAngle={10}
                        fill="#f39c12"
                        ref="alert2"
                        needsContent={true}
                        percentValue={0.3}
                        >
                        <View style={[styles.container,{backgroundColor:'#999'}]}>
                            <Text style={styles.checkin}>30%</Text>
                            <Text style={styles.desc}>人已统计</Text>
                        </View>

                    </PercentageCircle>

                    <PercentageCircle
                        radius = {50}
                        circleWidth={10}
                        startAngle={10}
                        percentValue={0.5}
                        fill="blue"
                        ref="alert3"
                        needsContent={true}
                    >
                        <View style={styles.container}>
                            <Text>50%</Text>
                        </View>
                    </PercentageCircle>
            </View>
        );
    }

    funAlet=()=>{
        /*this.refs.alerts1.startAnimation();
        this.refs.alerts2.startAnimation();*/
        this.refs.alert1.startAnimate();
        this.refs.alert2.startAnimate();
        this.refs.alert3.startAnimate();
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    welcome: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    row:{
        //height:0,
        flexDirection:'row',
        alignItems:'center',
        flexWrap:'wrap',
        marginBottom:40,
    },
    item:{
        flex:.33,
        justifyContent:'center',
        alignItems:'center',
    },
    percentText:{
        fontSize:15,
        paddingTop:10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

    checkin: {
        fontSize:20,
        color: '#f39c12',
    },
    desc: {
        fontSize:12,
        color: '#999',
    },

});