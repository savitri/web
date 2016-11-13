import { observable, action, computed, ObservableMap, map } from "mobx";
import { Models } from "savitri-shared";

import { fetchData } from "../shared/utils";
import { ReadRouterParams } from "../screens/read";

interface SectionResponse {
    canto: Models.ICanto;
    section: Models.ISection;
}

interface SectionNumber extends ReadRouterParams {
    edition?: number;
}

export class SectionsStore {
    @observable shownSectionURL: string;
    @observable shownCanto: Models.CantoTOC;
    @observable shownEditionTOC: Models.TOC;
    @observable shownSectionNumber: SectionNumber;
    private sectionsMap: ObservableMap<SectionResponse>;
    private loadingSections: Set<string>;

    constructor(initialState: SectionsStore) {

        this.sectionsMap = <any>map();
        this.loadingSections = new Set([]);
    }

    @action addSection = (sectionURL: string, section: SectionResponse) => {

        this.sectionsMap.set(sectionURL, section);
    }

    @action setShownSection = (sectionURL: string) => {

        this.shownSectionURL = sectionURL;
    }

    @action setShownCanto = (canto: Models.CantoTOC) => {

        this.shownCanto = canto;
    }

    @action setShownEditionTOC = (toc: Models.TOC) => {

        this.shownEditionTOC = toc;
    }

    @computed get shownSection() {

        return this.sectionsMap.get(this.shownSectionURL);
    }

    @action setShownSectionNumber = (book: number, canto: number, section: number, edition?: number) => {

        this.shownSectionNumber = { book, canto, section, edition };
    }

    getSection = (book: number, canto: number, section: number, edition?: number) => {

        const sectionURL = Models.Section.getSectionsURL(book, canto, section, edition);

        this.setShownSectionNumber(book, canto, section, edition);

        if (this.sectionsMap.has(sectionURL)) {

            this.setShownSection(sectionURL);
            return;
        }

        return this.fetchSection(sectionURL);
    }

    private fetchSection = (sectionURL: string) => {

        this.loadingSections.add(sectionURL);

        return fetchData<SectionResponse>(sectionURL)
            .then(section => this.addSection(sectionURL, section))
            .then(() => {

                this.setShownSection(sectionURL);
                this.loadingSections.delete(sectionURL);
            });
    }
}
