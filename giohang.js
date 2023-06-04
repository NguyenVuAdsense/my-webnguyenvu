var cartItems = [];

window.addEventListener('DOMContentLoaded', function() {
  loadCartItems();
  renderCartItems();
  updateTotalPrice();
  checkCartEmpty();
  updateCartQuantity(); // Thêm hàm này để cập nhật số lượng sản phẩm trong giỏ hàng trên logo
});

function loadCartItems() {
  var cartItemsData = localStorage.getItem('cartItems');
  if (cartItemsData) {
    cartItems = JSON.parse(cartItemsData);
  }
}

function saveCartItems() {
  var cartItemsData = JSON.stringify(cartItems);
  localStorage.setItem('cartItems', cartItemsData);
}

function checkCartEmpty() {
  var cartTable = document.getElementById('cart-table');
  var emptyCartMsg = document.getElementById('empty-cart-msg');

  if (cartItems.length === 0) {
    cartTable.style.display = 'none';
    emptyCartMsg.style.display = 'block';
  } else {
    cartTable.style.display = 'table';
    emptyCartMsg.style.display = 'none';
  }
}

function addToCart(productName, price, imageSrc) {
  var existingItem = cartItems.find(function(item) {
    return item.name === productName;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    var product = { name: productName, price: price, imageSrc: imageSrc, quantity: 1 };
    cartItems.push(product);
  }

  saveCartItems();
  renderCartItems();
  updateTotalPrice();
  checkCartEmpty();

}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  saveCartItems();
  renderCartItems();
  updateTotalPrice();
  checkCartEmpty();
  
}

function updateQuantity(index, quantity) {
  cartItems[index].quantity = quantity;
  saveCartItems();
  updateTotalPrice();
}

function renderCartItems() {
  var cartTableBody = document.getElementById('cart-items');
  cartTableBody.innerHTML = '';

  for (var i = 0; i < cartItems.length; i++) {
    var item = cartItems[i];

    var row = document.createElement('tr');

    var imageCell = document.createElement('td');
    var image = document.createElement('img');
    image.src = item.imageSrc;
    image.style.width = '100px';
    image.style.height = '100px';
    imageCell.appendChild(image);
    row.appendChild(imageCell);

    var nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    var quantityCell = document.createElement('td');
    var quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity;
    quantityInput.addEventListener('input', createQuantityInputHandler(i));
    quantityCell.appendChild(quantityInput);
    row.appendChild(quantityCell);

    var priceCell = document.createElement('td');
    priceCell.textContent = formatCurrency(item.price);
    row.appendChild(priceCell);

    var removeCell = document.createElement('td');
    var removeButton = document.createElement('button');
    removeButton.classList.add('remove-button');
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.addEventListener('click', createRemoveHandler(i));
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);

    cartTableBody.appendChild(row);
  }
}

function updateTotalPrice() {
  var totalPrice = 0;

  for (var i = 0; i < cartItems.length; i++) {
    var item = cartItems[i];
    var price = item.price * item.quantity;
    totalPrice += price;
  }

  var totalPriceElement = document.getElementById('total-price');
  totalPriceElement.textContent = formatCurrency(totalPrice);
}

function formatCurrency(value) {
  return value.toLocaleString() + '₫';
}

function updateCartQuantity() {
  var cartQuantityElement = document.getElementById('cart-quantity');
  var totalQuantity = getTotalQuantity();
  cartQuantityElement.textContent = totalQuantity;
}

function getTotalQuantity() {
  var totalQuantity = 0;

  for (var i = 0; i < cartItems.length; i++) {
    totalQuantity += cartItems[i].quantity;
  }

  return totalQuantity;
}

function createQuantityInputHandler(index) {
  return function() {
    var quantity = parseInt(this.value);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }
    updateQuantity(index, quantity);
  };
}

function createRemoveHandler(index) {
  return function() {
    removeFromCart(index);
  };
}


var plusButtons = document.getElementsByClassName('fa-plus');
for (var i = 0; i < plusButtons.length; i++) {
  (function(index) {
    plusButtons[index].addEventListener('click', function() {
      var productContainer = this.parentNode.parentNode;
      var productName = productContainer.getElementsByClassName('card-body')[0].querySelector('a').textContent;
      var priceText = productContainer.getElementsByClassName('card-price')[0].textContent;
      var price = parseFloat(priceText.replace(/[,.₫]/g, ''));
      var imageSrc = productContainer.querySelector('img').src;
      addToCart(productName, price, imageSrc);
    });
  })(i);
}

