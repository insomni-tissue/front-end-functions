import dayjs from 'dayjs';
import { isFunction } from 'lodash-es';
import sha1 from 'sha1';
import { KeyMapAny } from '../../interface';

/*
 * Browser features (plugins, resolution, cookies)
 */
const getBrowserFeature = () => {
  const navigatorAlias = navigator || {};
  const windowAlias = window || {};
  const screenAlias = windowAlias.screen || {};

  const pluginMap: KeyMapAny<string> = {
    // document types
    pdf: 'application/pdf',

    // media players
    qt: 'video/quicktime',
    realp: 'audio/x-pn-realaudio-plugin',
    wma: 'application/x-mplayer2',

    // interactive multimedia
    dir: 'application/x-director',
    fla: 'application/x-shockwave-flash',

    // RIA
    java: 'application/x-java-vm',
    gears: 'application/x-googlegears',
    ag: 'application/x-silverlight',
  };
  const browserFeature: KeyMapAny<string> = {
    pdf: '',
    qt: '',
    realp: '',
    wma: '',
    dir: '',
    fla: '',
    res: '',
    java: '',
    gears: '',
    cookie: '',
    ag: '',
  };
  // detect browser features except IE < 11 (IE 11 user agent is no longer MSIE)
  if (!new RegExp('MSIE').test(navigatorAlias.userAgent)) {
    // general plugin detection
    if (navigatorAlias.mimeTypes?.length) {
      for (const i in pluginMap) {
        if (Object.prototype.hasOwnProperty.call(pluginMap, i)) {
          const mimeType = navigatorAlias.mimeTypes[pluginMap[i] as any];
          browserFeature[i] = mimeType?.enabledPlugin ? '1' : '0';
        }
      }
    }

    // Safari and Opera
    // IE6/IE7 navigator.javaEnabled can't be aliased, so test directly
    if (
      isFunction(navigatorAlias.javaEnabled) &&
      navigatorAlias.javaEnabled()
    ) {
      browserFeature.java = '1';
    }

    // Firefox
    if (isFunction(windowAlias.GearsFactory)) {
      browserFeature.gears = '1';
    }

    // other browser features
    browserFeature.cookie = navigatorAlias.cookieEnabled ? '1' : '0';
  }

  const width = screenAlias.width;
  const height = screenAlias.height;
  browserFeature.res = width + 'x' + height;
  return browserFeature;
};

export const uuid = () => {
  const navigatorAlias = navigator || {};

  return sha1(`
    ${dayjs().valueOf()}
    ${navigatorAlias.userAgent || ''}
    ${navigatorAlias.platform || ''}
    ${JSON.stringify(getBrowserFeature())}
    ${Math.random()}`);
};
