/**
 * ScreenShot
 * Created by penglei on 2018/7/25.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, { Component } from 'react';
import ReactNative,{
    CameraRoll,
} from 'react-native';

export  default function ScreenShot (scrennView,getRealPath ){
     ReactNative.takeSnapshot(scrennView, {format: 'png', quality: 1}) // See UIManager.js for options
        .then((uri) => {
            if(getRealPath){
                getRealPath(uri);
            }
            return uri;
        })
        .catch((error) => alert(error));
}