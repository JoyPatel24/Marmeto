// Define productsData object
const productsData = {
    men: [],
    women: [],
    kids: []
  };
  
  // Function to fetch data from the provided API URL
  async function fetchData() {
    try {
      const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data.categories;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return []; // Return empty array in case of error
    }
  }
  
  // Process the fetched data and populate productsData object
  async function processFetchedData() {
    const categories = await fetchData();
    categories.forEach(category => {
      const categoryName = category.category_name.toLowerCase();
      category.category_products.forEach(product => {
        productsData[categoryName].push(product);
      });
    });
  }
  
  // Generate product card HTML for a single product
  function createProductCard(product) {
    const discount = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
    
    return `
      <div class="product-card">
        <img src="${product.image}" alt="Product Image">
        <div class="badge">${product.badge_text ? product.badge_text : ''}
        
        </div>
        <div class="product-info">
        <h3 class="product-title">${product.title} - <span class="vendor"> ${product.vendor}</span></h3>
          <div class="price-container">
          <p class="price">Rs ${product.price}.00</p>
          <p class="compare-price">Rs ${product.compare_at_price}.00</p>
          <p class="discount">${discount}% off</p>
          </div>
        </div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;
  }
  
  // Function to change tab and render product cards for the selected category
  function changeTab(tabName) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear previous products
  
    const products = productsData[tabName];
    products.forEach(product => {
      productContainer.innerHTML += createProductCard(product);
    });
  }
  
  const tabs = document.querySelectorAll('.tab');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((otherTab) => {
      otherTab.classList.remove('active');
    });

    tab.classList.add('active');
  });
});

  // Main function to initialize the page
  async function initializePage() {
    await processFetchedData(); // Fetch and process data
    changeTab('men'); // Initially load products for the 'Men' category
  
    // Event listeners for tab switching
    document.getElementById('menTab').addEventListener('click', () => changeTab('men'));
    document.getElementById('womenTab').addEventListener('click', () => changeTab('women'));
    document.getElementById('kidsTab').addEventListener('click', () => changeTab('kids'));
  }
  
  // Entry point - call the initializePage function
  initializePage();
  