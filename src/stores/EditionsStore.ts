import { observable, action, ObservableMap, map } from "mobx";
import { Models } from "savitri-shared";

import { fetchData } from "../shared/utils";

export class EditionsStore {
    @observable selectedEdition: number;
    @observable shownEdition: number;
    @observable editionsList: Models.IEdition[];
    @observable private editionsMap: ObservableMap<Models.IEdition>;
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

    @action setSelectedEdition = (edition: number) => {

        this.selectedEdition = edition;
    }

    @action setShownEdition = (edition: number) => {

        this.shownEdition = edition;
    }

    @action addEdition = (edition: Models.IEdition) => {

        this.editionsMap.set(edition.year.toString(), edition);
    }

    getEditionObj = (edition: number) => {

        edition = edition || 1950;

        return this.editionsMap.get(edition.toString());
    }

    getSelectedEdition = (edition?: number) => {

        edition = edition || 1950;

        if (this.editionsMap.has(edition.toString())) {

            this.setSelectedEdition(edition);
            return;
        }

        return this.fetchEdition(Models.Edition.getEditionsURL(edition))
            .then(edition => this.setSelectedEdition(edition));
    }

    getShownEdition = (edition?: number) => {

        edition = edition || 1950;

        if (this.editionsMap.has(edition.toString())) {

            this.setShownEdition(edition);
            return;
        }

        return this.fetchEdition(Models.Edition.getEditionsURL(edition))
            .then(edition => this.setShownEdition(edition));
    }

    getEditionsList = () => {

        if (this.editionsList.length) {

            return;
        }

        return this.fetchEditions(Models.Edition.getEditionsURL());
    }

    getBookName = (book: number, edition?: number) => {

        edition = edition || 1950;
        const editionTOC = this.editionsMap.get(edition.toString()).toc;

        let bookObj: any = {};
        editionTOC.parts.find(part => {

            const matchingBook = part.books.find(bookObj => bookObj.no === book);

            if (matchingBook) {

                bookObj = matchingBook;
                return true;
            }

            return false;
        });

        return <Models.BookTOC>bookObj;
    }

    getSectionDetails = (book: number, canto: number, section: number, edition?: number) => {

        edition = edition || 1950;

        const editionTOC = this.editionsMap.get(edition.toString()).toc;

        let selectedSection: any = {};
        editionTOC.parts.find(part => {

            const matchingBook = part.books.find(bookObj => bookObj.no === book);

            if (matchingBook) {

                const matchingCanto = matchingBook.cantos.find(cantoObj => cantoObj.no === canto);

                const matchingSection = matchingCanto.sections.find(sectionObj => sectionObj.no === section);

                selectedSection = {
                    edition,
                    matchingBook,
                    matchingCanto,
                    matchingSection
                };

                return true;
            }

            return false;
        });

        return selectedSection;
    }

    private fetchEditions = (editionsURL: string) => {

        this.loadingAllEditions = true;

        return fetchData<Models.IEdition[]>(editionsURL)
            .then(this.setEditionsList)
            .then(() => this.loadingAllEditions = false);
    }

    private fetchEdition = (editionURL: string) => {

        this.loadingEditions.add(editionURL);

        return fetchData<Models.IEdition>(editionURL)
            .then(edition => {

                this.addEdition(edition);
                this.loadingEditions.delete(editionURL);
                return edition.year;
            });
    }
}
