import * as fetch from "isomorphic-fetch";
import { Constants } from "savitri-shared";

export function fetchData<T>(url: string, level?: any): Promise<T> {

    const fullURL = Constants.API_SERVER_BASE_URL + url;

    // if (level && appState.isClientEnv) {
    //     appState.addFetch(url, level);
    // }

    return fetch(fullURL)
        .then(response => response.json())
        .then(jsonData => {

            // if (level && appState.isClientEnv) {
            //     appState.deleteFetch(url);
            // }

            return jsonData.data;
        })
        .catch((err: Error) => {

            console.error(err.message);
            return err;
        });
};

export function postData<T>(url: string, body: any): Promise<T> {

    const fullURL = Constants.API_SERVER_BASE_URL + url;

    return fetch(fullURL,
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(jsonData => jsonData.data)
        .catch((err: Error) => {

            console.error(err.message);
            return err;
        });
}
