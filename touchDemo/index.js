/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
//import  App from'./ActionButton'
import {name as appName} from './app.json';
import  PanResponderExample from './PanResponderExample'
import example from './example'
import {
    YellowBox
} from 'react-native';

YellowBox.ignoreWarnings(['Warning: ']);
AppRegistry.registerComponent(appName, () => App );
