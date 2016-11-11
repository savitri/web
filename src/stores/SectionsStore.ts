import { observable, action, computed, ObservableMap, map } from "mobx";
import { Models } from "savitri-shared";

import { fetchData } from "../shared/utils";
import { ReadRouterParams } from "../screens/read";

export class SectionsStore {
    @observable shownSectionURL: string;
    @observable shownCanto: Models.CantoTOC;
    private sectionsMap: ObservableMap<Models.ISection>;
    private loadingSections: Set<string>;

    constructor(initialState: SectionsStore) {

        this.sectionsMap = <any>map();
        this.loadingSections = new Set([]);
    }

    @action addSection = (sectionURL: string, section: Models.ISection) => {

        this.sectionsMap.set(sectionURL, section);
    }

    @action setShownSection = (sectionURL: string) => {

        this.shownSectionURL = sectionURL;
    }

    @action setShownCanto = (canto: Models.CantoTOC) => {

        this.shownCanto = canto;
    }

    @computed get shownSection() {

        return this.sectionsMap.get(this.shownSectionURL);
    }

    getSection = (params: ReadRouterParams) => {

        const sectionURL = Models.Section.getSectionsURL(params.book, params.canto, params.section);

        if (this.sectionsMap.has(sectionURL)) {

            this.setShownSection(sectionURL);
            return;
        }

        return this.fetchSection(sectionURL);
    }

    private fetchSection = (sectionURL: string) => {

        this.loadingSections.add(sectionURL);

        return fetchData<Models.ISection>(sectionURL)
            .then(section => this.addSection(sectionURL, section))
            .then(() => {

                this.setShownSection(sectionURL);
                this.loadingSections.delete(sectionURL);
            });
    }
}
