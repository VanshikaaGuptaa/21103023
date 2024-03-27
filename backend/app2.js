const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to register with the test server
const registerWithTestServer = async () => {
    try {
      const response = await axios.post('http://20.244.56.144/test/register', {
        companyName: 'goMart',
        ownerName: 'Vanshika',
        rollNo: '21103023',
        ownerEmail: 'vanshikag24003@gmail.com',
        accessCode: 'zpKKbc'
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log("ID is already registered. Displaying the output.");
        // You can return the existing registration data or any other appropriate action here
        // For example:
        printTopProducts();
        return error.response.data;
      }
      console.error('Error registering with test server:', error);
      throw error;
    }
  };

// Function to get authorization token
const getAuthorizationToken = async () => {
  try {
    const response = await axios.post('http://20.244.56.144/test/auth', {
      companyName: 'goMart',
      clientID: '37bb493c-7303-47ea-8675-21f66ef9b735',
      clientSecret: 'HVIQBVbq=TGEmaED',
      ownerName: 'Vanshika',
      ownerEmail: 'vanshikag2403@gmail.com',
      rollNo: '21103023'
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting authorization token:', error);
    throw error;
  }
};

// Function to get top N products from a specific company and category
const getTopProducts = async (companyName, category, n, minPrice, maxPrice, authToken) => {
    try {
      const response = await axios.get(`http://20.244.56.144/test/companies/${companyName}/categories/${category}/products/top-${n}?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting top products:', error);
      throw error;
    }
};

// Function to print the top products on the console
async function printTopProducts() {
    try {
        const authToken = await getAuthorizationToken();
        const companies = ['AMZ', 'FLP', 'SP', 'VN', 'AZO']; // List of registered companies

        for (const company of companies) {
            const topProducts = await getTopProducts(company, 'electronics', 5, 0, 1000000, authToken); // Fetching top 5 electronics products
            console.log(`Top products from ${company}:`);
            topProducts.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name}: ${product.price}`);
            });
            console.log(); // Empty line for better readability
        }
    } catch (error) {
        console.error("Error fetching top products:", error);
    }
}

// Define API routes

app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API');
});

// API endpoint to retrieve top N products within a category and price range
app.get('/categories/:categoryName/products', async (req, res) => {
  const { categoryName } = req.params;
  const { n, minPrice, maxPrice, sortBy, sortOrder, page } = req.query;

  try {
    const authToken = await getAuthorizationToken();
    const companies = ['AMZ', 'FLP', 'SP', 'VN', 'AZO']; // List of registered companies
    const products = [];

    for (const company of companies) {
      const companyProducts = await getTopProducts(company, categoryName, n, minPrice, maxPrice, authToken);
      products.push(...companyProducts);
    }

    // Sort products based on query parameters
    if (sortBy && sortOrder) {
      products.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy] - b[sortBy];
        } else {
          return b[sortBy] - a[sortBy];
        }
      });
    }

    // Pagination
    const pageSize = parseInt(n);
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    res.json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to retrieve details of a specific product
app.get('/categories/:categoryName/products/:productId', async (req, res) => {
  const { categoryName, productId } = req.params;

  try {
    const authToken = await getAuthorizationToken();
    const companies = ['AMZ', 'FLP', 'SP', 'VN', 'AZO']; // List of registered companies
    let productDetails;

    for (const company of companies) {
      const companyProducts = await getTopProducts(company, categoryName, 10, 0, 100000, authToken);
      productDetails = companyProducts.find(product => product.productId === productId);
      if (productDetails) break;
    }

    if (productDetails) {
      res.json(productDetails);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Call the function to print the top products
printTopProducts();

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Register with the test server and get authorization token on startup
  try {
    await registerWithTestServer();
    console.log('Registered with test server');
  } catch (error) {
    console.error('Failed to register with test server:', error);
  }
});
