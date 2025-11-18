let productsData = []; // Global variable to store fetched products data

async function fetchData() {
  const productsDiv = document.getElementById("products_col");

  // Primary and Backup API URLs
  const PRIMARY_API_URL = "https://fakestoreapi.com/products";
  // Switching to FakeShopAPI (a reliable alternative) as the backup
  const BACKUP_API_URL = "http://fake-shop-api.ap-south-1.elasticbeanstalk.com/app/v1/products"; // <--- NEW BACKUP URL

  // Add loading spinner to products_col
  productsDiv.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="height: 500px;">
            <div class="spinner-border text-light" role="status"></div>
            <span class="ms-2 text-light">Loading...</span>
        </div>`;

  try {
    // --- 1. Try Primary API (Fake Store API) ---
    let response = await fetch(PRIMARY_API_URL);

    // Throw an error for 5xx/4xx status codes
    if (!response.ok) {
      console.warn(`Primary API failed with status: ${response.status}. Attempting backup.`);
      throw new Error(`Primary API failed: ${response.status}`);
    }

    productsData = await response.json();

    console.log("Successfully loaded data from Primary API (Fake Store API).");

  } catch (primaryError) {
    // --- 2. If Primary API Fails, Try Backup API (FakeShopAPI) ---
    console.error("Primary API fetch failed. Trying backup...", primaryError);

    try {
      let backupResponse = await fetch(BACKUP_API_URL);

      if (!backupResponse.ok) {
        throw new Error(`Backup API also failed: ${backupResponse.status}`);
      }

      let responseJson = await backupResponse.json();

      // *** CRUCIAL DATA EXTRACTION for New API: ***
      // New API wraps the product array inside a 'Data' property
      if (responseJson.Data && Array.isArray(responseJson.Data)) {
        productsData = responseJson.Data;
      } else {
        // Fallback to assume it's a direct array (or handle other unexpected structure)
        productsData = responseJson;
      }

      console.log("Successfully loaded data from Backup API (FakeShopAPI).");

    } catch (backupError) {
      // --- 3. If Both Fail, Display Final Error ---
      console.error("Both APIs failed to fetch data:", backupError);
      productsDiv.innerHTML = `<p class="text-danger text-center">
Failed to load products from both primary and backup sources. Please try again later.
 </p>`;
      return; // Stop execution if both fail
    }
  }

  // Display the fetched data (from whichever API succeeded)
  display(productsData);
}

// Call fetchData to load products on page load
// fetchData();

function display(tempData) {
  const productsDiv = document.getElementById("products_col");

  // Clear the loading spinner or any previous content
  productsDiv.innerHTML = "";

  for (var i = 0; i < tempData.length; i++) {
    var prod = tempData[i];
    // var productsDiv = document.getElementById("products_col");

    // --- Start: Normalization for API Differences ---
    let normalizedProd = {};

    // 1. ID: Fake Store uses 'id', New API uses '_id'
    normalizedProd.id = prod.id || prod._id;

    // 2. Title: Fake Store uses 'title', New API uses 'name'
    normalizedProd.title = prod.title || prod.name;

    // 3. Price: Use 'price'
    normalizedProd.price = prod.price;

    // 4. Description: Use 'description'
    normalizedProd.description = prod.description;

    // 5. Image URL: Fake Store uses 'image', New API uses an 'images' array
    normalizedProd.image = prod.image || (prod.images && prod.images.length > 0 ? prod.images[0] : null);

    // 6. Rating: Fake Store uses { rating: { rate, count } }, New API uses 'product_rating' (just the rate)
    if (prod.rating && typeof prod.rating.rate === 'number') {
      // Fake Store API format
      normalizedProd.rate = prod.rating.rate;
      normalizedProd.count = prod.rating.count || 0;
    } else if (typeof prod.product_rating === 'number') {
      // New Fake Shop API format 
      normalizedProd.rate = prod.product_rating;
      normalizedProd.count = 'N/A'; // New API does not provide a separate count field
    } else {
      // Fallback for missing rating data
      normalizedProd.rate = 'N/A';
      normalizedProd.count = 'N/A';
    }
    // --- End: Normalization ---

    var colDiv = document.createElement("div");
    productsDiv.append(colDiv);
    colDiv.setAttribute("class", "row justify-content-center");

    colDiv.innerHTML = `<div class="card mb-3" style="max-width: 900px">
  <div class="row g-0">
    <div class="col-md-4 d-flex justify-content-center align-items-center pt-md-0 pt-3">
      <img src="${normalizedProd.image}" class="rounded-start" alt="..." width="230px" height="210px" />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${normalizedProd.title}</h5>
        <p class="card-text">
          ${normalizedProd.description}
        </p>
        <div class="card-text d-inline-flex align-items-center rating px-1">
          <span>${normalizedProd.rate}&nbsp;</span>
          <span class="star">&#11088;</span>                 
        </div>
        <span class="count"> ${normalizedProd.count}</span> 
        <p class="card-text mt-2 fs-5">&#36;${normalizedProd.price}</p>
        <p class="card-text">
        <a href="javascript:void(0);" id="${normalizedProd.id}" onClick="addToCart(this.id)" class="btn btn-warning" >Add to Cart</a>
        </p>
      </div>
    </div>
  </div>
</div>`;
  }
}

// Call fetchData to load products on page load
fetchData();


let flag = true;
function categoryList() {
  let categoryDiv = document.getElementById("categories");
  categoryDiv.style.display = "block";
  categoryDiv.style.top = "72px";
  categoryDiv.style.left = "353px";

  let productCategories = productsData.reduce((acc, item) => {
    let categoryValue;

    if (Array.isArray(item.category) && item.category.length > 0) {
      // New API structure: uses the first element of the array
      categoryValue = item.category[0];
    } else if (typeof item.category === 'string') {
      // Fake Store structure: is a string
      categoryValue = item.category;
    }

    if (categoryValue && !acc.includes(categoryValue)) acc.push(categoryValue);
    return acc;
  }, []);

  if (flag == true) {
    for (var i = 0; i < productCategories.length; i++) {
      let listItem = document.createElement("li");
      document.getElementById("ctgry").append(listItem);
      listItem.setAttribute("class", "list-group-item");
      listItem.innerHTML = `${productCategories[i]}`;
    }
    flag = false;
  }
}

function hideCategoryList() {
  document.getElementById("categories").style.display = "none";
}

function displayCategoryList() {
  document.getElementById("categories").style.display = "block";
}

function searchProducts() {
  let inputValue = document.getElementById("search_input").value.toLowerCase();

  // Use normalized title/name for search
  let searchedData = productsData.filter((item) => {
    let title = item.title || item.name;
    if (title && title.toLowerCase().includes(inputValue)) return item;
  });

  document.getElementById("products_col").innerHTML = "";
  display(searchedData);
}

function applyFilters() {
  let filteredPriceData;
  let filteredRatingData;

  document.querySelectorAll(".price-checkbox:checked").forEach((checkbox) => {
    let priceRange = checkbox.value.split("-");
    filteredPriceData = productsData.filter((item) => {
      if (item.price >= priceRange[0] && item.price <= priceRange[1])
        return item;
    });
  });

  document.querySelectorAll(".rating-checkbox:checked").forEach((checkbox) => {
    filteredRatingData = productsData.filter((item) => {
      // Use normalized rate property
      let rateValue = (item.rating && item.rating.rate) ? item.rating.rate : item.product_rating;

      if (rateValue && rateValue >= checkbox.value) return item;
    });
  });

  let filteredData;

  if (filteredPriceData != undefined) {
    filteredData = filteredPriceData
      .concat(filteredRatingData)
      .reduce((acc, item) => {
        if (!acc.includes(item)) acc.push(item);
        return acc;
      }, []);
  } else {
    filteredData = filteredRatingData
      .concat(filteredPriceData)
      .reduce((acc, item) => {
        if (!acc.includes(item)) acc.push(item);
        return acc;
      }, []);
  }

  document.getElementById("products_col").innerHTML = "";
  display(filteredData);
}

function clearFilters() {
  document.getElementById("products_col").innerHTML = "";

  document.querySelectorAll(".price-checkbox:checked").forEach((checkbox) => {
    checkbox.click();
  });

  document.querySelectorAll(".rating-checkbox:checked").forEach((checkbox) => {
    checkbox.click();
  });

  display(productsData);
}

// --- CART FUNCTIONS ---

let prodCart;
let cartList = [];

function addToCart(clicked_id) {
  for (var i = 0; i < productsData.length; i++) {
    // Use normalized ID check
    let currentId = productsData[i].id || productsData[i]._id;

    if (clicked_id == currentId) {
      prodCart = productsData[i];
      clickedBtn = document.getElementById(clicked_id);
      clickedBtn.innerText = "Added to cart";
      clickedBtn.style.backgroundColor = "gray";
      clickedBtn.style.borderColor = "gray";
      clickedBtn.style.cursor = "default";
      clickedBtn.style.pointerEvents = "none";
      cartList.push(prodCart);
    }
  }

  document.getElementById("itemsCount").innerHTML = `${cartList.length}`;
}

let qty = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  11: 1,
  12: 1,
  13: 1,
  14: 1,
  15: 1,
  16: 1,
  17: 1,
  18: 1,
  19: 1,
  20: 1,
};

function viewCart() {
  document.getElementById("products_sec").style.display = "none";
  document.getElementById("cart_sec").style.display = "flex";
  let cartItems = document.getElementById("cart_col");
  if (cartList.length == 0) {
    cartItems.innerHTML = `
    <div class="text-white fs-3 text-center mt-4">Your cart is empty.</div>`;
    document.getElementById("payment_col").style.display = "none";
  } else {
    document.getElementById("payment_col").style.display = "block";
    cartItems.innerHTML = ""; // Clear cart items before rendering

    for (var i of cartList) {
      // Normalize cart item properties here, similar to display
      let itemId = i.id || i._id;
      let itemTitle = i.title || i.name;
      let itemImage = i.image || (i.images && i.images.length > 0 ? i.images[0] : '');
      let itemCategory = Array.isArray(i.category) ? i.category[0] : i.category;

      let newDiv = document.createElement("div");
      cartItems.append(newDiv);
      newDiv.setAttribute("class", "row justify-content-center");

      newDiv.innerHTML = `<div class="card mb-3" style="max-width: 900px">
    <div class="row g-0">
      <div class="col-md-4 d-flex justify-content-center align-items-center pt-md-0 pt-3">
        <img src="${itemImage}" class="rounded-start" alt="..." width="230px" height="210px" />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${itemTitle}</h5>
          <p class="card-text">
            ${itemCategory}
          </p>
          <p id="price${itemId}" class="priceView" class="card-text mt-1 fs-5">&#36;${i.price * qty[itemId]
        }</p>          
          <div class="card-text mb-3">
            <button id="qtyDec${itemId}" class="qtyBtn" onClick="qtyDec(this.id)">-</button>
            <p id="qty${itemId}" class="qtySpan d-inline">${qty[itemId]}</p>
            <button id="qtyInc${itemId}" class="qtyBtn" onClick="qtyInc(this.id)">+</button>               
          </div>
          <p class="card-text">
            <a href="#" id="${itemId}" onClick="removeProd(this.id)" class="btn btn-danger">Remove</a>
          </p>
        </div>
      </div>
    </div>
  </div>
    `;
    }
  }
  document.getElementById("cartIcon").style.pointerEvents = "none";
}

let qtyList = document.getElementsByClassName("qtySpan");
let priceList = document.getElementsByClassName("priceView");
let regExp = /(\d+)/;

function qtyInc(clicked_id) {
  for (var i = 0; i < qtyList.length; i++) {
    let numQty = qtyList[i].id.match(regExp);
    let numClk = clicked_id.match(regExp);

    if (numQty[0] == numClk[0]) {
      var temp = qtyList[i].textContent;
      var res = Number(temp) + 1;
      qty[numClk[0]] += 1;
      qtyList[i].innerHTML = `${res}`;

      var tempPrice = priceList[i].textContent;

      // Find the item in cartList using normalized ID
      let cartItem = cartList.find(item => (item.id || item._id) == numClk[0]);

      if (cartItem) {
        let t = Number(tempPrice.slice(1)) + cartItem.price;
        priceList[i].innerHTML = `&#36;${t.toFixed(2)}`;
      }
    }
  }
}

function qtyDec(clicked_id) {
  for (var i = 0; i < qtyList.length; i++) {
    let numQty = qtyList[i].id.match(regExp);
    let numClk = clicked_id.match(regExp);

    if (numQty[0] == numClk[0]) {
      if (qtyList[i].textContent > 1) {
        var temp = qtyList[i].textContent;
        var res = Number(temp) - 1;
        qty[numClk[0]] -= 1;
        qtyList[i].innerHTML = `${res}`;

        var tempPrice = priceList[i].textContent;

        // Find the item in cartList using normalized ID
        let cartItem = cartList.find(item => (item.id || item._id) == numClk[0]);

        if (cartItem) {
          let t = Number(tempPrice.slice(1)) - cartItem.price;
          priceList[i].innerHTML = `&#36;${t.toFixed(2)}`;
        }
      }
    }
  }
}

function removeProd(clicked_id) {
  for (var j = 0; j < cartList.length; j++) {
    let currentId = cartList[j].id || cartList[j]._id;
    if (currentId == clicked_id) {
      cartList.splice(j, 1);
      break; // Exit loop once removed
    }
  }

  document.getElementById("cart_col").innerHTML = "";

  // Re-render the cart view
  viewCart();

  // Reset the "Add to Cart" button on the product page
  let clickedBtn = document.getElementById(clicked_id);

  if (clickedBtn) {
    clickedBtn.innerText = "Add to cart";
    clickedBtn.setAttribute("class", "btn btn-warning");
    clickedBtn.style = "";
    clickedBtn.style.pointerEvents = "auto";
    clickedBtn.style.cursor = "pointer";
  }

  document.getElementById("itemsCount").innerHTML = `${cartList.length}`;
  let numClk = clicked_id.match(regExp);

  if (numClk) {
    qty[numClk[0]] = 1;
  }
}

function viewHome() {
  document.getElementById("cart_sec").style.display = "none";
  document.getElementById("products_sec").style.display = "flex";
  document.getElementById("cartIcon").style.pointerEvents = "auto";
  if (document.getElementById("cart_col").innerHTML !== "")
    document.getElementById("cart_col").innerHTML = "";
  // document.getElementById("cart_sec").innerHTML = "";
}

document.getElementById("itemsCount").innerHTML = `${cartList.length}`;
