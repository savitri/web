import { observable, action } from "mobx";

export class AppState {
    @observable sidenavOpen: boolean;

    constructor(initialState: AppState) {

        this.sidenavOpen = false;
    }

    @action setSidenavOpen = (open: boolean) => {

        this.sidenavOpen = open;
    }
}
