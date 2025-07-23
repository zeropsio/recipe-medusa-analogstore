import { PageServerLoad } from '@analogjs/router';
import Medusa from '@medusajs/js-sdk';
import { HttpTypes } from '@medusajs/types';

export const load = async ({
  params, // params/queryParams from the request
  req, // H3 Request
  res, // H3 Response handler
  fetch, // internal fetch for direct API calls,
  event, // full request event
}: PageServerLoad) => {
  // Initialize Medusa SDK with the same configuration as frontend
  const medusaConfig = {
    baseUrl: process.env['VITE_MEDUSA_BACKEND_URL'] || 'http://localhost:9000',
    publishableKey: process.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'] || '',
  };

  const medusaClient = new Medusa({
    debug: process.env['NODE_ENV'] === 'development',
    ...medusaConfig,
  });

  // Fetch collections using Medusa SDK
  const [{ collections }, { regions }] =await  Promise.all([medusaClient.store.collection.list(), medusaClient.store.region.list()]);

  const regionMap = new Map<string, HttpTypes.StoreRegion>();
  regions.forEach((region: HttpTypes.StoreRegion) => {
    region.countries?.forEach((c) => {
      regionMap.set(c.iso_2 ?? '', region);
    });
  });

  const region = regionMap.get(params?.['countryCode'] || 'us');

  return {
    collections: {
      collections,
      count: collections.length,
    },
    countryCode: params?.['countryCode'] || '',
    region: region,
  };
};
