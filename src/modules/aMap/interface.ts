/** 地址信息 */
export interface AmapAddressComponentType {
  adcode: string;
  building: string;
  buildingType: string;
  businessAreas: string[];
  city: string;
  citycode: string;
  district: string;
  neighborhood: string;
  neighborhoodType: string;
  province: string;
  street: string;
  streetNumber: string;
  township: string;
}

interface PositionType {
  M: number;
  O: number;
  lat: number;
  lng: number;
}

/** 自动定位数据 */
export interface AmapLocationAddressType {
  accuracy?: unknown;
  addressComponent: AmapAddressComponentType;
  crosses: unknown[];
  formattedAddress: string;
  info: string;
  isConverted: boolean;
  location_type: string;
  message: string;
  pois: unknown[];
  position: PositionType;
  roads: unknown[];
  status: number;
  type: string;
  z5: string;
}

export interface AmapProvinceType {
  province: string;
  letter: string;
}
