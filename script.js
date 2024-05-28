async function fetchData() {
  const response = await fetch("https://fakestoreapi.com/products");
  tempData = await response.json();

  for (var i = 0; i < tempData.length; i++) {
    var prod = tempData[i];
    var productsSection = document.getElementById("products_sec");
    var colDiv = document.createElement("div");
    productsSection.append(colDiv);
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
            <span class="star">&#11088</span>                 
          </div>
          <span class="count"> ${prod.rating.count}</span> 
          <p class="card-text mt-2 fs-5">&#36;${prod.price}</p>
          <p class="card-text">
          <a href="#" id="${prod.id}" onClick="addToCart(this.id)" class="btn btn-warning" >Add to Cart</a>
          </p>
        </div>
      </div>
    </div>
  </div>`;
  }
}

fetchData();

let prodCart;
let cartList = [];

function addToCart(clicked_id) {
  for (var i = 0; i < tempData.length; i++) {
    if (clicked_id == tempData[i].id) {
      prodCart = tempData[i];
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
  let cartSec = document.getElementById("cart_sec");
  cartSec.innerHTML = "";
  cartSec.style.display = "block";
  if (cartList.length == 0) {
    document.getElementById("cart_sec").innerHTML = `
    <div class="text-white fs-3 text-center mt-4">Your cart is empty.</div>`;
  } else {
    for (var i of cartList) {
      let newDiv = document.createElement("div");
      cartSec.append(newDiv);
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
          <p class="card-text mt-1 fs-5">&#36;${i.price}</p>          
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
}

function qtyInc(clicked_id) {
  let qtyList = document.getElementsByClassName("qtySpan");
  for (var i = 0; i < qtyList.length; i++) {
    if (qtyList[i].id.slice(-1) == clicked_id.slice(-1)) {
      var temp = qtyList[i].textContent;
      var res = Number(temp) + 1;
      qty[clicked_id.slice(-1)] += 1;
      qtyList[i].innerHTML = `${res}`;
    }
  }
}

function qtyDec(clicked_id) {
  let qtyList = document.getElementsByClassName("qtySpan");
  for (var i = 0; i < qtyList.length; i++) {
    if (qtyList[i].id.slice(-1) == clicked_id.slice(-1)) {
      if (qtyList[i].textContent > 1) {
        var temp = qtyList[i].textContent;
        var res = Number(temp) - 1;
        qty[clicked_id.slice(-1)] -= 1;
        qtyList[i].innerHTML = `${res}`;
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
  document.getElementById("cart_sec").innerHTML = "";
  viewCart();
  let clickedBtn = document.getElementById(clicked_id);
  clickedBtn.innerText = "Add to cart";
  // clickedBtn.style.pointerEvents = "auto";
  // clickedBtn.style.cursor = "pointer";
  clickedBtn.setAttribute("class", "btn btn-warning");
  clickedBtn.style = "";
  document.getElementById("itemsCount").innerHTML = `${cartList.length}`;
}

function viewHome() {
  document.getElementById("cart_sec").style.display = "none";
  document.getElementById("products_sec").style.display = "block";
}

document.getElementById("itemsCount").innerHTML = `${cartList.length}`;
