import { getProductById } from "./data_handler.js";

class ShoppingCart {
    constructor() {
        this.products = [] 
        this.proxies =[]
    }

    addItem(productUid, amount) {
        let proxy = this.proxies.find(p => p.uid === productUid);
        if (proxy) {
            proxy.quantity += amount;
        } else {
            proxy = new ProductProxy(productUid, amount);
            this.proxies.push(proxy);

            let product = getProductById(productUid);
            if (product) {
                this.products.push(product);
            }
        }
    }

    updateItem(productUid, newAmount) {
        let result = this.proxies.findIndex(p => p.uid === productUid);
        if (newAmount < 0) {
            throw new ShoppingCartException("Amount cannot be negative");
        }
        if (result !== -1) {
            this.proxies[result].quantity = newAmount;
            if (newAmount === 0) {
                this.removeItem(productUid);
            }
        }
    }

    removeItem(productUid) {
        let proxyIndex = this.proxies.findIndex(p => p.uid === productUid);
        if (proxyIndex !== -1) {
            this.proxies.splice(proxyIndex, 1);
            this.products.splice(proxyIndex, 1);
        }
    }

    calculateTotal() {
        let total = 0;
        for (let i = 0; i < this.proxies.length; i++) {
            let proxy = this.proxies[i];
            let product = this.products[i];
            if (product) {
                total += product.pricePerUnit * proxy.quantity;
            }
        }
        return total;
    }
    findProduct(query) {
    if (!query) {
        return productsList;
    }

    const parts = query.split(":");
    let category = parts[0] ? parts[0].replace(/^\s+|\s+$/g, '') : "";
    let title = parts[1] ? parts[1].replace(/^\s+|\s+$/g, '') : "";

    if (category && title) {
        return productsList.filter(product =>
            product.category.indexOf(category) !== -1 && product.title.indexOf(title) !== -1
        );
    } else if (category) {
        return productsList.filter(product =>
            product.category.indexOf(category) !== -1
        );
    } else if (title) {
        return productsList.filter(product =>
            product.title.indexOf(title) !== -1
        );
    } else {
        return [];
    }
}
}

class ProductProxy {
    constructor(uid, quantity) {
        this.uid = uid;
        this.quantity = quantity;
    }
}

class ShoppingCartException extends Error {
    constructor(message) {
        super(message);
        this.name = "ShoppingCartException";
    }
}

export { ShoppingCart, ProductProxy, ShoppingCartException };