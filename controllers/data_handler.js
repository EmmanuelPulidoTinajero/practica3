let productsList = [];

function getProducts() {
    return productsList;
}

function getProductById(uuid) {
    const product = productsList.find(p => p.uid === uuid);
    return product || null;
}

function createProduct(product) {
    productsList.push(product);
}

function updateProduct(uuid, updatedProduct) {
    let result = productsList.findIndex(p => p.uid === uuid);
    if (result !== -1) {
        productsList[result] = updatedProduct;
    } else {
        console.log("product not found");
    }
}

function deleteProduct(uuid) {
    let result = productsList.findIndex(p => p.uid === uuid);
    if (result !== -1) {
        productsList.splice(result, 1);
    } else {
        console.log("product not found");
    }
}
function findProduct(query) {
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


export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, findProduct};