import { clear } from "console";

const CATURL: string = 'https://api.thecatapi.com/v1/images/search'; 

/**
 * Fetches a random cat image URL from the Cat API. Throws error on failure.
 * 
 * @param CatAPIKey - The API key for the Cat API. If undefined, the request will be made without an API key.
 * @param timeout - The timeout for the request in milliseconds. Default is 5000ms.
 * 
 * @returns [string, string] - An array containing the cat image ID and URL.
 */

export async function getCatImage(CatAPIKey : string | undefined, timeout : number = 5000): Promise<[string, string]> {
    const headers = new Headers();

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (CatAPIKey !== undefined) {
        headers.append('x-apikey', CatAPIKey);
    }

    const response = await fetch(CATURL, {headers, signal});
    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error('response not ok');
    }

    const data = await response.json();

    console.log(data);
    return [data[0].url, data[0].id];
}
