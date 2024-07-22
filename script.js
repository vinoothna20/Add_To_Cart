async function fetchData() {
  const response = await fetch("https://fakestoreapi.com/products");
  productsData = await response.json();

  display(productsData);
}

fetchData();

function display(tempData) {
  for (var i = 0; i < tempData.length; i++) {
    var prod = tempData[i];
    var productsDiv = document.getElementById("products_col");
    var colDiv = document.createElement("div");
    productsDiv.append(colDiv);
    colDiv.setAttribute("class", "row justify-content-center");

    colDiv.innerHTML = `<div class="card mb-3" style="max-width: 900px">
  <div class="row g-0">
    <div class="col-md-4 d-flex justify-content-center align-items-center pt-md-0 pt-3">
      <img src="${prod.image}" class="rounded-start" alt="..." width="230px" height="210px" />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${prod.title}</h5>
        <p class="card-text">
          ${prod.description}
        </p>
        <div class="card-text d-inline-flex align-items-center rating px-1">
          <span>${prod.rating.rate}&nbsp;</span>
          <span class="star">&#11088;</span>                 
        </div>
        <span class="count"> ${prod.rating.count}</span> 
        <p class="card-text mt-2 fs-5">&#36;${prod.price}</p>
        <p class="card-text">
        <a href="javascript:void(0);" id="${prod.id}" onClick="addToCart(this.id)" class="btn btn-warning" >Add to Cart</a>
        </p>
      </div>
    </div>
  </div>
</div>`;
  }
}

let flag = true;
function categoryList() {
  let categoryDiv = document.getElementById("categories");
  categoryDiv.style.display = "block";
  categoryDiv.style.top = "72px";
  categoryDiv.style.left = "353px";

  let productCategories = productsData.reduce((acc, item) => {
    if (!acc.includes(item.category)) acc.push(item.category);
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

  let searchedData = productsData.filter((item) => {
    if (item.title.toLowerCase().includes(inputValue)) return item;
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
      if (item.rating.rate >= checkbox.value) return item;
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

let prodCart;
let cartList = [];

function addToCart(clicked_id) {
  for (var i = 0; i < productsData.length; i++) {
    if (clicked_id == productsData[i].id) {
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
    for (var i of cartList) {
      let newDiv = document.createElement("div");
      cartItems.append(newDiv);
      newDiv.setAttribute("class", "row justify-content-center");
      newDiv.innerHTML = `<div class="card mb-3" style="max-width: 900px">
    <div class="row g-0">
      <div class="col-md-4 d-flex justify-content-center align-items-center pt-md-0 pt-3">
        <img src="${
          i.image
        }" class="rounded-start" alt="..." width="230px" height="210px" />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${i.title}</h5>
          <p class="card-text">
            ${i.category}
          </p>
          <p id="price${
            i.id
          }" class="priceView" class="card-text mt-1 fs-5">&#36;${
        i.price * qty[i.id]
      }</p>          
          <div class="card-text mb-3">
            <button id="qtyDec${
              i.id
            }" class="qtyBtn" onClick="qtyDec(this.id)">-</button>
            <p id="qty${i.id}" class="qtySpan d-inline">${qty[i.id]}</p>
            <button id="qtyInc${
              i.id
            }" class="qtyBtn" onClick="qtyInc(this.id)">+</button>               
          </div>
          <p class="card-text">
            <a href="#" id="${
              i.id
            }" onClick="removeProd(this.id)" class="btn btn-danger">Remove</a>
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
      let t = Number(tempPrice.slice(1)) + cartList[i].price;
      priceList[i].innerHTML = `&#36;${t.toFixed(2)}`;
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
        let t = Number(tempPrice.slice(1)) - cartList[i].price;
        priceList[i].innerHTML = `&#36;${t.toFixed(2)}`;
      }
    }
  }
}

function removeProd(clicked_id) {
  for (var j = 0; j < cartList.length; j++) {
    if (cartList[j].id == clicked_id) {
      cartList.splice(j, 1);
    }
  }
  document.getElementById("cart_col").innerHTML = "";
  viewCart();
  let clickedBtn = document.getElementById(clicked_id);
  clickedBtn.innerText = "Add to cart";
  // clickedBtn.style.pointerEvents = "auto";
  // clickedBtn.style.cursor = "pointer";
  clickedBtn.setAttribute("class", "btn btn-warning");
  clickedBtn.style = "";
  document.getElementById("itemsCount").innerHTML = `${cartList.length}`;
  let numClk = clicked_id.match(regExp);

  qty[numClk[0]] = 1;
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
