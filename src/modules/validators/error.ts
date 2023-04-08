export const ERROR_MSG_MAP = {
    required: '不能为空',
    id18: '请输入正确的18位身份证',
    hkOrMacaoIdCard: '输入的港澳台居民居住证格式错误',
    id18Baidu: '请输入正确的身份证',
    passPortId: '请输入长度7位~9位的字符,允许录入大写字母和阿拉伯数字组合、或纯数字',
    armypass: '请输入正确的军人证',
    HMTCardId: '请输入正确的港澳回乡证或台胞证',
    unifySocialCreditCode: '统一社会信用代码由18位大写字母 、数字组成',
    icCard: '临时身份证最长只能输入20个字符',
    organizationCode: '9位大写字母和数字组合',
    taxationCode: '15/18/20位大写字母和数字组合',
    businessLicenseCode: '15/18位大写字母和数字组合',
    illegalNameSymbol: "不能出现连续'·'",
    illegalNameSymbol2: "首尾不能出现'·'",
    illegalNameSymbol3: '信息中部不能出现连续空格',
    illegalNameSymbol4: '除末尾脱敏“*”号外不能出现“*”',
    illegaString: "不能为'不详','不祥','未知','不知道'",
    illegaString1: '只能录入中文和符号"·"',
    illegaString2: '只能录入中文、字母、空格、符号"·"',
    illegaString3: "允许录入的规则组合：纯大写字母、大写字母加上空格、纯中文、中文加上符号'·'",
    illegaString4: '只能录入中文、大写字母',
    illegaString5: '不能出现“？”,“*”,“★”,“、”,“，”',
    illegaStringLength: '请输入20位以内字母或数字',
    maxLength20: '最长20位',
    mobilePhone: '请输入正确的11位号码',
    linkPhone: '座机：区号为3或4位且以0开头，号码为7或8位，请以（-）分割；如果是400/800开头则为10位数字。手机：11位数字',
    email: '只允许录入半角字母、半角数字、半角符号“-”、“_”、“.”、“@”，且仅包含一个@',
    vehicleLicense: '请输入正确的车牌号',
    engineNo: '深圳以外机构头尾不能输入空格，中间不能连续输入空格',
    numeric: '纯数字',
    vehicleFrameNo: '请填入正确的17位车架号',
    electrombileNo: '车牌号仅能由汉字、半角大写字母、半角数字或半角"*"、半角"-"号组成，例如：*-*',
    alpha: '只能包含字母',
    ruleName2: '不能出现数字，及非法字符如\'#%&@!、\'等,不能出现\'不详\'、\'未知\'和\'不知道\',信息中部不可出现连续空格',
    floatAmount: '正数，位数小于等于16位，最多2位小数',
    rangeMinMax: (min = 0, max = 10000, dot = 2) => `应大于等于${min}小于等于${max}，最多${dot}位小数`,
    alphaNum: (maxLen = 20) => `仅支持数字或字母，最大长度${maxLen}字符`,
    illegaStringMaxLength: (maxLen = 20) => `长度不能超出${maxLen}个字符`,
    loadAmountTips: '金额不低于',
    diffCertificateNo: '证件号与填写的不一致，请上传正确的证件影像',
    requireSpace: '必须以空格隔开',
  };