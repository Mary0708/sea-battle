import { Mark } from "./mark";

export class Damage extends Mark {
    constructor(cell) {
        super(cell) 
            this.logo = 'X';
            this.name = 'damage';
            this.color = 'red'
    }
}
