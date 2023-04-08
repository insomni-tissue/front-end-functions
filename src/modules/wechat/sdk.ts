class WechatSdk {
  private static _wechatSdk: any = null;

  /**
   * 获取微信sdk
   * @returns weixin-js-sdk
   */
  public static getInstance(): Promise<any> {
    return new Promise((resolve) => {
      if (WechatSdk._wechatSdk) {
        resolve(this._wechatSdk);
      } else {
        import('weixin-js-sdk').then((wx) => {
          WechatSdk._wechatSdk = wx;
          resolve(wx);
          window.wx = wx;
        });
      }
    });
  }
}

export {
  WechatSdk
}