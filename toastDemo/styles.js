/**
 * styles
 * Created by penglei on 2018/6/20.
 * Copyright © 2018 penglei. All rights reserved.
 */

import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');

export const IMAGE_HEIGHT = window.width;
export const IMAGE_HEIGHT_SMALL = window.width /7;

export default StyleSheet.create({
    container: {
        backgroundColor: '#4c69a5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        //marginHorizontal: 10,
        marginVertical: 5,
        width: window.width - 30,
    },
    logo: {
        height: IMAGE_HEIGHT,
        resizeMode: 'contain',
    },
    register:{
        marginBottom:20,
        width:window.width -100,
        alignItems:'center',
        justifyContent:'center',
        height:50,
        backgroundColor: '#ffae',}
});