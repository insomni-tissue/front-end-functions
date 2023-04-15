class EnvUtils {
  private static ua: string = navigator ? navigator.userAgent.toLowerCase() : ''
  private static screen = window
    ? window.screen
    : {
        height: 0,
        width: 0,
      }

  /**
   * 是否微信
   */
  static isWx = (): boolean => /micromessenger/i.test(EnvUtils.ua)

  /**
   * 是否是安卓机
   */
  static isAndroid = (): boolean => /android/i.test(EnvUtils.ua)

  /**
   * 是否是苹果机
   */
  static isIphone = (): boolean => /iphone/i.test(EnvUtils.ua)

  /**
   * 判断是否在IphoneX打开
   */
  static isIphoneX = (): boolean =>
    EnvUtils.isIphone() &&
    EnvUtils.screen.height === 812 &&
    EnvUtils.screen.width === 375

  /**
   * 是否苹果6~8
   */
  static isIphone678 = (): boolean =>
    EnvUtils.isIphone() &&
    EnvUtils.screen.height === 667 &&
    EnvUtils.screen.width === 375

  /**
   * 是否苹果6plus~8plus
   */
  static isIphone678Plus = (): boolean =>
    EnvUtils.isIphone() &&
    EnvUtils.screen.height === 736 &&
    EnvUtils.screen.width === 414

  /**
   * 是否苹果5
   */
  static isIphone5 = (): boolean =>
    EnvUtils.isIphone() &&
    EnvUtils.screen.height === 568 &&
    EnvUtils.screen.width === 320

  /**
   * 获取苹果手机系统版本号
   */
  static iPhoneSystemVersion = (): number => {
    const uaMatch = EnvUtils.ua.match(/cpu iphone os (.*?) like mac os/)
    const iosVersion = uaMatch
      ? uaMatch[1].replace(/^(\d+)_(\d+)\S*/, '$1.$2')
      : '0'
    return parseInt(iosVersion, 10)
  }

  static proHost: string = ''
  /**
   * 设置生产环境Host
   */
  static setProHost(host: string) {
    EnvUtils.proHost = host
  }
  /**
   * 是否在生产环境
   */
  static isPro() {
    return document.domain === EnvUtils.proHost ||
    window.location.host === EnvUtils.proHost
  }
}

export default EnvUtils
