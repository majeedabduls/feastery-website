const API_URL = "https://feastery.onrender.com";

// Get all products
async function getProducts() {
    const res = await fetch(`${API_URL}/products/all`);
    const data = await res.json();
    return data.products;
}

