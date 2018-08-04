/**
 * index
 * Created by penglei on 2018/7/2.
 * Copyright © 2018 penglei. All rights reserved.
 */

import {NativeModules,NativeEventEmitter} from 'react-native'

const XGPushModule = NativeModules.RNGFXGPush
const XGPushModuleEmitter = new NativeEventEmitter(XGPushModule)

const listeners = {}

const RNGFDidRegisterForRemoteNotification = "RNGFDidRegisterForRemoteNotification";
const RNGFDidFailToRegisterForRemoteNotification = "RNGFDidFailToRegisterForRemoteNotification";
const RNGFDidReceiveRemoteNotification = "RNGFDidReceiveRemoteNotification";
const RNGFDidLaunchAppByOpenNotification = "RNGFDidLaunchAppByOpenNotification";

const RNGFXGPushDidFinishStartEvent = "RNGFXGPushDidFinishStartEvent";
const RNGFXGPushDidFinishStopEvent = "RNGFXGPushDidFinishStopEvent";
const RNGFXGPushDidRegisterDeviceTokenEvent = "RNGFXGPushDidRegisterDeviceTokenEvent";
const RNGFXGPushDidBindSuccessEvent = "RNGFXGPushDidBindSuccessEvent";

export default class XGPush {

  // 设置信鸽参数
  static starXG(appID: number, appkey: string ) {
    XGPushModule.startXG(appID, appkey)
  }

  // 是否开启信鸽 Debug 日志
  static enableDebug(openDebug: boolean) {
    XGPushModule.enableDebug(openDebug)
  }

  // 获取当前设备的 deviceToken, 如果信鸽注册 token 成功之前获取就为空
  static getDeviceToken(cb){
    XGPushModule.getDeviceToken(result => {
      cb(result)
    })
  }

  // 绑定信鸽账号
  static bindXGAccount(account: string) {
    XGPushModule.setXGPushParamsWithAccountID(account);
  }

  // 监听注册推送成功事件, 回调设备的 deviceToken
  static listenDidRegisterForRemoteNotification(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFDidRegisterForRemoteNotification, deviceToken => {
      cb(deviceToken)
    })
  }

  // 监听注册推送失败事件, 回调 error 信息
  static listenDidFailToRegisterForRemoteNotification(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFDidFailToRegisterForRemoteNotification, error => {
      cb(error)
    })
  }

  // 监听收到通知, 返回推送的消息内容
  static listenDidReceiveRemoteNotification(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFDidReceiveRemoteNotification, content => {
      cb(content)
    })
  }

  // 监听通过点击通知启动应用, 返回推送的消息内容
  static listenDidLaunchAppByOpenNotification(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFDidLaunchAppByOpenNotification, content => {
      cb(content)
    })
  }

  /**
   * 监控信鸽推送服务的启动情况
   * 返回启动信息，{isSuccess:,error:}
   */
  static listenXGPushDidFinishStartEvent(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFXGPushDidFinishStartEvent, result => {
      cb(result)
    })
  }

  /**
   * 监听注销信鸽推送事件
   * 返回注销结果，{isSuccess:,error:}
   */
  static listenXGPushDidFinishStopEvent(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFXGPushDidFinishStopEvent, result => {
      cb(result)
    })
  }

  /**
   * 监听信鸽token注册事件
   * 返回注册token信息，{deviceToken:,error:}
   */
  static listenXGPushDidRegisterDeviceTokenEvent(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFXGPushDidRegisterDeviceTokenEvent, result => {
      cb(result)
    })
  }

  /**
   * 监听信鸽绑定用户成功事件
   * 返回 deviceToken
   */
  static listenXGPushDidBindSuccessEvent(cb) {
    listeners[cb] = XGPushModuleEmitter.addListener(RNGFXGPushDidBindSuccessEvent, deviceToken => {
      cb(deviceToken)
    })
  }

  // 移除监听者
  static removeAllListener(){
    for (let key in listeners) {
      if (listeners[key]) {
        listeners[key].remove();
        listeners[key] = null;
      }
    }
  }

}
