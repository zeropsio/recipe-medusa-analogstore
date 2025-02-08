import fastGlob from 'fast-glob';
import { HttpTypes } from '@medusajs/types';
import path from 'path';

let MEDUSA_BACKEND_URL = 'http://localhost:9000';

if (process.env['VITE_MEDUSA_BACKEND_URL']) {
  MEDUSA_BACKEND_URL = process.env['VITE_MEDUSA_BACKEND_URL'];
}

/**
 * Retrieve country code for pre-rendering
 */
async function getRegionRoutes() {
  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
    headers: {
      'x-publishable-api-key':
        process.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'] || '',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch regions: ${response.statusText}`);
  }

  const { regions }: { regions: HttpTypes.StoreRegion[] } =
    await response.json();

  const countryRoutes = regions.flatMap((region: HttpTypes.StoreRegion) => {
    if (!region.countries?.length) {
      return [];
    }

    return region?.countries.map((country) => `${country.iso_2}`);
  });

  return countryRoutes;
}

/**
 * Returns an array of file paths from `src/app/pages` where any path
 * segment that contains both an opening and closing bracket (or parenthesis)
 * has been removed.
 */
async function getNormalizedPaths() {
  const files = await fastGlob('**/*.*', {
    cwd: path.resolve('src/app/pages'),
    onlyFiles: true,
  });

  const normalizedPaths = files.map((filePath) => {
    // Split the file path into segments
    const segments = filePath.split('/');

    // Filter out any segment that is empty or contains disallowed patterns.
    const filteredSegments = segments.filter((segment) => {
      if (segment.trim() === '') return false;
      // Remove the segment if it contains both '[' and ']' or both '(' and ')'
      const hasBrackets = segment.includes('[') && segment.includes(']');
      const hasParens = segment.includes('(') && segment.includes(')');
      return !(hasBrackets || hasParens);
    });

    // Join the remaining segments back together.
    let joinedPath = filteredSegments.join('/');

    // Remove a trailing ".page.ts" suffix, if present.
    joinedPath = joinedPath.replace(/\.page\.ts$/, '');

    return joinedPath;
  });

  // As a final step, remove any empty strings from the array.
  const cleanedPaths = normalizedPaths.filter((path) => path !== '');
  return cleanedPaths;
}

export async function getPrerenderedRoutes() {
  const normalizedPaths = await getNormalizedPaths();

  // console.log(normalizedPaths);

  // Get the list of country codes (this is our black-boxed function)

  const countryCodes = await getRegionRoutes();

  // console.log(countryCodes);

  // For every file path, create an entry for every country code.
  // Using flatMap to produce a single flattened array.
  const fileRoutes = normalizedPaths.flatMap((filePath) => {
    // Ensure the filePath does not start with a leading slash.
    const cleanedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return countryCodes.map(
      (countryCode: any) => `/${countryCode}/${cleanedPath}`
    );
  });

  // Also add a base route for each country (e.g., "/us", "/ca", "/gb")
  const baseRoutes = countryCodes.map((countryCode) => `/${countryCode}`);

  // console.log([...baseRoutes, ...fileRoutes]);

  // Combine both sets of routes.
  return [...baseRoutes, ...fileRoutes];
}
