import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import Medusa, { Config } from '@medusajs/js-sdk';
import { HttpTypes } from '@medusajs/types';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import medusaError from '../util/medusa-error';
import { convertToLocale } from '../util/money';
import { getPercentageDiff } from '../util/get-percent-diff';

export const MEDUSA_CONFIG = new InjectionToken<Config>('MEDUSA_CONFIG');

export function provideMedusaConfig(config: Config) {
  return {
    provide: MEDUSA_CONFIG,
    useValue: config || {
      baseUrl: '',
    },
  };
}

@Injectable({ providedIn: 'root' })
export class MedusaService {
  #medusaConfig = inject(MEDUSA_CONFIG);
  #http = inject(HttpClient);
  #regionMap = new Map<string, HttpTypes.StoreRegion>();

  public async productList({
    pageParam = 1,
    queryParams,
    countryCode,
    regionId,
  }: {
    pageParam?: number;
    queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
    countryCode?: string;
    regionId?: string;
  }): Promise<{
    response: { products: HttpTypes.StoreProduct[]; count: number };
    nextPage: number | null;
    queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  }> {
    if (!countryCode && !regionId) {
      throw new Error('Country code or region ID is required');
    }

    let region: HttpTypes.StoreRegion | undefined | null;

    if (countryCode) {
      region = await this.getRegion(countryCode);
    } else {
      region = await this.retrieveRegion(regionId!);
    }

    if (!region) {
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      };
    }

    const limit = queryParams?.limit || 12;
    const _pageParam = Math.max(pageParam, 1);
    const offset = (_pageParam - 1) * limit;

    const response = await firstValueFrom(
      this.#http.get<{
        products: HttpTypes.StoreProduct[];
        count: number;
      }>(`${this.#medusaConfig.baseUrl}/store/products`, {
        params: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            '*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags',
          ...queryParams,
        },
        headers: {
          'x-publishable-api-key':
            import.meta.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'] || '',
        },
      })
    );

    if (!response) {
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      };
    }

    const { products, count } = response;

    const nextPage = count > offset + limit ? pageParam + 1 : null;
    return {
      response: {
        products,
        count,
      },
      nextPage: nextPage,
      queryParams,
    };
  }

  public listCollections(queryParams: Record<string, string> = {}): Observable<{
    collections: HttpTypes.StoreCollection[];
    count: number;
  }> {
    return this.#http
      .get<{
        collections: HttpTypes.StoreCollection[];
        count: number;
      }>(`${this.#medusaConfig.baseUrl}/store/collections`, {
        params: queryParams,
        headers: {
          'x-publishable-api-key':
            import.meta.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'] || '',
        },
      })
      .pipe(
        map(({ collections }) => ({ collections, count: collections.length }))
      );
  }

  /**
   * Regions
   */

  public listRegions(): Observable<HttpTypes.StoreRegion[]> {
    return this.#http
      .get<{ regions: HttpTypes.StoreRegion[] }>(
        `${this.#medusaConfig.baseUrl}/store/regions`,
        {
          headers: {
            'x-publishable-api-key':
              import.meta.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'] || '',
          },
        }
      )
      .pipe(
        map(({ regions }) => regions),
        catchError((error) => medusaError(error))
      );
  }

  public async getRegion(countryCode: string) {
    try {
      if (this.#regionMap.has(countryCode)) {
        return this.#regionMap.get(countryCode);
      }

      const regions = await firstValueFrom(this.listRegions());

      if (!regions) {
        return null;
      }

      regions?.forEach((region) => {
        region.countries?.forEach((c) => {
          this.#regionMap.set(c?.iso_2 ?? '', region);
        });
      });

      const region = countryCode
        ? this.#regionMap.get(countryCode)
        : this.#regionMap.get('us');

      return region;
    } catch (e: any) {
      return null;
    }
  }

  public retrieveRegion = async (id: string) => {
    try {
      const response = await firstValueFrom(
        this.#http.get<{ region: HttpTypes.StoreRegion }>(
          `${this.#medusaConfig.baseUrl}/store/regions/${id}`,
          {
            headers: {
              'x-publishable-api-key':
                import.meta.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'] || '',
            },
          }
        )
      );
      return response.region;
    } catch (error) {
      return medusaError(error);
    }
  };

  /**
   * Products
   */
  public getPricesForVariant(variant: any) {
    if (!variant?.calculated_price?.calculated_amount) {
      return null;
    }

    return {
      calculated_price_number: variant.calculated_price.calculated_amount,
      calculated_price: convertToLocale({
        amount: variant.calculated_price.calculated_amount,
        currency_code: variant.calculated_price.currency_code,
      }),
      original_price_number: variant.calculated_price.original_amount,
      original_price: convertToLocale({
        amount: variant.calculated_price.original_amount,
        currency_code: variant.calculated_price.currency_code,
      }),
      currency_code: variant.calculated_price.currency_code,
      price_type: variant.calculated_price.calculated_price.price_list_type,
      percentage_diff: getPercentageDiff(
        variant.calculated_price.original_amount,
        variant.calculated_price.calculated_amount
      ),
    };
  }

  public getProductPrice({
    product,
    variantId,
  }: {
    product: HttpTypes.StoreProduct | null;
    variantId?: string;
  }) {
    if (!product || !product.id) {
      throw new Error('No product provided');
    }

    const cheapestPrice = () => {
      if (!product || !product.variants?.length) {
        return null;
      }

      const cheapestVariant: any = product.variants
        .filter((v: any) => !!v.calculated_price)
        .sort((a: any, b: any) => {
          return (
            a.calculated_price.calculated_amount -
            b.calculated_price.calculated_amount
          );
        })[0];

      return this.getPricesForVariant(cheapestVariant);
    };

    const variantPrice = () => {
      if (!product || !variantId) {
        return null;
      }

      const variant: any = product.variants?.find(
        (v) => v.id === variantId || v.sku === variantId
      );

      if (!variant) {
        return null;
      }

      return this.getPricesForVariant(variant);
    };

    return {
      product,
      cheapestPrice: cheapestPrice(),
      variantPrice: variantPrice(),
    };
  }

  /**
   * Server-side methods
   */

  /**
   * Gets collections and region data for a country code
   * This method is designed to be used in server-side load functions
   * @param countryCode The country code to get the region for
   * @param medusaClient Optional Medusa client instance for server-side use
   */
  public async getCollectionsAndRegion(
    countryCode: string,
    medusaClient?: Medusa
  ): Promise<{
    collections: { collections: HttpTypes.StoreCollection[]; count: number };
    region: HttpTypes.StoreRegion | undefined;
  }> {
    if (!medusaClient) {
      throw new Error('Medusa client is required for server-side operations');
    }

    // Fetch collections
    const { collections } = await medusaClient.store.collection.list();

    // Fetch regions and build region map
    const { regions } = await medusaClient.store.region.list();

    const regionMap = new Map<string, HttpTypes.StoreRegion>();
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMap.set(c.iso_2 ?? '', region);
      });
    });

    // Get region for the country code
    const region = regionMap.get(countryCode || 'us');

    return {
      collections: {
        collections,
        count: collections.length,
      },
      region,
    };
  }
}
