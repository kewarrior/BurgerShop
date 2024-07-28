const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput =document.getElementById("address")
const addressWarn =document.getElementById("address-warn")

let cart=[];


// Abrir o modal do Carrinho

cartBtn.addEventListener("click", function (){
    uptadeCartModal();
    cartModal.style.display = "flex";

})

//Fechar o modal do Carrinho

cartModal.addEventListener("click",function (event){
    if (event.target ===cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click",function (){
    cartModal.style.display="none"
})

//Detecao do botao para adicionar no carrinho

menu.addEventListener("click",function (event){

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)
    }
})



// Funcao para adicionar no Carrinho

function addToCart(name, price){

    const existingItem=cart.find(item => item.name === name)

    if (existingItem){
        // se o item existir aumenta a quantidade
        existingItem.quantity += 1;

    }else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    uptadeCartModal()

}

// atualizar carrinho

function uptadeCartModal(){
    cartItemsContainer.innerHTML ="";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement= document.createElement("div");
        cartItemElement.classList.add("flex","justify-between","mb-04", "flex-col")


        cartItemElement.innerHTML=`
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p class="font-medium mt-02"> $ ${item.price.toFixed(2)}</p>
                <p>Quant:${item.quantity}</p>
            </div>
              
            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
                </button>
            </div>                
        </div>
        `

        total+= item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-Pt",{
        style:"currency",
        "currency": "EUR"
    });

    cartCounter.innerHTML = cart.length;
}

//Funcao para remover do Carrinho

cartItemsContainer.addEventListener("click",function (event){
    if (event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name ===name);
    if (index !== -1){
        const item =cart[index];
        if (item.quantity > 1){
            item.quantity -= 1;
            uptadeCartModal()
            return;
        }
        cart.splice(index,1)
        uptadeCartModal();
    }
}

addressInput.addEventListener("input",function (event){
    let inputValue = event.target.value;

    if (inputValue!==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
    //
})


//Finalizar Pedido


checkoutBtn.addEventListener("click",function (){

    const isOpen= checkRestaurantOpen();

    if (!isOpen){
        Toastify({
            text: "Restaurante esta Fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
    }
    return;

    if (cart.length===0) return;
    if (addressInput.value ===""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    //Enviar pedido para api Whats

    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preco: $ ${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "931921722"

    window.open(`https://wa.me/${phone}?text=${message} Endereco: ${addressInput.value}` , "_blank")


    cart = [];
    uptadeCartModal();
})


//verificar a hora e manipular o card Horario

function checkRestaurantOpen(){
    const data= new Date();
    const hora =data.getHours();
    return hora >=12 && 22;
    //true = Restaurante Open
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}






