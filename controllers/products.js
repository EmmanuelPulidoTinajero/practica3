import { generateUUID } from "./utils.js";

export class Product {
    constructor(uid, title, description, image, unit, stock, pricePerUnit, category) {
        this._uid = undefined; 
        this._title = title;
        this._description = description;
        this._image = image;
        this._unit = unit;
        this._stock = stock;
        this._pricePerUnit = pricePerUnit;
        this._category = category;
        this.uid = undefined;
    }

    get uuid() {
        return this._uid;
    }

    set uid(newUid) {
        if (this._uid) {
            throw new ProductException("uso interno");
        }
        this._uid = generateUUID();
    }

    get title() {
        return this._title;
    }

    set title(newTitle) {
        if (newTitle === "") {
            throw new ProductException("cadena vacía");
        }
        this._title = newTitle;
    }

    get description() {
        return this._description;
    }

    set description(newDescription) {
        if (newDescription === "") {
            throw new ProductException("cadena vacía");
        }
        this._description = newDescription;
    }

    get image() {
        return this._image;
    }

    set image(newImage) {
        if (newImage === "") {
            throw new ProductException("cadena vacía");
        }
        this._image = newImage;
    }

    get unit() {
        return this._unit;
    }

    set unit(newUnit) {
        if (newUnit === "") {
            throw new ProductException("cadena vacía");
        }
        this._unit = newUnit;
    }

    get stock() {
        return this._stock;
    }

    set stock(newStock) {
        if (newStock < 0) {
            throw new ProductException("stock no puede ser negativo");
        }
        this._stock = newStock;
    }

    get pricePerUnit() {
        return this._pricePerUnit;
    }

    set pricePerUnit(newPricePerUnit) {
        if (newPricePerUnit < 0) {
            throw new ProductException("precio por unidad no puede ser negativo");
        }
        this._pricePerUnit = newPricePerUnit;
    }

    get category() {
        return this._category;
    }

    set category(newCategory) {
        if (newCategory === "") {
            throw new ProductException("cadena vacía");
        }
        this._category = newCategory;
    }

    static createFromJson(jsonValue) {
        const obj = JSON.parse(jsonValue);
        return Product.createFromObject(obj);
    }

    static createFromObject(obj) {
        const product = new Product(
            obj.uid,
            obj.title,
            obj.description,
            obj.image,
            obj.unit,
            obj.stock,
            obj.pricePerUnit,
            obj.category
        );
        return product;
    }

    static cleanObject(obj) {
        const validKeys = ['uid', 'title', 'description', 'image', 'unit', 'stock', 'pricePerUnit', 'category'];
        const cleanedObj = {};

        for (let key in obj) {
            if (validKeys.indexOf(key) !== -1) {
                cleanedObj[key] = obj[key];
            }
        }
        return cleanedObj;
    }

    toHTML() {
        return `
            <div class="product">
                <img src="${this.image}" alt="${this.title}" />
                <h3>${this.title}</h3>
                <p>${this.description}</p>
                <p>Precio: $${this.pricePerUnit} / ${this.unit}</p>
                <p>Stock: ${this.stock}</p>
                <p>Categoría: ${this.category}</p>
            </div>
        `;
    }
}

export class ProductException extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = "ProductException";
    }
}