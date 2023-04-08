/* eslint-disable @typescript-eslint/no-explicit-any */
import { asyncScript } from '../async-script';
import { AmapLocationAddressType, AmapProvinceType } from './interface';

const asyncAmapMap = () => new Promise((resolve) => {
  window.onAmapLoad = () => {
    resolve(true);
  };

  if (window?.AMap?.Map) {
    return resolve(true);
  }
});

/**
 * 高德地图相关操作
 * 为了节省资源，采用有异步加载，操作基本为异步操作，请留意
 *
 * @class AMapInteractor
 */
class AMapInteractor {
  private static _instance: AMapInteractor | null = null;

  private static _amapSrc = 'https://webapi.amap.com/maps?v=1.3&key=2c7be58cca107ce087d7ef41a875a65f&plugin=AMap.Geocoder,AMap.Autocomplete,AMap.PlaceSearch,AMap.Geolocation&callback=onAmapLoad';

  public static async getInstance(): Promise<AMapInteractor> {
    if (!this._instance) {
      await asyncScript(this._amapSrc);
      await asyncAmapMap();
      this._instance = new AMapInteractor();
    }
    return Promise.resolve(this._instance);
  }

  /** 高德实例 */
  private _amap?: any;

  /** 高德地图标记 */
  private _amapMarker?: any;

  // private _dongguanZhongshanData?: KeyMapAny<KeyMapAny<string>>;

  // private _addressTranferData?: KeyMapAny<KeyMapAny<string>>;

  /** 当前定位 */
  private _curruntLocation?: AmapLocationAddressType;

  // /** 当前地址 */
  // private _currentAddress?: AddressEntity;

  constructor() {
    this._amap = new window.AMap.Map('amap-container', {
      resizeEnable: true,
      zoom: 10,
    });
  }

  public destroyed() {
    // 销毁地图，并清空地图容器
    this._amap.destroy();
    delete this._amap;
    // 清空单例
    AMapInteractor._instance = null;
  }

  public search(city: string, input: string, callback: () => void, tips = true) {
    const autoOptions = {
      map: this._amap,
      city: city || '全国',
      extensions: 'all',
    };

    if (!tips) {
      delete autoOptions.map;
    }

    const placeSearch = new window.AMap.PlaceSearch(autoOptions);
    placeSearch.search(input, callback);
  }

  public getGeocoderAddress(lngLat: any[], callback: any) {
    window.AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new window.AMap.Geocoder({
        map: this._amap,
        city: '全国',
      });

      geocoder.getAddress(lngLat, callback);
    });
  }

  /**
   * 更新标记
   * @param lngLat 经纬度 [116.397428, 39.90923]
   */
  public updateMarker(lngLat: any[]) {
    const marker = this._getMarker();
    marker.setPosition(lngLat);
    marker.setAnimation('AMAP_ANIMATION_DROP');
  }

  public getMarkPosition() {
    const marker = this._getMarker();
    const position = marker.getPosition();
    if (position?.lng) {
      return [position?.lng, position?.lat];
    }
    return [];
  }

  /**
   * 获取当前定位
   * @returns
   */
  public autolocation(): Promise<AmapLocationAddressType> {
    return new Promise((resolve, reject) => {
      if (this._curruntLocation) {
        resolve(this._curruntLocation);
        return;
      }
      this._amap?.plugin('AMap.Geolocation', () => {
        const geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 100000,
          buttonOffset: new window.AMap.Pixel(10, 20),
          zoomToAccuracy: true,
          buttonPosition: 'RB',
          showCircle: false,
        });
        geolocation.options.markerOptions.bubble = true;
        this._amap.addControl(geolocation);
        geolocation.getCurrentPosition();
        window.AMap.event.addListener(geolocation, 'complete', (data: AmapLocationAddressType) => {
          this._curruntLocation = data;
          resolve(data);
        });
        window.AMap.event.addListener(geolocation, 'error', (error: any) => {
          console.warn('获取定位失败', error);
          reject(error);
        });
      });
    });
  }

  /**
   * 获取自动定位省份
   * @returns
   */
  public getCurrentProvince(): Promise<AmapProvinceType> {
    return new Promise((resolve, reject) => {
      this.autolocation().then((data: AmapLocationAddressType) => {
        const address = data.formattedAddress.slice(0, 2);
        import('./data/carMessageData')
          .then((jsonData) => {
            const provinceData = jsonData.provinceData;
            for (const i in provinceData) {
              // 判断省份。
              if (provinceData[i].province.slice(0, 2) === address) {
                // 判断城市。
                if (data.formattedAddress.indexOf(provinceData[i].city) !== -1) {
                  // 判断页面是否有车牌信息，没有就传送。
                  const provinceName = provinceData[i].letter.slice(0, 1);
                  const letter = provinceData[i].letter.slice(1, 2);
                  resolve({
                    province: provinceName,
                    letter,
                  });
                  break;
                }
              }
            }
          }).catch((err) => {
            reject(err);
          });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // public getCurrentAddress(): Promise<AddressEntity> {
  //   return new Promise((resolve, reject) => {
  //     if (this._currentAddress) {
  //       resolve(this._currentAddress);
  //       return;
  //     }
  //     this.autolocation().then((data: AmapLocationAddressType) => {
  //       this.getLocalTranser().then(() => {
  //         const address = new AddressEntity();
  //         const adr = data.addressComponent;
  //         const formatAddress = data.formattedAddress;
  //         const basicAddress = `${adr.province}${adr.city}`;
  //         const adcode = adr.adcode || '';
  //         address.insuranceAddress = `${basicAddress}${adr.district || adr.township}`;
  //         address.address = formatAddress;
  //         address.province = adcode.substr(0, 2) + '0000';
  //         address.city = adcode.substr(0, 4) + '00';
  //         address.county = adr.township;
  //         // 针对东莞中山没有区县进行转换
  //         address.county = (['442000', '441900'].includes(address.city) && !adr.district) ? this._transferDZCountyCode(address.city, adr.township) : adcode;
  //         const transferAddress = this._transferCountyCode(address.city, address.county);

  //         this._currentAddress = assign(address, transferAddress) as AddressEntity;
  //         resolve(this._currentAddress);
  //       });
  //     }).catch((err) => {
  //       reject(err);
  //     });
  //   });
  // }

  /** 获取地址编码转换数据 */
  // public getLocalTranser() {
  //   return new Promise((resolve) => {
  //     Promise.all([getDongguanZhongshanMapJson(), getAddressMapJson()])
  //       .then((res) => {
  //         this._dongguanZhongshanData = res[0];
  //         this._addressTranferData = res[1];
  //         resolve(res);
  //       });
  //   });
  // }

  private _getMarker() {
    if (!this._amapMarker) {
      this._amapMarker = new window.AMap.Marker({ map: this._amap });
    }
    return this._amapMarker;
  }

  get amap(): any {
    return this._amap;
  }

  // /** 转换地址编码 */
  // private _transferCountyCode(city: string, county: string) {
  //   const address = {
  //     city,
  //     county,
  //   };
  //   if (this._addressTranferData) {
  //     // 高德地图有的编码在EBCS里没有，此处做一下转换
  //     if (this._addressTranferData.cityCodeRel?.[city]) {
  //       address.city = this._addressTranferData.cityCodeRel[city];
  //     }

  //     if (this._addressTranferData.countyCodeRel?.[county]) {
  //       address.county = this._addressTranferData.countyCodeRel[county];
  //     }

  //     if (address.city === address.county) {
  //       address.county = '';
  //     }
  //   }

  //   return address;
  // }

  // /** 东莞中山地址转换 */
  // private _transferDZCountyCode(city: string, township: string) {
  //   return this._dongguanZhongshanData?.[city]?.[township] || '';
  // }
}

export {
  AMapInteractor,
  asyncAmapMap
};
