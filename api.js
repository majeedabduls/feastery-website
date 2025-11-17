const API_URL = "http://localhost:5000";

async function getProducts() {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    return data.products;
}
