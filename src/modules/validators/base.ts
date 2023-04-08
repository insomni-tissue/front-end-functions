import { ERROR_MSG_MAP } from "./error";

class BaseValidator {
  /**
   * 获取手机号码错误
   * @param value
   */
  public static getMobileError(value: string) {
    if (value === '') {
      return '';
    }

    if (/^1[3456789]\d{9}$/.test(value)) {
      return '';
    }
    return ERROR_MSG_MAP.mobilePhone;
  }

  /**
   * 获取座机号码错误
   * @param value
   */
  public static getLinkPhoneError(value: string) {
    if (value === '') {
      return '';
    }
    const regMobilePhone = /^1[3456789]\d{9}$/;
    const regFixedPhone = /^0[0-9]{2,3}-[0-9]{7,8}$/;
    const regFourZeroZero = /^400[0-9]{7}$/;
    const regEightZeroZero = /^800[0-9]{7}$/;

    if (
      regMobilePhone.test(value) ||
      regFixedPhone.test(value) ||
      regFourZeroZero.test(value) ||
      regEightZeroZero.test(value)) {
      return '';
    }
    return ERROR_MSG_MAP.linkPhone;
  }

  /**
   * 获取邮箱错误
   * @param email
   */
  public static getEmailError(email: string) {
    if (email === '') {
      return '';
    }

    if (/^\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/.test(email)) {
      return '';
    }

    return ERROR_MSG_MAP.email;
  }
}


export default BaseValidator;
