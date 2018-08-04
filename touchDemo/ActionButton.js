/**
 * ActionButton
 * Created by penglei on 2018/7/16.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';


export  default  class App extends Component {

    render() {
        return (
            <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
                {/* Rest of the app comes ABOVE the action button component !*/}
                <ActionButton buttonColor="rgba(231,76,60,1)"
                              position ="left"
                              verticalOrientation={"down"}
                              degrees={0}
                              //bgColor="red"
                              spacing={10}>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
                        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
                        <Icon name="md-done-all" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});