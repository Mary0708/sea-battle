import { Mark } from "./mark";

export class Miss extends Mark {
    constructor(cell) {
        super(cell) 
            this.logo = null;
            this.name = 'miss';
            this.color = 'blue'
    }
}