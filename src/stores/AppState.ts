import { observable, action } from "mobx";

let instance: AppState;

export class AppState {
    @observable sidenavOpen: boolean;

    static getInstance(initialState?: AppState) {

        if (!instance) {

            instance = new AppState(initialState);
        }

        return instance;
    }

    private constructor(initialState?: AppState) {

        this.sidenavOpen = false;
    }

    @action setSidenavOpen = (open: boolean) => {

        this.sidenavOpen = open;
    }
}
