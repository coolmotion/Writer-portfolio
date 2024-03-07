// Function to fetch and parse CSV data with a timestamp
async function fetchCSV(url) {
    // Append a timestamp as a query parameter to the URL
    const timestampedURL = `${url}?timestamp=${Date.now()}`;

    const response = await fetch(timestampedURL);
    const data = await response.text();
    return Papa.parse(data, { header: true, skipEmptyLines: true }).data;
}

// Sample product data (replace this with your actual data)
let products = [];

// Function to filter and display products based on the selected category
function filterProducts(category) {
    // Remove the 'selected' class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('selected');
    });

    // Add the 'selected' class to the clicked tab
    const selectedTab = document.querySelector(`.tab[onclick="filterProducts('${category}')"]`);
    if (selectedTab) {
        selectedTab.classList.add('selected');
    }

    // Filter and display products
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}


// Function to display products in the product container
function displayProducts(products) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white p-4 rounded-lg shadow-md mb-4';

        const productImage = document.createElement('img');
        productImage.src = `img/${product.id}.jpeg`; // Replace with the actual image path
        productImage.alt = product.name;
        productImage.className = ' w-full h-32 object-contain mb-4';

        const productName = document.createElement('h3');
        productName.className = 'text-lg text-black font-semibold';
        productName.textContent = product.name;

        const productPrice = document.createElement('p');
        productPrice.className = 'text-gray-600 pb-2';
        productPrice.textContent = ` ${product.price}`;

        // Assuming the order link is stored in the orderLink field
        const orderLink = product.orderLink;

        const preOrderLink = document.createElement('a');
        preOrderLink.href = orderLink; // Use the order link instead of the WhatsApp link
        preOrderLink.className = 'bg-blue-500 text-white rounded-full px-4 py-2 mt-4';
        preOrderLink.textContent = 'Read more';

        // Append elements to the product card
        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);
        productCard.appendChild(preOrderLink);

        // Append product card to the container
        productContainer.appendChild(productCard);
    });
}
// ... (your existing code)

// Function to handle the search
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    // Filter products based on the search term
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));

    // Display the filtered products
    displayProducts(filteredProducts);
}

// Add an event listener for the search input to filter products dynamically while typing
document.getElementById('searchInput').addEventListener('input', handleSearch);

// Fetch CSV data and initialize the products array
fetchCSV('products.csv')
    .then(data => {
        products = data;
        filterProducts('all'); // Display all products by default
    })
    .catch(error => console.error('Error fetching CSV:', error));
