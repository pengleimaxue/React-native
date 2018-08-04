
/**
 * XGPushModule
 * Created by penglei on 2018/7/9 17:07.
 * Copyright © 2018 penglei. All rights reserved.
 */

package com.example.xgpush;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.Notification;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.SparseArray;
import android.util.Log;
import android.support.v4.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.LifecycleEventListener;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.tencent.android.tpush.XGPushManager;
import com.tencent.android.tpush.XGPushConfig;
import com.tencent.android.tpush.XGIOperateCallback;
import com.tencent.android.tpush.XGLocalMessage;
import com.tencent.android.tpush.XGPushBaseReceiver;

import javax.annotation.Nullable;

public class XGPushModule extends ReactContextBaseJavaModule implements LifecycleEventListener{

    private Context context;
    private ReactApplicationContext reactContext;
    private BroadcastReceiver innerReceiver;
    private IntentFilter innerFilter;

    //点击通知栏事件
    private static final String RNGFDidLaunchAppByOpenNotification = "RNGFDidLaunchAppByOpenNotification";
    //收到推送消息
    private static final String RNGFDidReceiveRemoteNotification = "RNGFDidReceiveRemoteNotification";
    //信鸽注册事件
    private static final String RNGFXGPushRegisterEvent = "RNGFXGPushRegisterEvent";
    //信鸽绑定帐号成功事件
    private static final String RNGFXGPushDidBindSuccessEvent = "RNGFXGPushDidBindSuccessEvent";

    public XGPushModule (ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.context = reactContext.getApplicationContext();
        innerReceiver = new LocalInnerMessageReceiver(this);

        innerFilter = new IntentFilter();
        //设置接收广播的类型
        innerFilter.addAction(XGMessageReceiver.XGActionNotification);
        innerFilter.addAction(XGMessageReceiver.XGActionCustomNotification);
        innerFilter.addAction(XGMessageReceiver.XGActionUnregister);
        innerFilter.addAction(XGMessageReceiver.XGActionRegistration);
        innerFilter.addAction(XGMessageReceiver.XGActionTagSetting);
        innerFilter.addAction(XGMessageReceiver.XGActionTagDeleting);
        innerFilter.addAction(XGMessageReceiver.XGActionClickNotification);
        /*
        * 对于LocalBroadcastManager方式发送的应用内广播，只能通过LocalBroadcastManager动态注册，不能静态注册
        * */
        LocalBroadcastManager.getInstance(this.context).registerReceiver(this.innerReceiver,
                this.innerFilter);
        //监听ReactNative应用的生命周期
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "RNGFXGPush";
    }
    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
        //对象销毁的时候销毁广播防止内层泄露
        LocalBroadcastManager.getInstance(this.context).unregisterReceiver(this.innerReceiver);
    }
    /*
    * 设置是否开启信鸽Debug日志
    * */
    @ReactMethod
    public void enableDebug(Boolean enable) {
        XGPushConfig.enableDebug(this.context,enable);
    }
    /*
     * 注册信鸽推送
     * */
    @ReactMethod
    public void registerPush() {
        XGPushManager.registerPush(this.context, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object data, int flag) {
                Log.d("XGPush", "注册成功：" + data);
                sendEvent(RNGFXGPushRegisterEvent,data);
            }

            @Override
            public void onFail(Object data, int errCode, String msg) {
                Log.d("XGPush", "注册失败，错误码：" + errCode + ",错误信息：" + msg);
                WritableMap params = Arguments.createMap();
                params.putInt("errCode", (int) errCode);
                params.putString("msg",msg);
                sendEvent(RNGFXGPushRegisterEvent,params);

            }
        });
    }

    /*
    * 绑定帐号
    * */
    @ReactMethod
    public void setXGPushParamsWithAccountID(final String accountID) {
        XGPushManager.bindAccount(this.context, accountID, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object o, int i) {
                sendEvent(RNGFXGPushDidBindSuccessEvent,accountID);
            }

            @Override
            public void onFail(Object o, int i, String s) {
                Log.d("XGPush", "绑定帐号失败，错误码：" + i+ ",错误信息：" + s);
            }
        });
    }

    /*
    * 获取设备token
    * */
    @ReactMethod
    public  void  getDeviceToken(Callback callback) {
       callback.invoke(XGPushConfig.getToken(this.context));
    }


    //发送事件
    private void sendEvent(String eventName, @Nullable   Object object) {
        if (object instanceof  Bundle) {
            Bundle payload = (Bundle) object;
            WritableMap params;
            params = Arguments.createMap();
            params.putString("Content", payload.getString("Content"));
            params.putString("Title", payload.getString("Title"));
            params.putInt("MsgId", (int) payload.getLong("MsgId"));
            params.putInt("NotificationId", (int) payload.getLong("NotificationId"));
            params.putInt("NActionType", (int) payload.getLong("NActionType"));
            params.putString("CustomContent", payload.getString("CustomContent"));
            this.reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } else  {
            this.reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, object);
        }

    }
    public void sendEvent(Intent intent) {
        Bundle payload = intent.getExtras().getBundle("data");
        switch (intent.getAction()) {
            //收到通知栏通知消息
            case XGMessageReceiver.XGActionNotification: {
                sendEvent(RNGFDidReceiveRemoteNotification, payload);
            }
                break;
            //应用内通知
            case XGMessageReceiver.XGActionCustomNotification: {
                sendEvent(RNGFDidReceiveRemoteNotification, payload);
            }
                break;
            //点击通知栏消息
            case XGMessageReceiver.XGActionClickNotification:{
                sendEvent(RNGFDidLaunchAppByOpenNotification, payload);
            }
            break;
        }
    }

}


