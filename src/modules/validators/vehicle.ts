import { ERROR_MSG_MAP } from "./error";

/**
 * 车辆信息验证
 */
class VehicleValidator {
  /**
   * 车牌号验证
   * @param vehicleLicense
   * @returns
   */
  public static getVehicleLicenceError(vehicleLicence: string) {
    if (!vehicleLicence ||
      /^[\u4E00-\u9FA5][A-Z]{1}[-]$/.test(vehicleLicence)) {
      return '';
    }

    if (!/^[^-]+[-][^-]+$/.test(vehicleLicence) ||
      /\s/.test(vehicleLicence) ||
      !/^[\u4E00-\u9FA5][A-Z]{1}[-][0-9A-Z\u4E00-\u9FA5]{5}/.test(vehicleLicence)) { // '必须包含“-”且不能在首位和末位'
      return ERROR_MSG_MAP.vehicleLicense;
    }
    return '';
  }

  /**
   * 发动机验证
   * @param engineNo
   * @returns
   */
  public static getEngineNoError(engineNo: string) {
    if (!engineNo) {
      return '';
    }

    // 深圳以外机构头尾不能输入空格，中间不能连续输入空格
    if (/ /.test(engineNo) ||
      !/^\S(\s?\S+)*$/.test(engineNo)) {
      return ERROR_MSG_MAP.engineNo;
    }

    if (/^[\u4e00-\u9fa5a-zA-Z0-9\.\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\\\|\;\:\'\"\<\>\,\?\/\s]*$/.test(engineNo)) {
      return '';
    }

    return ERROR_MSG_MAP.engineNo;
  }

  /**
   * 车架号验证
   * @param vehicleFrameNo
   * @returns
   */
  public static getVehicleFrameNoError(vehicleFrameNo: string) {
    if (!vehicleFrameNo) {
      return '';
    }
    if (vehicleFrameNo.length !== 17 ||
      vehicleFrameNo.includes(' ')) {
      return ERROR_MSG_MAP.vehicleFrameNo;
    }

    if (/^[\u4e00-\u9fa5a-zA-Z0-9\.\`\~\!\@\#\$\%\^\&\(\)\_\+\-\=\[\]\{\}\\\|\;\:\'\"\<\>\,\?\/]*$/.test(vehicleFrameNo)) {
      return '';
    }

    return ERROR_MSG_MAP.vehicleFrameNo;
  }

  /**
   * 非机动车车牌号
   * @param value 车牌号
   */
  public static getNonMotorVehicleNoError(value: string) {
    if (!value) return '';
    if (value.indexOf(' ') > -1) return ERROR_MSG_MAP.electrombileNo;
    if (!/^[^-]+[-][^-]+$/.test(value)) return ERROR_MSG_MAP.electrombileNo;
    if (!/^[\u4e00-\u9fa5A-Z0-9\*\-]*$/.test(value)) return ERROR_MSG_MAP.electrombileNo;
    if (value.length > 50) return '车牌号长度不能超过50';
    return '';
  }
}

export default VehicleValidator;
