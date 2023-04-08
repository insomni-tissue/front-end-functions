import { KeyMapAny } from '../../interface';
import pinyinData from './data';

export class PinYinInteractor {
  /** package pinyin转换组件 */
  private static _pinyin?: any;

  /** 字典 */
  private static _PIN_YIN_DATA?: KeyMapAny<string> = pinyinData;

  /** 设置 package */
  public static setPackage(value: any) {
    this._pinyin = value;
  }

  /**
   * 获取拼音
   * @param chinese
   * @param formatFn
   * @returns string
   */
  public static async getPinyin(
    str: string,
    formatFn?: (value: string[]) => string,
  ) {
    // 脱敏的不解析
    if (!str || str.includes('*')) {
      return '';
    }

    if (!this._pinyin) {
      await this._initPackage();
    }

    let pinyinArr = [];
    const chinese = str.match(/[\u4e00-\u9fa5·]+/g)?.join('') || '';
    if (this._pinyin.isSupported()) {
      pinyinArr = this._getPinYinList(chinese);
    } else {
      pinyinArr = await this._convertPinyin(chinese);
    }
    if (formatFn && typeof formatFn === 'function') {
      return formatFn.call(this, pinyinArr);
    }

    // 生僻字场景可以录入大写英文，非中文，做展示处理
    if (str !== chinese) {
      const startStr = str.substring(0, str.indexOf(chinese));
      const endStr = str.substring(
        str.indexOf(chinese) + chinese.length,
        str.length + 1,
      );
      if (startStr)
        pinyinArr.splice(0, 0, str.substring(0, str.indexOf(chinese)));
      if (endStr)
        pinyinArr.push(
          str.substring(str.indexOf(chinese) + chinese.length, str.length + 1),
        );
    }

    let pinyinStr =
      pinyinArr.length >= 2
        ? this._formatPinyin(pinyinArr)
        : pinyinArr[0] || '';

    // 中文包含· 需将·转换为空格
    if (/·/gi.test(str)) {
      pinyinStr = pinyinStr.replace(/·/gi, ' ');
    }

    return pinyinStr;
  }

  public static async getFormatedPinyin(name: string) {
    const pinyin = await this.getPinyin(name);
    let familyNameSpell = '';
    let firstNameSpell = '';
    if (pinyin) {
      const pinYinValue = pinyin.toUpperCase().split(' ');
      familyNameSpell = /\s(.+)$/.test(pinyin) ? pinYinValue[0] : pinyin;
      firstNameSpell = pinyin.substring(familyNameSpell.length + 1);
    }
    return {
      familyNameSpell,
      firstNameSpell,
    };
  }

  private static _capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static _formatPinyin(arr: string[]) {
    let result = '';
    switch (arr.length) {
      case 4: {
        result =
          this._capitalize(arr[0]) +
          arr[1] +
          ' ' +
          this._capitalize(arr[2]) +
          arr[3];
        break;
      }
      case 2: {
        result = this._capitalize(arr[0]) + ' ' + this._capitalize(arr[1]);
        break;
      }
      case 3: {
        result =
          this._capitalize(arr[0]) + ' ' + this._capitalize(arr[1]) + arr[2];
        break;
      }
      default: {
        result =
          this._capitalize(arr[0]) +
          ' ' +
          this._capitalize(arr[1]) +
          arr.slice(2).join(' ');
        break;
      }
    }
    return result.toUpperCase();
  }

  private static _initPackage() {
    return new Promise((resolve) => {
      import('tiny-pinyin').then((pinyin: any) => {
        PinYinInteractor.setPackage(pinyin);
        resolve(true);
      });
    });
  }

  private static _getPinYinList(name: string) {
    // 19968-40959: 中文unicode范围
    const nameTrimmed = name.replace(/\s/g, '');
    const nameArr: string[] = nameTrimmed.split('');
    let charArr: string[] = [...nameArr];
    if (nameTrimmed.includes('*')) {
      charArr = [charArr[0]];
    }
    const pinyinArr: string[] = [];
    const isChinese = charArr.every(
      (char) => char.charCodeAt(0) >= 19968 && char.charCodeAt(0) <= 40959,
    );
    if (isChinese) {
      charArr.forEach((char) => {
        pinyinArr.push(this._pinyin.convertToPinyin(char, '', true));
      });
    } else {
      pinyinArr.push(this._pinyin.convertToPinyin(name, '', true));
    }
    // 脱敏处理过的，取姓加*
    if (nameArr.includes('*')) {
      for (let i = 1; i < nameArr.length - 1; i++) {
        pinyinArr.push('*');
      }
    }
    return pinyinArr;
  }

  private static async _convertPinyin(l1: string) {
    const l2 = l1.length;
    let I1 = '';
    const pinyinArr = [];
    const reg = new RegExp('[a-zA-Z0-9- ]');
    for (let i = 0; i < l2; i++) {
      const val = l1.substr(i, 1);
      const name = await this._search(val);
      if (reg.test(val)) {
        I1 += val;
      } else if (name !== false) {
        pinyinArr.push(name);
      }
    }
    I1 = I1.replace(/ /g, '-');
    while (I1.indexOf('--') > -1) {
      I1 = I1.replace('--', '-');
    }
    return pinyinArr;
  }

  private static async _search(l1: string) {
    for (const name in this._PIN_YIN_DATA) {
      if (this._PIN_YIN_DATA[name].indexOf(l1) !== -1) {
        return name;
      }
    }
    return false;
  }
}
