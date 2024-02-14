import { Mark } from "./mark";

export class Ship extends Mark {
    constructor(cell) {
        super(cell) 
            this.logo = null;
            this.name = 'ship';
            this.color = 'grey'
    }
}