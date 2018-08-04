//
//  RNGFXGPush.m
//  RNGFXGPush
//
//  Created by penglei on 2018/7/4.
//  Copyright © 2018年 penglei. All rights reserved.
//

#import "RNGFXGPush.h"

static NSString * RNGFDidRegisterForRemoteNotification = @"RNGFDidRegisterForRemoteNotification";
static NSString * RNGFDidFailToRegisterForRemoteNotification = @"RNGFDidFailToRegisterForRemoteNotification";
static NSString * RNGFDidReceiveRemoteNotification = @"RNGFDidReceiveRemoteNotification";
static NSString * RNGFDidLaunchAppByOpenNotification = @"RNGFDidLaunchAppByOpenNotification";

static NSString * RNGFXGPushDidFinishStartEvent = @"RNGFXGPushDidFinishStartEvent";
static NSString * RNGFXGPushDidFinishStopEvent = @"RNGFXGPushDidFinishStopEvent";
static NSString * RNGFXGPushDidRegisterDeviceTokenEvent = @"RNGFXGPushDidRegisterDeviceTokenEvent";
static NSString * RNGFXGPushDidBindSuccessEvent = @"RNGFXGPushDidBindSuccessEvent";

@interface RNGFXGPushModel : NSObject

@property (nonatomic, strong) NSDictionary * userInfo;

+ (instancetype)sharedInstance;

@end

@implementation RNGFXGPushModel

+ (instancetype)sharedInstance {
    static RNGFXGPushModel * sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [self new];
    });
    return sharedInstance;
}

@end

@implementation RNGFXGPush

/**
 注意
 这个地方直接用对象发送事件就会崩溃，类似的采用通知发送事件 原因的RN先生成XGPushModlue对象方可发送事件
 否则当用户操作触发时调用sendEventWithName报错bridge is not set,
 所以参考极光推送全部采用通知发送事件
 */
+ (void)didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[XGPush defaultManager] reportXGNotificationInfo:launchOptions];
    [[XGPush defaultManager] setXgApplicationBadgeNumber:0];
    
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
    
    if ([launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey]) {
        [RNGFXGPushModel sharedInstance].userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    } else {
        [RNGFXGPushModel sharedInstance].userInfo = nil;
    }
}

+ (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[NSNotificationCenter defaultCenter]
     postNotificationName:RNGFDidRegisterForRemoteNotification object:deviceToken];
}

+ (void)didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    [[NSNotificationCenter defaultCenter]
     postNotificationName:RNGFDidFailToRegisterForRemoteNotification object:error];
}

+ (void)didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [[XGPush defaultManager] reportXGNotificationInfo:userInfo];
    [[NSNotificationCenter defaultCenter]
     postNotificationName:RNGFDidReceiveRemoteNotification object:userInfo];
}

+ (void)willEnterForeground {
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

+ (id)allocWithZone:(NSZone *)zone {
    static RNGFXGPush *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    }); //保持对象唯一 使用单例
    return sharedInstance;
}

- (instancetype)init {
    if (self = [super init]) {
        NSNotificationCenter * defaultCenter = [NSNotificationCenter defaultCenter];
        [defaultCenter addObserver:self selector:@selector(didRegisterForRemoteNotificationsWithDeviceToken:)
                              name:RNGFDidRegisterForRemoteNotification object:nil];
        [defaultCenter addObserver:self selector:@selector(didFailToRegisterForRemoteNotificationsWithError:)
                              name:RNGFDidFailToRegisterForRemoteNotification object:nil];
        [defaultCenter addObserver:self selector:@selector(didReceiveRemoteNotification:)
                              name:RNGFDidReceiveRemoteNotification object:nil];
        [defaultCenter addObserver:self selector:@selector(openNotificationToLaunchApp:)
                              name:RNGFDidLaunchAppByOpenNotification object:nil];
    }
    return self;
}

#pragma mark - Notification Event

- (void)openNotificationToLaunchApp:(NSNotification *)notification {
    [self sendEventWithName:RNGFDidLaunchAppByOpenNotification body:notification.object];
}

- (void)didFailToRegisterForRemoteNotificationsWithError:(NSNotification *)notification {
    [self sendEventWithName:RNGFDidFailToRegisterForRemoteNotification body:notification.object];
}

- (void)didReceiveRemoteNotification:(NSNotification *)notification {
    [self sendEventWithName:RNGFDidReceiveRemoteNotification body:notification.object];
}

- (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSNotification *)notification {
    NSMutableString * deviceTokenString = [NSMutableString string];
    NSData * deviceToken = notification.object;
    NSUInteger deviceTokenLength = deviceToken.length;
    unsigned char * bytes = deviceToken.bytes;
    for (NSUInteger i = 0; i < deviceTokenLength; i++) {
        [deviceTokenString appendFormat:@"%02x", bytes[i]];
    }
    
    [self sendEventWithName:RNGFDidRegisterForRemoteNotification body:deviceTokenString];
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter]removeObserver:self];
}

#pragma  mark - XGPushDelegate

/**
 @brief 监控信鸽推送服务地启动情况
 
 @param isSuccess 信鸽推送是否启动成功
 @param error 信鸽推送启动错误的信息
 */
- (void)xgPushDidFinishStart:(BOOL)isSuccess error:(NSError *)error {
    [self sendEventWithName:RNGFXGPushDidFinishStartEvent body:@{@"isSuccess": @(isSuccess), @"error": error?:@""}];
}

/**
 注销信鸽服务
 */
- (void)xgPushDidFinishStop:(BOOL)isSuccess error:(NSError *)error {
    [self sendEventWithName:RNGFXGPushDidFinishStopEvent body:@{@"isSuccess": @(isSuccess), @"error": error?:@""}];
}

/**
 信鸽监控回调，绑定账号返回
 */
- (void)xgPushDidBindWithIdentifier:(NSString *)identifier type:(XGPushTokenBindType)type error:(NSError *)error {
    NSString *deviceToken = [XGPushTokenManager defaultTokenManager].deviceTokenString?:@"";
    // -10002重复绑定account
    if (!error || error.code ==-10002) {
        [self sendEventWithName:RNGFXGPushDidBindSuccessEvent body:deviceToken];
    }
}

/**
 @brief 注册设备token的回调
 
 @param deviceToken 当前设备的token
 @param error 错误信息
 */
- (void)xgPushDidRegisteredDeviceToken:(NSString *)deviceToken error:(NSError *)error {
    [self sendEventWithName:RNGFXGPushDidRegisterDeviceTokenEvent body:@{
                                                                         @"deviceToken": deviceToken ?:@"",
                                                                         @"error": error ?:@""}];
}

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0

/**
 iOS 10 新增回调 API
 App 用户点击通知
 App 用户选择通知中的行为
 App 用户在通知中心清除消息
 无论本地推送还是远程推送都会走这个回调
 */
- (void)xgPushUserNotificationCenter:(UNUserNotificationCenter *)center
      didReceiveNotificationResponse:(UNNotificationResponse *)response
               withCompletionHandler:(void (^)(void))completionHandler {
    [[XGPush defaultManager] reportXGNotificationResponse:response];
    completionHandler();
}

/**
 App 在前台弹通知需要调用这个接口
 */
- (void)xgPushUserNotificationCenter:(UNUserNotificationCenter *)center
             willPresentNotification:(UNNotification *)notification
               withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    [[XGPush defaultManager] reportXGNotificationInfo:notification.request.content.userInfo];
    completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
}

#endif

- (NSArray<NSString *>*)supportedEvents {
    return @[
             RNGFXGPushDidFinishStartEvent,
             RNGFXGPushDidFinishStopEvent,
             RNGFXGPushDidRegisterDeviceTokenEvent,
             RNGFXGPushDidBindSuccessEvent,
             RNGFDidLaunchAppByOpenNotification,
             RNGFDidReceiveRemoteNotification,
             RNGFDidRegisterForRemoteNotification,
             RNGFDidFailToRegisterForRemoteNotification
             ];
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(enableDebug:(BOOL)enable) {
    [[XGPush defaultManager] setEnableDebug:enable];
}

RCT_EXPORT_METHOD(startXG:(NSInteger)appID appKey:(NSString *)appKey) {
    [[XGPush defaultManager]startXGWithAppID:(uint32_t)appID appKey:appKey delegate:self];
    [XGPushTokenManager defaultTokenManager].delegate = self;
    [[XGPush defaultManager] setXgApplicationBadgeNumber:0];
    
    if ([RNGFXGPushModel sharedInstance].userInfo) {
        [[NSNotificationCenter defaultCenter]
         postNotificationName:RNGFDidLaunchAppByOpenNotification object:[RNGFXGPushModel sharedInstance].userInfo];
        [RNGFXGPushModel sharedInstance].userInfo = nil;
    }
}

RCT_EXPORT_METHOD(setXGPushParamsWithAccountID:(NSString *)accountID) {
    NSArray * bindArrary = [[XGPushTokenManager defaultTokenManager] identifiersWithType:XGPushTokenBindTypeAccount];
    
    if (bindArrary.count == 0 || [bindArrary containsObject:accountID] == NO) { // 如果未绑定过 执行绑定账号操作
        [[XGPushTokenManager defaultTokenManager] bindWithIdentifier:accountID type:XGPushTokenBindTypeAccount];
    }
}

RCT_EXPORT_METHOD(getDeviceToken:(RCTResponseSenderBlock)callback) {
    callback(@[[XGPushTokenManager defaultTokenManager].deviceTokenString?:@""]);
}

@end

