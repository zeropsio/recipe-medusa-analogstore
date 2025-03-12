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

  const { regions } = await medusaClient.store.region.list();

  const regionMap = new Map<string, HttpTypes.StoreRegion>();
  regions.forEach((region: HttpTypes.StoreRegion) => {
    region.countries?.forEach((c) => {
      regionMap.set(c.iso_2 ?? '', region);
    });
  });

  const region = regionMap.get(params?.['countryCode'] || 'us');

  // const product = await listProducts({
  //   countryCode: params.countryCode,
  //   queryParams: { handle },
  // }).then(({ response }) => response.products[0])

  const productList = await medusaClient.store.product.list({
    country_code: params?.['countryCode'],
    handle: params?.['productId'],
  });

  const product = productList.products[0];

  // Fetch collections using Medusa SDK
  // const { product } = await medusaClient.store.product.retrieve(
  //   params?.['productId'] || ''
  // );

  console.log('product', product);
  console.log('region', region);
  console.log('countryCode', params?.['countryCode']);

  return {
    product,
    countryCode: params?.['countryCode'] || '',
    region: region,
  };
};
