import dayjs from 'dayjs'
import { KeyMapAny } from '../../interface'
import { ERROR_MSG_MAP } from './error'

/** 个人证件编码 */
export enum CertificateTypeCodeEnum {
  /** 身份证 */
  idCard = '01',
  /** 护照 */
  passport = '02',
  /** 军人证 */
  armypass = '03',
  /** 港澳通行证 */
  hkOrMacaoPermit = '04',
  /** 驾驶证 */
  drivingLicense = '05',
  /** 港澳回乡证或台胞证 */
  HMTidCard = '06',
  /** 临时身份证 */
  icCard = '07',
  /** 外国人永久居留身份证 */
  foreignerRermanentIdCard = '08',
  /** 港澳居民身份证 */
  hkOrMacaoIdCard = '09',
  /** 台湾通行证 */
  taiwan = '10',
  /** 户口本证件类型 */
  houseHoldRegister = '11',
  /** 组织机构代码 */
  organizingCode = '11',
  /** 工商执照注册号 */
  businessLicense = '12',
  /** 统一社会信用代码 */
  unifySocialCreditCode = '13',
  /** 其他 */
  other = '99',
}

/** 团体证件编码 */
export enum GroupCertificateTypeCodeEnum {
  /** 组织机构代码 */
  organizingCode = 'g01',
  /** 税务登记证 */
  taxationCode = 'g02',
  /** 统一社会信用代码(团) */
  xwUnifySocialCreditCode = 'g03',
  /** 营业执照编码 */
  businessLicenseCode = 'g04',
  /** 统一社会信用代码 */
  unifySocialCreditCode = 'g05',
}

const CITY_MAP: KeyMapAny<string> = {
  11: '北京',
  12: '天津',
  13: '河北',
  14: '山西',
  15: '内蒙古',
  21: '辽宁',
  22: '吉林',
  23: '黑龙江 ',
  31: '上海',
  32: '江苏',
  33: '浙江',
  34: '安徽',
  35: '福建',
  36: '江西',
  37: '山东',
  41: '河南',
  42: '湖北 ',
  43: '湖南',
  44: '广东',
  45: '广西',
  46: '海南',
  50: '重庆',
  51: '四川',
  52: '贵州',
  53: '云南',
  54: '西藏 ',
  61: '陕西',
  62: '甘肃',
  63: '青海',
  64: '宁夏',
  65: '新疆',
  71: '台湾',
  81: '香港',
  82: '澳门',
  91: '国外',
}

/** 证件号码最长长度 */
const CERTIFICATE_TYPE_MAX_LENGTH = 20

/**
 * 证件号码验证
 */
class CertificateNoValidator {
  /**
   * 证件号码验证
   * @param certificateNo string
   * @param type srting
   * @return string
   */
  public static validate(certificateNo: string, type: string) {
    if (certificateNo === '') return ''

    if (certificateNo.toString().length > CERTIFICATE_TYPE_MAX_LENGTH) {
      return ERROR_MSG_MAP.maxLength20
    }

    switch (type) {
      case CertificateTypeCodeEnum.idCard:
      case CertificateTypeCodeEnum.houseHoldRegister:
      case CertificateTypeCodeEnum.icCard:
        return this.getIdCard18Error(certificateNo)
      case CertificateTypeCodeEnum.passport:
        return this.getIPassPortIdError(certificateNo)
      case CertificateTypeCodeEnum.armypass:
        return this.getIArmypassError(certificateNo)
      case CertificateTypeCodeEnum.HMTidCard:
        return this.getIHMTidCardError(certificateNo)
      case CertificateTypeCodeEnum.hkOrMacaoIdCard:
        return this.getHkOrMacaoIdCardError(certificateNo)
      case GroupCertificateTypeCodeEnum.organizingCode:
        return this.getOrganizingCodeError(certificateNo)
      case GroupCertificateTypeCodeEnum.taxationCode:
        return this.getTaxationCodeError(certificateNo)
      case GroupCertificateTypeCodeEnum.businessLicenseCode:
        return this.getBusinessLicenseCodeError(certificateNo)
      case GroupCertificateTypeCodeEnum.xwUnifySocialCreditCode:
      case GroupCertificateTypeCodeEnum.unifySocialCreditCode:
        return this.getUnifySocialCreditCodeError(certificateNo)
      default:
        return ''
    }
  }

  /**
   * 身份证验证错误提示
   * @param idCard
   * @return string
   */
  private static getIdCard18Error(idCard: string) {
    if (idCard === '') return ''

    const birthday =
      idCard.substr(6, 4) +
      '/' +
      Number(idCard.substr(10, 2)) +
      '/' +
      Number(idCard.substr(12, 2))
    const d = dayjs(birthday)
    const newBirthday =
      d.year() + '/' + Number(d.month() + 1) + '/' + Number(d.date())
    const currentTime = new Date().getTime()
    const time = d.valueOf()

    if (
      !/^\d{17}(\d|x)$/i.test(idCard) || // '非法身份证';
      CITY_MAP[idCard.substr(0, 2)] === undefined || // "非法地区";
      time >= currentTime ||
      birthday !== newBirthday // '非法生日';
    ) {
      return ERROR_MSG_MAP.id18
    }

    if (!this.isCorrectCard(idCard)) {
      return ERROR_MSG_MAP.id18 // '非法身份证哦';
    }
    return ''
  }

  /**
   * 港澳居民身份证验证错误提示
   * @param value
   * @return string
   */
  private static getHkOrMacaoIdCardError(value: string) {
    if (value === '') return '' // '非法字符串';
    const reg =
      /^[8]\d{5}(19\d{2}|2\d{3})(0[1-9]|[1][0-2])(0[1-9]|[12][0-9]|3[01])\d{3}[0-9xX]$/
    if (!value || !reg.test(value)) return ERROR_MSG_MAP.hkOrMacaoIdCard
    if (value.length === 18 && !this.isCorrectCard(value)) {
      return ERROR_MSG_MAP.hkOrMacaoIdCard
    }
    return ''
  }

  /**
   * 护照验证错误提示
   * 请输入长度8位或9位的字符,允许录入大写字母和阿拉伯数字组合、或纯数字
   * @param value string
   * @return string
   */
  private static getIPassPortIdError(value: string) {
    if (value === '') return ''
    const regAll = /^[A-Z\d]{7,9}$/
    const reg = /^[A-Z]+$/
    if (!regAll.test(value) || reg.test(value)) {
      return ERROR_MSG_MAP.passPortId
    }
    return ''
  }

  /**
   * 军人证验证错误提示
   * @param value string
   * @return string
   */
  private static getIArmypassError(value: string) {
    if (value === '') return ''
    const regAll =
      /^((\u519b{1}\d{7})|(\d{1}\u519b{1}\d{6})|(\d{2}\u519b{1}\d{5})|(\d{3}\u519b{1}\d{4})|(\d{4}\u519b{1}\d{3})|(\d{5}\u519b{1}\d{2})|(\d{6}\u519b{1}\d{1})|(\d{7}\u519b{1}))?$/
    return regAll.test(value) ? '' : ERROR_MSG_MAP.armypass
  }

  /**
   * 获取港澳回乡证或台胞证的校验规则错误提示
   * （台胞证）为8位字符，且只允许为阿拉伯数字；
   * （港澳回乡证）H或M+ 8至11位数字；其中，香港居民为H开头 + 8至11位数字；澳门居民为M+ 8至11位数字。
   * @param value string
   * @returns string
   */
  private static getIHMTidCardError(value: string) {
    if (value === '') return ''

    if (/^\d{8}$/.test(value) || /^[HM]\d{8,11}$/.test(value)) {
      return ''
    }

    return ERROR_MSG_MAP.HMTCardId
  }

  /**
   * 获取统一社会信用代码由18位大写字母 、数字组成错误提示
   * @param value string
   * @return string
   */
  private static getUnifySocialCreditCodeError(value: string) {
    if (value === '') return ''
    return /^[0-9A-Z]{18}$/.test(value)
      ? ''
      : ERROR_MSG_MAP.unifySocialCreditCode
  }

  /**
   * 获取组织机构代码错误提示
   * @param value
   * @return string
   */
  private static getOrganizingCodeError(value: string) {
    const organizingCode = value.trim().replace(/\s+/g, '')
    const reg = /^$|^[0-9|A-Z]{8}[0-9|X]$/
    if (!reg.test(organizingCode)) {
      return ERROR_MSG_MAP.organizationCode
    }

    const isOrganizingCode = this.isOrganizingCode(value)

    return isOrganizingCode ? '' : ERROR_MSG_MAP.organizationCode
  }

  /**
   * 获取税务登记证错误提示
   * @param taxationCode
   * @return string
   */
  private static getTaxationCodeError(taxationCode = '') {
    let ssvalid
    let ocvalid
    let cardDate
    if (taxationCode === '') {
      return ''
    }

    const value = taxationCode.trim().replace(/\s+/g, '')
    const myRegExp = /^[0-9]{14}[0-9|A-Z]{1}$/
    const myRegExp2 = /^[0-9]{18}[0-9|A-Z]{2}$/
    const myRegExp3 = /^[0-9]{17}[X][0-9|A-Z]{2}$/
    const myRegExp4 = /^[0-9]{2}$/
    const myRegExpIDCardNo =
      /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/
    const valid =
      myRegExp.test(value) ||
      myRegExp2.test(value) ||
      myRegExp3.test(value) ||
      myRegExpIDCardNo.test(value) ||
      (value.length === 17 && myRegExpIDCardNo.test(value.substring(0, 15)))

    if (!valid) {
      return ERROR_MSG_MAP.taxationCode
    }

    const length = value.length

    switch (length) {
      case 17:
      case 20: {
        const ssIDCardNo = value.substring(0, value.length - 2)
        const orderCode = value.substring(value.length - 2, value.length)
        ocvalid = myRegExp4.test(orderCode)
        ssvalid = myRegExpIDCardNo.test(ssIDCardNo)

        if (!ocvalid || !ssvalid) {
          return ERROR_MSG_MAP.taxationCode
        }
        if (value.length === 17) {
          cardDate = '19' + value.substring(6, 12)
          if (!this.isCorrectDate(cardDate)) {
            return ERROR_MSG_MAP.taxationCode
          }
          return ''
        }

        cardDate = value.substring(6, 14)
        if (!this.isCorrectDate(cardDate)) {
          return ERROR_MSG_MAP.taxationCode
        }
        const cardId = value.substring(0, 18)
        if (!this.isCorrectCard(cardId)) {
          return ERROR_MSG_MAP.taxationCode
        }
        return ''
      }
      case 15: {
        if (!myRegExpIDCardNo.test(value)) {
          const ssOrgCode = value.substring(6, 15)
          if (this.getOrganizingCodeError(ssOrgCode)) {
            return ERROR_MSG_MAP.taxationCode
          }
          return ''
        }

        if (myRegExpIDCardNo.test(value)) {
          cardDate = '19' + value.substring(6, 12)
          if (!this.isCorrectDate(cardDate)) {
            return ERROR_MSG_MAP.taxationCode
          }

          return ''
        }
        return ''
      }
      case 18: {
        cardDate = value.substring(6, 14)

        if (!this.isCorrectDate(cardDate) || !this.isCorrectCard(value)) {
          return ERROR_MSG_MAP.taxationCode
        }
        return ''
      }
      default:
        return ERROR_MSG_MAP.taxationCode
    }
  }

  /**
   * 获取营业执照错误提示
   * @param value string
   * @reurn string
   */
  private static getBusinessLicenseCodeError(value: string) {
    if (value === '') {
      return ''
    }
    const tmp = /^[0-9]*$/
    const valueLength = value.length
    // 13 - 15 位纯数字
    if (tmp.test(value) && [13, 15].includes(valueLength)) {
      return ''
    }

    if (valueLength === 18) {
      if (
        !/^[a-zA-Z0-9]{2}[0-9]{6}[^]{9}[a-zA-Z0-9]$/.test(value) ||
        !this.isOrganizingCode(value.substring(8, 17))
      ) {
        return ERROR_MSG_MAP.businessLicenseCode
      }

      return ''
    }

    return ERROR_MSG_MAP.businessLicenseCode
  }

  /** 是否正确日期 */
  private static isCorrectDate(date: string) {
    if (!date) {
      return false
    }
    const _date = date.match(
      /(19\d{2}|2\d{3})(0[1-9]|[1][0-2])(0[1-9]|[12][0-9]|3[01])/
    )
    if (!_date) {
      return false
    }

    return Number(_date[3]) <= dayjs(date).daysInMonth()
  }

  /**
   * 是否正确的证件号码
   * @param cardId
   */
  private static isCorrectCard(cardId: string) {
    if (!cardId) return false
    if (cardId.length !== 18) return false

    const lastChar = cardId[17]
    const wiParams = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const yParams = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let sum = 0
    for (let i = 0; i < cardId.length - 1; i++) {
      const temp = cardId[i]
      sum = sum + parseInt(temp, 10) * wiParams[i]
    }
    const y = sum % 11

    return lastChar === yParams[y]
  }

  /**
   * 是否组织编码
   * @param value
   * @param options
   */
  private static isOrganizingCode(
    value: string,
    options: {
      reg?: RegExp
      str?: string
    } = {}
  ) {
    const {
      reg = /^$|^[0-9|A-Z]{8}[0-9|X]$/,
      str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    } = options

    const organizingCode = value.trim().replace(/\s+/g, '')
    const params = [3, 7, 9, 10, 5, 8, 4, 2]
    if (!reg.test(organizingCode)) {
      return false
    }

    let sum = 0
    for (let i = 0; i < organizingCode.length - 1; i++) {
      const temp = organizingCode[i]
      if (!/[A-Z]/.test(temp)) {
        sum = sum + parseInt(temp, 10) * params[i]
      } else {
        sum = sum + (str.indexOf(temp) + 10) * params[i]
      }
    }
    const mod = 11 - (sum % 11)
    if (
      (mod === 10 && organizingCode[8] !== 'X') ||
      (mod === 11 && organizingCode.charAt(8) !== '0') ||
      (mod !== 10 && mod !== 11 && String(mod) !== organizingCode.charAt(8))
    ) {
      return false
    }

    return true
  }
}

export default CertificateNoValidator
