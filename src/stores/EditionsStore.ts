import { observable, action, computed, ObservableMap, map } from "mobx";
import { Models } from "savitri-shared";

import { fetchData } from "../shared/utils";

export class EditionsStore {
    @observable selectedEdition: number;
    @observable editionsList: Models.IEdition[];
    private editionsMap: ObservableMap<Models.IEdition>;
    private loadingEditions: Set<string>;
    private loadingAllEditions: boolean;

    constructor(inititialState: EditionsStore) {

        this.editionsList = [];
        this.editionsMap = <any>map();
        this.loadingEditions = new Set("");
    }

    @action setEditionsList = (editions: Models.IEdition[]) => {

        this.editionsList = editions;
    }

    @action setShownEdition = (year: number) => {

        this.selectedEdition = year;

        if (!this.editionsMap.has(year.toString())) {

            this.fetchEdition(Models.Edition.getEditionsURL(year));
        }
    }

    @action addEdition = (edition: Models.IEdition) => {

        this.editionsMap.set(edition.year.toString(), edition);
    }

    @computed get shownEdition() {

        if (this.selectedEdition) {

            return this.editionsMap.get(this.selectedEdition.toString());
        }

        // return {};
    }

    getEditionsList = () => {

        if (this.editionsList.length) {

            // this.setShownEdition(this.editionsList[0].year);
            return;
        }

        return this.fetchEditions(Models.Edition.getEditionsURL());
    }

    private fetchEditions = (editionsURL: string) => {

        this.loadingAllEditions = true;

        return fetchData<Models.IEdition[]>(editionsURL)
            .then(this.setEditionsList)
            .then(() => this.loadingAllEditions = false);
        // .then(() => {

        //     this.setShownDocumentURL(editionsURL);
        //     this.loadingDocs.delete(editionsURL);
        // });
    }

    private fetchEdition = (editionURL: string) => {

        this.loadingEditions.add(editionURL);

        return fetchData<Models.IEdition>(editionURL)
            .then(this.addEdition)
            .then(() => this.loadingEditions.delete(editionURL));
    }
}
