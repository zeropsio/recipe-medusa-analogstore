import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import Medusa, { Config } from '@medusajs/js-sdk';
import { HttpTypes, StoreProductListResponse } from '@medusajs/types';
import { catchError, firstValueFrom, from, map, Observable } from 'rxjs';
import medusaError from '../util/medusa-error';
import { toSignal } from '@angular/core/rxjs-interop';
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
  #sdk!: Medusa;
  #medusaConfig = inject(MEDUSA_CONFIG);
  // #http = inject(HttpClient);

  #regionMap = new Map<string, HttpTypes.StoreRegion>();

  constructor() {
    this.#sdk = new Medusa({
      debug: import.meta.env['NODE_ENV'] === 'development',
      ...this.#medusaConfig,
    });
  }

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

    return this.#sdk.client
      .fetch<{
        products: HttpTypes.StoreProduct[];
        count: number;
      }>(`/store/products`, {
        method: 'GET',
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            '*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags',
          ...queryParams,
        },
        // TODO: make dynamic
        headers: {
          'x-publishable-api-key': this.#medusaConfig.publishableKey || '',
        },
        // next,
        cache: 'force-cache',
      })
      .then(({ products, count }) => {
        const nextPage = count > offset + limit ? pageParam + 1 : null;

        return {
          response: {
            products,
            count,
          },
          nextPage: nextPage,
          queryParams,
        };
      });
  }

  public listCollections(queryParams: Record<string, string> = {}): Observable<{
    collections: HttpTypes.StoreCollection[];
    count: number;
  }> {
    // const next = {
    //   ...(await getCacheOptions("collections")),
    // }

    // queryParams.limit = queryParams.limit || "100"
    // queryParams.offset = queryParams.offset || "0"

    return from(
      this.#sdk.client.fetch<{
        collections: HttpTypes.StoreCollection[];
        count: number;
      }>('/store/collections', {
        query: queryParams,
        // next,
        cache: 'force-cache',
      })
    ).pipe(
      map(({ collections }) => ({ collections, count: collections.length }))
    );
    // .then(({ collections }) => ({ collections, count: collections.length }));
  }

  /**
   * Regions
   */

  public listRegions(): Observable<HttpTypes.StoreRegion[]> {
    return from(
      this.#sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(
        `/store/regions`,
        {
          method: 'GET',
          cache: 'force-cache',
        }
      )
    ).pipe(
      map(({ regions }) => regions),
      catchError((error) => medusaError(error))
    );
    // .then(({ regions }) => regions)
    // .catch(medusaError);
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
    // const next = {
    //   ...(await getCacheOptions(["regions", id].join("-"))),
    // }

    return this.#sdk.client
      .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: 'GET',
        // next,
        cache: 'force-cache',
      })
      .then(({ region }) => region)
      .catch(medusaError);
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
}
