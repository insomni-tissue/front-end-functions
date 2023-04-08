import { ERROR_MSG_MAP } from "./error";

/**
 * 字符串验证
 */
class StringValidator {
  /**
   * 不能为'不详','不祥','未知','不知道'
   * @param value string
   * @string string
   */
  public static illegaString(value: string) {
    return /不详|不祥|未知|不知道/.test(value) ? ERROR_MSG_MAP.illegaString : '';
  }

  /**
   * 只能录入中文和符号"·"
   * @param value string
   * @string string
   */
  public static illegaString1(value: string) {
    return /^[\u4e00-\u9fa5\·]+$/.test(value) ? '' : ERROR_MSG_MAP.illegaString1;
  }

  /**
   * 只能录入中文、字母、空格、符号"·"
   * @param value string
   * @string string
   */
  public static illegaString2(value: string) {
    return /[^a-zA-Z\u4e00-\u9fa5\·\s]+/.test(value) ? ERROR_MSG_MAP.illegaString2 : '';
  }

  /**
   * 允许录入的规则组合：纯大写字母、大写字母加上空格、纯中文、中文加上符号'·'
   * @param value string
   * @string string
   */
  public static illegaString3(value: string) {
    return /[\u4e00-\u9fa5\·]+/.test(value) && /[\sA-Z]+/.test(value) ? ERROR_MSG_MAP.illegaString3 : '';
  }

  /**
   * 只能录入中文、大写字母
   * @param value string
   * @string string
   */
  public static illegaString4(value: string) {
    if (!value) return ERROR_MSG_MAP.required;
    return /[^A-Z\u4e00-\u9fa5]+/.test(value) ? ERROR_MSG_MAP.illegaString4 : '';
  }

  /**
   * 不能出现“？”,“*”,“★”,“、”,“，”
   * @param value 
   * @returns 
   */
  public static illegaString5(value: string) {
    return /[*★、，？]/g.test(value) ? ERROR_MSG_MAP.illegaString5 : '';
  }

  /**
   * 不能出现连续·
   * @param value string
   * @string string
   */
  public static illegaStringSymbol(value: string) {
    return /[^\s]+[\·]{2,}[^\s]+/.test(value) ? ERROR_MSG_MAP.illegalNameSymbol : '';
  }

  /**
   * 首尾不能出现·
   * @param value string
   * @string string
   */
  public static illegaStringSymbol2(value: string) {
    return /^\·|\·$/.test(value) ? ERROR_MSG_MAP.illegalNameSymbol2 : '';
  }

  /**
   * 信息中部不能出现连续空格
   * @param value string
   * @string string
   */
  public static illegaStringSymbol3(value: string) {
    return /\s{2,}/.test(value) 
      ? ERROR_MSG_MAP.illegalNameSymbol3 
      : '';
  }
  /**
   * 除末尾脱敏“*”号外不能出现“*”
   * @param value string
   * @string string
   */
  public static illegaStringSymbol4(value: string) {
    if (value.endsWith('*')) {

      return /^\*?\*$/.test(value.substr(value.indexOf('*'), value.length)) ? ERROR_MSG_MAP.illegalNameSymbol4 : '';
    }

    return '';
  }

  /**
   * 录入范围为最少${minLength = 2}位汉字，且不超过${maxLength = 150}位字符
   * @param value
   * @param options
   */
  public static illegaChineseLength(value: string, options: {
    maxLength?: number;
    minLength?: number;
    errorTips?: string;
  } = {}) {
    const {
      maxLength = 150,
      minLength = 2,
      errorTips = '',
    } = options;
    const regChinese = /[\u4e00-\u9fa5]/g;
    let chineseNum = 0;
    const errorMsg = errorTips || `录入范围为最少${minLength}位汉字，且不超过${maxLength}位字符`;
    value.replace(regChinese, () => {
      chineseNum++;
      return '';
    });

    if (value.length + chineseNum > maxLength) {
      return errorMsg;
    }

    const regAll = /[^A-Z\u4e00-\u9fa5\·\s]+/;
    if (chineseNum && !regAll.test(value)) {
      chineseNum = chineseNum * 2;
    }

    let num = 0;
    if (value.length < minLength * 2) {
      if (chineseNum !== 0) {
        num = value.length - 1;
      }
      if (num + chineseNum < minLength * 2) {
        return errorMsg;
      }
    }

    return '';
  }

  /**
 * @msg: 不超过20位字母或数字
 * @param value string
 * @return
 */
  public static illegaStringLength(value: string) {
    if (!value) return '';
    const reg = /^[a-zA-Z0-9]{1,20}$/;
    if (!reg.test(value)) return ERROR_MSG_MAP.illegaStringLength;
    return '';
  }

  /**
    * @msg: 长度不超过
   * @param value string
   * @param maxLen number
   * @return
   */
  public static illegaStringMaxLength(value: string, maxLen: number) {
    if (!value) return '';
    if (String(value).length > maxLen) return ERROR_MSG_MAP.illegaStringMaxLength(maxLen);
    return '';
  }

  /**
   * 只能为字母
   * @param value
   * @returns
   */
  public static alpha(value: string) {
    if (!value) return '';
     if (!/^[a-zA-Z]+$/.test(value)) return ERROR_MSG_MAP.alpha;
    return '';
  }

  /**
   * 名称2
   */
  public static ruleName2(value: string): string {
    if (typeof value === 'undefined' || value === null || value === '') {
      return '';
    }

    const trim = /[^\s]+[\s]{1,}[^\s]+/;
    const regAll = /[\a-z\A-Z\u2500-\u257F\.~!@#￥%……&*【】、{}|；‘’：“”，。、《》？\~!@#\$%^&*`\[\]\\{}|;’:”,\/<>\?\d0-9\§№☆★○●◎◇◆□℃‰€°¤〓↓↑←→※▲△■＃＆＠＼︿＿￣―♂♀\≈≡≠＝≤≥＜＞≮≯∷∞∝∮∫／÷×－＋±∧∑∨∏∪∩∈∵∴√∽≌⊙⌒∠∥⊥ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛①②③④⑤⑥⑦⑧⑨⑩⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇āáǎàōóǒòêìǐíīèěéēūúǔùǖǘǚǜü\，、；：？！…—ˉ¨〔〕()〈〉《》「」『』〖〗【】［］｛｝]/g;
    // '不能出现"不详"、"未知”和“不知道”'
    if (value === '不详' || value === '未知' || value === '不知道') {
      return ERROR_MSG_MAP.ruleName2;
    }
    // '不能出现数字，及非法字符如“#%&@!、”等'
    if (regAll.test(value)) {
      return ERROR_MSG_MAP.ruleName2;
    }
    // '信息中部不可出现连续空格'
    if (trim.test(value)) {
      return ERROR_MSG_MAP.ruleName2;
    }

    return '';
  }

  /**
   * 只能录入中文、大写字母(包含生僻字)
   * @param value
   * @returns
   */
  public static ruleRareWords(value: string) {
    if (!value) return ERROR_MSG_MAP.required;
    return /(^[A-Z\u2E80-\uFE4F]{2,32}$)/.test(value) ? '' : ERROR_MSG_MAP.illegaString4;
  }
}

export default StringValidator;
