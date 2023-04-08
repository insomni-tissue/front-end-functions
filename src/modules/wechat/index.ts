import EnvUtils from '../env/browser';
import { WechatSdk } from './sdk';
import { enCodeUrlParams } from '../url';
// const EnvUtils = new _EnvUtils()
/*
* 微信签约类型枚举 */
enum WechatAppTypeEnum {
  /** h5 */
  h5 = 'H5',
  /** 小程序 */
  miniProgram = 'WMP',
  /** 公众号 */
  wechat = 'JSAPI',
}

interface GetWechatShareConfigResType {
  signature: string;
  appId: string;
  noncestr: string;
  timestamp: string;
}


const DEFAULT_DOCUMENT_TITLE = 'xxxxx';

interface WechatJsonType extends Pick<GetWechatShareConfigResType, 'signature'|'timestamp'> {
  nonceStr?: string;
  nonce: string;
  ticket: string;
}

interface ShareConfigType {
  title?: string;
  desc?: string;
  link?: string;
  imgUrl?: string;
}

interface ShareConfigCacheType extends ShareConfigType {
  callback?: () => void;
}

const SCPRIT_ID = 'WX_SCRIPT';

const getWechatEnv = (() => {
  const envConfig = {
    isWechat: false,
    isMiniprogram: false,
  };
  if (EnvUtils.isWx()) {
    WechatSdk.getInstance()
      .then((wx) => {
        wx.miniProgram.getEnv((res: any) => {
          if (res.miniprogram) {
            envConfig.isMiniprogram = true;
          } else {
            envConfig.isWechat = true;
          }
        });
      });
  }

  return {
    envConfig,
  };
})();

export const wechatJsonHandler = (data: string) => {
  const targetScript = document.getElementById(SCPRIT_ID);
  /** 获取到信息后江获取信息的script标签remove掉。 */
  if (targetScript) {
    document.body.removeChild(targetScript);
  }

  if (data && typeof data === 'string') {
    try {
      const response = JSON.parse(data) as WechatJsonType;
      /** 不存在签名，直接结束 */
      if (!response.signature) {
        return;
      }

      WechatUtils.setWechatJson(response);

      if (!EnvUtils.isWx()) {
        return;
      }

      WechatSdk.getInstance()
        .then((wx) => {
          wx.miniProgram.getEnv((res: any) => {
            if (!res.miniprogram) {
              WechatUtils.initWechat();
            }
          });
        });
    } catch (err) {
      console.error(`微信初始化失败 ${err}`);
    }
  }
};
export class WechatUtils {
  public static entryUrl = '';

  /**
   * 需要授权的API
   * TODO:  是否需要使用那么多
   */
  private static WECHAT_API_LIST = [
    'checkJsApi',
    // 1.4 分享给朋友、QQ
    'updateAppMessageShareData',
    // 1.4 分享到朋友圈、QQ空间
    'updateTimelineShareData',
    // 分享到朋友圈(即将废弃)
    'onMenuShareTimeline',
    // 分享给朋友(即将废弃)
    'onMenuShareAppMessage',
    // 分享到QQ(即将废弃)
    'onMenuShareQQ',
    // 隐藏菜单
    'hideOptionMenu',
    // 显示菜单
    'showOptionMenu',
    // 批量隐藏菜单选项
    // 'hideMenuItems',
    // 批量显示菜单选项
    // 'showMenuItems',
    // 录音
    // 'startRecord',
    // 'translateVoice',
    // 'playVoice',
    // 'stopRecord',
    // 'onVoiceRecordEnd',
    // 'onVoicePlayEnd',
    // 'uploadVoice',
    // 'downloadVoice',
    // 'pauseVoice',
    // 'stopVoice',
    // 获取地理坐标
    'getLocation',
    // 拍照或从手机相册中选图接口
    'chooseImage',
    'uploadImage',
    'downloadImage',
    'previewImage',
    // 关闭当前网页窗口接口
    'closeWindow',
  ];

  /** 最大重试次数 */
  private static MAX_RETRY_TIME = 5;

  /** 重试间隔 */
  private static RETRY_INTERVAL = 500;

  /** 微信配置信息 */
  private static WECHAT_SINGE_CONFIG = {
    test: {
      appid: 'xxxxx',
      weappNo: 'xxxxx',
      redirectUri: 'xxxxx/redirect?backUrl=',
      getSignatureUri: 'xxxxx/getSignature?',
      openid: 'xxxxx',
    },
    pro: {
      appid: 'xxxxx',
      weappNo: 'xxxxx',
      redirectUri: 'http://xxxxx/redirect?backUrl=',
      getSignatureUri: 'https://xxxxx/getSignature?',
      openid: 'xxxxx',
    },
  };

  /** 微信签名和加密 */
  private static _wechatJson: WechatJsonType = {
    signature: '',
    timestamp: '',
    nonce: '',
    ticket: '',
  };

  /** 分享内容 */
  private static _shareConfig: ShareConfigCacheType = {
    title: '分享标题',
    desc: '分享内容',
    link: window.location.href,
    imgUrl: `${window.location.origin}/logo.png`,
    callback: () => {
      console.log('share callback');
    },
  };

  /** 是否在微信中 */
  private static _isInWechat: boolean = EnvUtils.isWx();

  /** 是否初始化成功 */
  private static _isInitSuccess = false;

  /** 重试次数 */
  private static _retryTime = 0;

  /** 重试定时器 */
  private static _retryTimer: number;

  /** 微信配置 */
  private static get config() {
    return EnvUtils.isPro() ? this.WECHAT_SINGE_CONFIG.pro : this.WECHAT_SINGE_CONFIG.test;
  }

  /** 是否完成微信签名初始化 */
  private static get _isFinishGetSignature() {
    return !!this._wechatJson.signature;
  }

  /** 获取微信执行环境 */
  public static get wechatEnv() {
    return getWechatEnv.envConfig;
  }

  /** 初始化微信配置 */
  public static init() {
    this._retryTime = 0;
    if (!this._isInWechat) {
      return;
    }
    this._getSignatureByJsonp();
  }

  /** 配置微信分享 */
  public static initShareConfig(config?: ShareConfigType, callback?: () => void) {
    if (!this._isInWechat) {
      return;
    }

    if (config) {
      this._shareConfig = {
        title: config?.title || DEFAULT_DOCUMENT_TITLE,
        desc: config?.desc || 'xxxxx',
        link: config?.link || window.location.href,
        imgUrl: config?.imgUrl || `${window.location.origin}/logo.png`,
        callback,
      };
      this._retryTimer = 0;
    }

    // 这里做重试，兼容微信未初始化
    if (!this._isInitSuccess && this._retryTime < this.MAX_RETRY_TIME) {
      this._retryTime += 1;
      clearTimeout(this._retryTimer);
      this._retryTimer = window.setTimeout(() => {
        this.initShareConfig();
      }, this.RETRY_INTERVAL);
      return;
    }

    const shareObj = {
      title: this._shareConfig.title,
      desc: this._shareConfig.desc,
      link: this._shareConfig.link,
      imgUrl: this._shareConfig.imgUrl,
      trigger: () => {
        console.log('用户点击发送给朋友');
      },
      success: () => {
        // 用户确认分享后执行的回调函数
        console.log('分享成功');
        this._shareConfig.callback?.();
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
        console.log('已取消分享');
      },
    };

    WechatSdk.getInstance()
      .then((wx) => {
        wx.onMenuShareAppMessage(shareObj);
        wx.onMenuShareQQ(shareObj);
        wx.onMenuShareTimeline(shareObj);
      });
  }

  /** 存储获取的微信签名信息 */
  public static setWechatJson(data: WechatJsonType) {
    this._wechatJson = {
      signature: data.signature,
      timestamp: data.timestamp,
      nonceStr: data.nonce || data.nonceStr,
      ticket: data.ticket,
      nonce: data.nonce,
    };
  }

  /**
   * 初始化微信配置
   */
  public static initWechat(callback?: () => void) {
    return new Promise((resolve) => {
      if (!this._isFinishGetSignature) {
        return;
      }

      WechatSdk.getInstance()
        .then((wx) => {
          wx.config({
            debug: false,
            // 公众号的唯一标识
            appId: this.config.appid,
            // 生成签名的时间戳
            timestamp: this._wechatJson.timestamp,
            // 生成签名的随机串
            nonceStr: this._wechatJson.nonceStr,
            // 签名
            signature: this._wechatJson.signature,
            // 需要使用的JS接口列表
            jsApiList: this.WECHAT_API_LIST,
          });
          // 异步配置完成后，自动调用
          wx.ready(() => {
            this.initShareConfig();
            this._isInitSuccess = true;
            callback?.();
            resolve(this._wechatJson);
          });
          wx.error((err: any) => {
            // 打印报错信息
            console.log('wx.error', err);
          });
        });
    });
  }

  /** 获取微信类型 */
  public static getWechatAppType(): string {
    if (this.wechatEnv.isMiniprogram) {
      return WechatAppTypeEnum.miniProgram;
    }

    if (this.wechatEnv.isWechat) {
      return WechatAppTypeEnum.wechat;
    }

    return WechatAppTypeEnum.h5;
  }

  /**
   * JSONP 获取微信签名
   * @returns
   */
  private static _getSignatureByJsonp() {
    WechatSdk.getInstance()
      .then((wx) => {
        wx.miniProgram.getEnv((res: any) => {
          if (!res.miniprogram) {
            window.wechatJsonHandler = wechatJsonHandler;
            const signUrl = EnvUtils.isAndroid() ? window.location.href.split('#')[0] : this.entryUrl;
            const params = {
              openid: this.config.openid,
              weappNo: this.config.weappNo,
              fxurl: signUrl,
              callback: 'window.wechatJsonHandler',
            };
            const script = document.createElement('script');
            script.id = SCPRIT_ID;
            script.src = `${this.config.getSignatureUri}${enCodeUrlParams(params)}`;
            document.body.insertBefore(script, document.body.firstChild);
          }
        });
      });
  }
}

export {
  WechatSdk,
}