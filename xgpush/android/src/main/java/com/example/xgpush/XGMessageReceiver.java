/**
 * XGMessageReceiver
 * Created by penglei on 2018/7/10 09:17.
 * Copyright © 2018 penglei. All rights reserved.
 */

package com.example.xgpush;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.tencent.android.tpush.XGPushBaseReceiver;
import com.tencent.android.tpush.XGPushClickedResult;
import com.tencent.android.tpush.XGPushRegisterResult;
import com.tencent.android.tpush.XGPushShowedResult;
import com.tencent.android.tpush.XGPushTextMessage;

/*
* XGPushBaseReceiver类提供透传消息的接收和操作结果的反馈，需要开发者继承本类，并重载相关的方法
* 参考链接:http://docs.developer.qq.com/xg/android_access/android_api.html
* */
public class XGMessageReceiver extends  XGPushBaseReceiver {

    public static final String XGActionNotification = "com.example.xgpush.XG-Notification";
    public static final String XGActionCustomNotification = "com.example.xgpush.XG-CustomNotification";
    public static final String XGActionUnregister = "com.example.xgpush.XG-Unregister";
    public static final String XGActionRegistration = "com.example.xgpush.XG-Registration";
    public static final String XGActionTagSetting = "com.example.xgpush.XG-TagSetting";
    public static final String XGActionTagDeleting = "com.example.xgpush.XG-TagDeleting";
    public static final String XGActionClickNotification = "com.example.xgpush.XG-ClickNotification";

    private static final String LogTag = "XG Receiver";
    /*
    * 通知被展示触发的回调，
    * 可以在此保存APP收到的通知
    * */
    @Override
    public void onNotifactionShowedResult(Context context,
                                          XGPushShowedResult message) {
        if (context == null || message == null) return;

        Log.d(LogTag, "Got notification " + message.toString());

        Bundle payload = new Bundle();
        payload.putString("Content", message.getContent());
        payload.putString("Title",message.getTitle());
        payload.putLong("MsgId", message.getMsgId());
        payload.putLong("NotificationId",message.getNotifactionId());
        payload.putLong("NActionType", message.getNotificationActionType());
        payload.putString("CustomContent", message.getCustomContent());

        Intent intent = new Intent(XGActionNotification);
        intent.setFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    /*
    *  	应用内消息的回调
    * */
    @Override
    public void onTextMessage(Context context, XGPushTextMessage message) {
        if (context == null || message == null) return;
        Log.d(LogTag, "Got text notification " + message.toString());

        Bundle payload = new Bundle();
        payload.putString("Title", message.getTitle());
        payload.putString("Content", message.getContent());
        payload.putString("CustomContent", message.getCustomContent());

        Intent intent = new Intent(XGActionCustomNotification);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    /*
    *  注册回调
    * */
    @Override
    public void onRegisterResult(Context context, int errorCode,
                                 XGPushRegisterResult message) {
        if (context == null || message == null) return;
        Log.d(LogTag, "Got register result " + message.toString());

        Bundle payload = new Bundle();
        payload.putInt("errorCode", errorCode);
        payload.putLong("AccessId", message.getAccessId());
        payload.putString("Account", message.getAccount());
        payload.putString("DeviceId", message.getDeviceId());
        payload.putString("Ticket", message.getTicket());
        payload.putShort("TicketType", message.getTicketType());
        payload.putString("Token", message.getToken());

        Intent intent = new Intent(XGActionRegistration);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);//本地广播
    }

    /*
    * 反注册回调
    * */
    @Override
    public void onUnregisterResult(Context context, int errorCode) {
        if (context == null) return;
        Log.d(LogTag, "Got unregister result " + errorCode);

        Bundle payload = new Bundle();
        payload.putInt("errorCode", errorCode);

        Intent intent = new Intent(XGActionUnregister);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    /*
    * 设置标签回调
    * */
    @Override
    public void onSetTagResult(Context context, int errorCode, String tagName) {
        if (context == null) return;
        Log.d(LogTag, "Got setting tag result " + errorCode);

        Bundle payload = new Bundle();
        payload.putInt("errorCode", errorCode);
        payload.putString("tagName", tagName);

        Intent intent = new Intent(XGActionTagSetting);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    /*
    * 删除标签回调
    * */
    @Override
    public void onDeleteTagResult(Context context, int errorCode, String tagName) {
        if (context == null) return;
        Log.d(LogTag, "Got deleting tag result " + errorCode);
        //Bundle主要用于传递数据：它保存的数据，是以key-value(键值对)的形式存在的。不要使用Bundle传递大容量数据
        Bundle payload = new Bundle();
        payload.putInt("errorCode", errorCode);
        payload.putString("tagName", tagName);

        Intent intent = new Intent(XGActionTagDeleting);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    /*
    * 通知被点击触发的回调
    * */
    @Override
    public void onNotifactionClickedResult(Context context,
                                           XGPushClickedResult message) {
        if (context == null || message == null) return;
        Log.d(LogTag, "Got message click " + message.toString());

        Bundle payload = new Bundle();
        payload.putString("Content", message.getContent());
        payload.putString("Title", message.getTitle());
        payload.putLong("MsgId", message.getMsgId());
        payload.putString("CustomContent", message.getCustomContent());
        payload.putLong("NActionType", message.getNotificationActionType());
        payload.putLong("ActionType", message.getActionType());
        payload.putString("ActivityName", message.getActivityName());

        Intent intent = new Intent(XGActionClickNotification);
        intent.putExtra("data", payload);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }
}
