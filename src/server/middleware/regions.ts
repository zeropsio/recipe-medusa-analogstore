/// <reference types="vite/client" />

import { HttpTypes } from '@medusajs/types';
import {
  defineEventHandler,
  getRequestURL,
  H3Event,
  parseCookies,
  sendRedirect,
  setCookie,
} from 'h3';

const BACKEND_URL = import.meta.env['VITE_MEDUSA_INSTANCE_URL'] || '';
const PUBLISHABLE_API_KEY =
  import.meta.env['VITE_MEDUSA_PUBLISHABLE_KEY'] || '';
const DEFAULT_REGION = import.meta.env['VITE_DEFAULT_REGION'] || 'us';

export default defineEventHandler(async (event: H3Event) => {
  let redirectUrl = getRequestURL(event).href;
  const pathname = getRequestURL(event).pathname;

  if (!(redirectUrl.includes('__analog') || pathname.includes('.'))) {
    let cacheIdCookie = parseCookies(event)['_medusa_cache_id'];

    let cacheId = cacheIdCookie || crypto.randomUUID();

    const regionMap = await getRegionMap(cacheId);

    const countryCode = regionMap && (await getCountryCode(event, regionMap));

    const urlHasCountryCode =
      countryCode && pathname.split('/')[1].includes(countryCode);

    // if one of the country codes is in the url and the cache id is not set, set the cache id and redirect
    if (urlHasCountryCode && !cacheIdCookie) {
      setCookie(event, '_medusa_cache_id', cacheId, {
        maxAge: 60 * 60 * 24 * 7,
      });
    } else {
      const redirectPath = pathname === '/' ? '' : pathname;

      const queryString = getRequestURL(event).search
        ? getRequestURL(event).search
        : '';

      // If no country code is set, we redirect to the relevant region.
      if (!urlHasCountryCode && countryCode) {
        redirectUrl = `${
          getRequestURL(event).origin
        }/${countryCode}${redirectPath}${queryString}`;
        sendRedirect(event, `${redirectUrl}`, 401);
      }
    }
  }
});

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
};

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache;

  if (!BACKEND_URL) {
    throw new Error(
      'Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named VITE_PUBLIC_MEDUSA_BACKEND_URL.'
    );
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_API_KEY!,
      },
      // next: {
      //   revalidate: 3600,
      //   tags: [`regions-${cacheId}`],
      // },
      cache: 'force-cache',
    }).then(async (response) => {
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message);
      }

      return json;
    });

    if (!regions?.length) {
      throw new Error(
        'No regions found. Please set up regions in your Medusa Admin.'
      );
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? '', region);
      });
    });

    regionMapCache.regionMapUpdated = Date.now();
  }

  return regionMapCache.regionMap;
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  event: H3Event,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode;

    // const vercelCountryCode = request.headers
    //   .get('x-vercel-ip-country')
    //   ?.toLowerCase();

    const urlCountryCode = getRequestURL(event)
      .pathname.split('/')[1]
      ?.toLowerCase();

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode;
    } else {
      countryCode = DEFAULT_REGION;
    }
    // else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
    //   countryCode = vercelCountryCode;
    // } else if (regionMap.has(DEFAULT_REGION)) {
    //   countryCode = DEFAULT_REGION;
    // } else if (regionMap.keys().next().value) {
    //   countryCode = regionMap.keys().next().value;
    // }

    return countryCode;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        'Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named VITE_PUBLIC_MEDUSA_BACKEND_URL.'
      );
    }
  }
}
