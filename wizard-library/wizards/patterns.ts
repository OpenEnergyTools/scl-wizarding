const nameStartChar =
  '[:_A-Za-z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]' +
  '|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]' +
  '|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]';
const nameChar = `${nameStartChar}|[.0-9\\-]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040]`;
const name = `${nameStartChar}(${nameChar})*`;
const nmToken = `(${nameChar})+`;

export const patterns = {
  string:
    '([\u0009-\u000A]|[\u000D]|[\u0020-\u007E]|[\u0085]|[\u00A0-\uD7FF]' +
    '|[\uE000-\uFFFD])*',
  normalizedString:
    '([\u0020-\u007E]|[\u0085]|[\u00A0-\uD7FF]|[\uE000-\uFFFD])*',
  name,
  tName:
    '([\u0020-\u007E]|[\u0085]|[\u00A0-\uD7FF]|[\uE000-\uFFFD])' +
    '([\u0020-\u007E]|[\u0085]|[\u00A0-\uD7FF]|[\uE000-\uFFFD])*',
  nmToken,
  names: `${name}( ${name})*`,
  nmTokens: `${nmToken}( ${nmToken})*`,
  decimal: '[+\\-]?[0-9]+(([.][0-9]*)?|([.][0-9]+))',
  unsigned: '[+]?[0-9]+(([.][0-9]*)?|([.][0-9]+))',
  integer: '[+\\-]?[0-9]+([0-9]*)',
  alphanumericFirstUpperCase: '[A-Z][0-9,A-Z,a-z]*',
  alphanumericFirstLowerCase: '[a-z][0-9,A-Z,a-z]*',
  alphanumericFirst: '[A-Z,a-z][0-9,A-Z,a-z]*',
  ldInst: '[A-Za-z0-9][0-9A-Za-z_]*',
  prefix: '[A-Za-z][0-9A-Za-z_]*',
  lnClass: '(LLN0)|[A-Z]{4,4}',
  lnInst: '[0-9]{1,12}',
  abstractDataAttributeName:
    '((T)|(Test)|(Check)|(SIUnit)|(Oper)|(SBO)|(SBOw)|(Cancel)|[a-z][0-9A-Za-z]*)',
  cdc:
    '(SPS)|(DPS)|(INS)|(ENS)|(ACT)|(ACD)|(SEC)|(BCR)|(HST)|(VSS)|(MV)|(CMV)|(SAV)|' +
    '(WYE)|(DEL)|(SEQ)|(HMV)|(HWYE)|(HDEL)|(SPC)|(DPC)|(INC)|(ENC)|(BSC)|(ISC)|(APC)|(BAC)|' +
    '(SPG)|(ING)|(ENG)|(ORG)|(TSG)|(CUG)|(VSG)|(ASG)|(CURVE)|(CSG)|(DPL)|(LPL)|(CSD)|(CST)|' +
    '(BTS)|(UTS)|(LTS)|(GTS)|(MTS)|(NTS)|(STS)|(CTS)|(OTS)|(VSD)',
  uuid: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
  id: '\\S{1,255}',
  path: '.+(/.+)*',
  mappedDoName:
    '(([A-Za-z][0-9A-Za-z_]{0,63})/([A-Za-z][0-9A-Za-z_]{0,63})/((LLN0|([A-Za-z][0-9A-Za-z_]{0,10})?[A-Z]{4}[0-9]{1,12})).)?([A-Z][0-9A-Za-z]{0,11}(.[a-z][0-9A-Za-z]*(([0-9]+))?)?)',
  vlanid: '[0-9A-F]{3}',
  vlanPriority: '[0-7]',
  ipv4: '([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5]).([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5]).([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5]).([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])',
  ipv6: '([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}',
};

export const maxLength = {
  cbName: 32,
  abstracDaName: 60,
  ldInst: 64,
  prefix: 11,
  lnInst: 12,
  dosName: 12,
};

export const predefinedBasicTypeEnum = [
  'BOOLEAN',
  'INT8',
  'INT16',
  'INT24',
  'INT32',
  'INT64',
  'INT128',
  'INT8U',
  'INT16U',
  'INT24U',
  'INT32U',
  'FLOAT32',
  'FLOAT64',
  'Enum',
  'Dbpos',
  'Tcmd',
  'Quality',
  'Timestamp',
  'VisString32',
  'VisString64',
  'VisString65',
  'VisString129',
  'VisString255',
  'Octet64',
  'Unicode255',
  'Struct',
  'EntryTime',
  'Check',
  'ObjRef',
  'Currency',
  'PhyComAddr',
  'TrgOps',
  'OptFlds',
  'SvOptFlds',
  'LogOptFlds',
  'EntryID',
  'Octet6',
  'Octet16',
];

export const valKindEnum = ['Spec', 'Conf', 'RO', 'Set'];

export const functionalConstraintEnum = [
  'ST',
  'MX',
  'SP',
  'SV',
  'CF',
  'DC',
  'SG',
  'SE',
  'SR',
  'OR',
  'BL',
  'EX',
  'CO',
];

export const attributeNameEnum = [
  'T',
  'Test',
  'Check',
  'SIUnit',
  'Oper',
  'SBO',
  'SBOw',
  'Cancel',
  'Addr',
  'PRIORITY',
  'VID',
  'APPID',
  'TransportInUse',
  'IPClassOfTraffic',
  'IPv6FlowLabel',
  'IPAddressLength',
  'IPAddress',
];

export const tSpecServiceType = [
  'Poll',
  'Report',
  'GOOSE',
  'SMV',
  'Wired',
  'Internal',
];

export const tSCLFileType = ['SED', 'SCC'];

export const tRightEnum = ['full', 'fix', 'dataflow'];

export const tSmpMod = ['SmpPerPeriod', 'SmpPerSec', 'SecPerSmp'];
