/**
 * @module filters
 */ /** */

import {FilterService} from "../services/FilterService";
/**
 *
 * @returns {(target:any)=>undefined}
 * @decorator
 */
export function Filter() {

    return (target) => {

        FilterService.set(target);

    }
}