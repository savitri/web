import * as Stores from "../stores";

export interface Context {
    appState: Stores.AppState;
    editionsStore: Stores.EditionsStore;
    sectionsStore: Stores.SectionsStore;
    blogsStore: Stores.BlogsStore;
}
