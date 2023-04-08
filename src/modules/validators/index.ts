import BaseValidator from './base';
import CertificateNoValidator from './certificate';
import validateStringUtils from './string';
import VehicleValidator from './vehicle';
import validatorNumberUtils from './number'

/**
 * 验证证件号码
 * @param certificateNo
 * @param certificateType
 * @returns string
 */
const validateCertificateNo = (
  certificateNo: string,
  certificateType: string,
) => CertificateNoValidator.validate(certificateNo, certificateType);

/**
 * 验证邮箱
 * @param email
 * @returns string
 */
const validateEmail = (email: string) => BaseValidator.getEmailError(email);

/**
 * 验证联系方式
 * @param phoneNumber
 * @param isMobile
 * @returns string
 */
const validatePhoneNumber = (phoneNumber: string, isMobile = true) =>
  isMobile
    ? BaseValidator.getMobileError(phoneNumber)
    : BaseValidator.getLinkPhoneError(phoneNumber);

/**
 * 车架号验证
 * @param vehicleFrameNo 
 * @returns string
 */
const validateVehicleFrameNo = (vehicleFrameNo: string) => VehicleValidator.getVehicleFrameNoError(vehicleFrameNo);

/**
 * 发动机验证
 * @param engineNo 
 * @returns string
 */
const validateVehicleEngineNo = (engineNo: string) => VehicleValidator.getEngineNoError(engineNo)

/**
 * 车牌号验证
 * @param vehicleLicense 
 * @param isNonMotor 
 * @returns string
 */
const validateVehicleLicence = (vehicleLicence: string, isNonMotor = false) =>
isNonMotor 
  ? VehicleValidator.getNonMotorVehicleNoError(vehicleLicence)
  : VehicleValidator.getVehicleLicenceError(vehicleLicence)

export {
  validateCertificateNo,
  validateEmail,
  validatePhoneNumber,
  validateVehicleFrameNo,
  validateVehicleEngineNo,
  validateVehicleLicence,
  validateStringUtils,
  validatorNumberUtils,
};
