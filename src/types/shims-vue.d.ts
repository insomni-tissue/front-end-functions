// eslint-disbale
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent;
  export default component;
}


/**
 * window上属性自定义
 */
interface Window {
  [key: string]: string | number | Types.Noop | Types.PlainObject | unknown;

  initPafeSkeleton: (skeletonRoutes: string[], skeletonRoutesPrefix: string, serverUrl: string, isHash: boolean) => void;
  resetPafeSkeleton: (currentPath: string) => void;
  removePafeSkeleton: () => void;
  wechatJsonHandler: (params: any) => void;
  Android: {
    postMessage: Types.Noop;
  };
  webkit: {
    messageHandlers: {
      postMessage: Types.Noop;
      PAGPNative: any;
      CbwNative: any;
      PALifeOpen: any;
      LCApp: any;
      hczApp: any;
    };
  };
  SKAPP: {
    onEvent: (eventId: string, label: string, attributes: KeyMapAny<any>) => void;
  };
  dtTracker: any;
  PAJSBridge: any;
  PAGPNative: any;
  CbwNative: any;
  PALifeOpen: any;
  LCApp: any;
  hczApp: any;
  AMap: any;
  wiseAPM: any;
  EPaper: any;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.mp3';

declare module 'lodash';

declare module '@/utils/pictureVerfy/pawebjs.min.js';
