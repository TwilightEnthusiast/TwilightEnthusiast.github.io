// DATA
const products = [
{id:1, name:'Laptop Gaming', price:20000000, image:'https://placehold.co/300x200'},
{id:2, name:'Chuột Gaming', price:500000, image:'https://placehold.co/300x200'},
{id:3, name:'Bàn phím cơ', price:1500000, image:'https://placehold.co/300x200'},
{id:4, name:'Tai nghe', price:1200000, image:'https://placehold.co/300x200'}
];


let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let user = JSON.parse(localStorage.getItem('user') || 'null');


// RENDER PRODUCTS (only when #productList exists)
function renderProducts(){
	const productList = document.getElementById('productList');
	if(!productList) return;
	productList.innerHTML = '';
	products.forEach(p => {
		productList.innerHTML += `
		<div class="col-md-3 mb-4">
			<div class="card h-100">
				<img src="${p.image}" class="card-img-top">
				<div class="card-body">
					<h5 class="card-title">${p.name}</h5>
					<p>${p.price.toLocaleString()} đ</p>
					<button class="btn btn-primary" onclick="addToCart(${p.id})">Thêm vào giỏ</button>
				</div>
			</div>
		</div>`;
	});
}


// CART LOGIC
function saveCart(){
	localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id){
	const item = cart.find(i => i.id === id);
	if(item) item.qty++;
	else{
		const product = products.find(p => p.id === id);
		if(!product) return;
		cart.push({...product, qty:1});
	}
	saveCart();
	updateCart();
}


function updateCart(){
	const countEl = document.getElementById('cartCount');
	if(countEl) countEl.innerText = cart.reduce((s,i)=>s+i.qty,0);

	const cartItems = document.getElementById('cartItems');
	if(cartItems){
		cartItems.innerHTML = '';
		if(cart.length === 0) cartItems.innerHTML = '<p>Giỏ hàng trống</p>';
		cart.forEach(i => {
			cartItems.innerHTML += `<p>${i.name} - SL: ${i.qty}</p>`;
		});
	}

	renderCartPage();
}

// Render cart table on dedicated cart page
function renderCartPage(){
	const cartBody = document.getElementById('cart-body');
	const totalPriceEl = document.getElementById('total-price');
	if(!cartBody) return;
	cartBody.innerHTML = '';
	let total = 0;
	if(cart.length === 0){
		cartBody.innerHTML = `<tr><td colspan="5" class="text-center">Giỏ hàng trống</td></tr>`;
		if(totalPriceEl) totalPriceEl.innerText = '0đ';
		return;
	}
	cart.forEach(i => {
		const lineTotal = i.price * i.qty;
		total += lineTotal;
		cartBody.innerHTML += `
			<tr>
				<td>
					<div class="d-flex align-items-center">
						<img src="${i.image}" class="cart-img me-3">
						<div>
							<h6 class="mb-0 fw-bold">${i.name}</h6>
							<small class="text-muted">Mã: ${i.id}</small>
						</div>
					</div>
				</td>
				<td>${i.price.toLocaleString()}đ</td>
				<td>
					<input type="number" value="${i.qty}" min="1" class="form-control text-center" style="width: 70px;" onchange="changeQty(${i.id}, this.value)">
				</td>
				<td class="fw-bold text-primary">${lineTotal.toLocaleString()}đ</td>
				<td>
					<button class="btn btn-sm btn-outline-danger border-0" onclick="removeFromCart(${i.id})"><i class="fas fa-trash"></i></button>
				</td>
			</tr>`;
	});
	if(totalPriceEl) totalPriceEl.innerText = total.toLocaleString() + 'đ';
}

function changeQty(id, val){
	const qty = parseInt(val) || 1;
	const item = cart.find(i=>i.id===id);
	if(item) item.qty = qty;
	saveCart();
	updateCart();
}

function removeFromCart(id){
	cart = cart.filter(i=>i.id!==id);
	saveCart();
	updateCart();
}


function register(){
const email = document.getElementById('email').value;
const pass = document.getElementById('password').value;
const authMsg = document.getElementById('authMsg');
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


if(!regex.test(email)){
authMsg.innerText = 'Email không hợp lệ'; return;
}
if(pass.length < 8 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)){
authMsg.innerText = 'Mật khẩu chưa đủ mạnh,đề nghị đặt lại'; return;  
}
localStorage.setItem('user', JSON.stringify({email, pass}));
authMsg.innerText = 'Đăng ký thành công';
}


function login(){
const email = document.getElementById('email').value;
const pass = document.getElementById('password').value;
const authMsg = document.getElementById('authMsg');
const saved = JSON.parse(localStorage.getItem('user'));


if(saved && saved.email === email && saved.pass === pass){
user = saved;
document.getElementById('authBtn').innerText = 'Xin chào, ' + email;
authMsg.innerText = 'Đăng nhập thành công';
} else authMsg.innerText = 'Sai thông tin đăng nhập';
}


// Initialize page: render products and cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	renderProducts();
	updateCart();
	if(user && user.email){
		const authBtn = document.getElementById('authBtn');
		if(authBtn) authBtn.innerText = 'Xin chào, ' + user.email;
	}
});