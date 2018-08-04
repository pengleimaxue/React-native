/**
 * LocalInnerMessageReceiver
 * Created by penglei on 2018/7/11 09:17.
 * Copyright © 2018 penglei. All rights reserved.
 */

package com.example.xgpush;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/*
 * 本地广播通知
 * 参考https://www.jianshu.com/p/ca3d87a4cdf3
 * */
public class LocalInnerMessageReceiver extends BroadcastReceiver {

    private static final String LogTag = "[TXG]Inner Receiver";

    XGPushModule rnModule;
    public  LocalInnerMessageReceiver(XGPushModule module){
        this.rnModule = module;
    }
    @Override
    public void onReceive(Context context, Intent intent) {
        this.rnModule.sendEvent(intent);
    }
}
