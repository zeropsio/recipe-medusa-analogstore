import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import Imgproxy from '../util/imgproxy';

const imgproxy = new Imgproxy({
  baseUrl: process.env['IMGPROXY_URL'] || '',
  key: process.env['IMGPROXY_KEY'] || '',
  salt: process.env['IMGPROXY_SALT'] || '',
  encode: true
});

export function provideImgproxyLoader() {
  return {
    provide: IMAGE_LOADER,
    useValue: ({ src, width, loaderParams }: ImageLoaderConfig) => {

      if (!process.env['IMGPROXY_KEY'] || !process.env['IMGPROXY_SALT']) {
        console.warn('IMGPROXY_KEY or IMGPROXY_SALT not set');
        return src;
      }

      try {
        const sourceUrl = src.startsWith('http')
          ? src
          : `${process.env['VITE_PUBLIC_BASE_URL']}${src}`;

        const processedUrl = imgproxy
          .builder()
          .resize('fill', width || 800, width || 800, false)
          .quality(loaderParams?.['quality'] || 80)
          .generateUrl(sourceUrl);

        console.log(processedUrl);

        return processedUrl;
      } catch (error) {
        console.error('Error generating imgproxy URL:', error);
        return src;
      }

    }
  };
}


