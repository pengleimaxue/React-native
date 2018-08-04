//
//  RNGFXGPush.h
//  RNGFXGPush
//
//  Created by penglei on 2018/7/4.
//  Copyright © 2018年 penglei. All rights reserved.
//

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

#import "XGPush.h"

@interface RNGFXGPush : RCTEventEmitter <RCTBridgeModule, XGPushDelegate, XGPushTokenManagerDelegate>

+ (void)didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
+ (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken;
+ (void)didFailToRegisterForRemoteNotificationsWithError:(NSError *)error;
+ (void)didReceiveRemoteNotification:(NSDictionary *)userInfo;
+ (void)willEnterForeground;

@end
