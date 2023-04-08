/**
 * 异步script
 * @param src
 * @param onload
 */
export const asyncScript = (src: string) =>
  new Promise((resolve) => {
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = src;
    g.onload = () => {
      resolve(true);
    };
    s?.parentNode?.insertBefore(g, s);
  });
