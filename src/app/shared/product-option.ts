import { Dimension } from './product-dimension';

export class ProductOption {
    constructor(
        public name : string,
        public imgUrl: string,
        public dimensions: { [id : string] : Dimension }
    ){}
}