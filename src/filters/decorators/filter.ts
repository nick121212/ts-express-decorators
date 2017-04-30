import {FilterService} from "../services/FilterService";
export function Filter() {

    return (target) => {

        FilterService.set(target);

    }
}