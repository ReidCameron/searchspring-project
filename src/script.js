//global variables
let query;
let page = 1;
let total = 1;
let resultsPerPage = 24;
let sortBy;
let cartTotal = 0;
let getPageTotal = () =>{return total}
//init first search
search();
//init nav links
document.querySelectorAll(".nav-link").forEach( (btn,i) => {
    btn.addEventListener("click", (ev)=>{
        document.querySelector("#search-input").value = ev.target.value;
        page = 1;
        search()
    })
})
//init search button with event listener
document.querySelector("#search-button").addEventListener("click", ()=>search())
document.querySelector("#search-input")
    .addEventListener('keydown', (event)=>{
        if(event.key == 'Enter'){
            search()
        }
    })
//init prev and next buttons
document.querySelectorAll(".next-btn").forEach( (btn) => {
    btn.addEventListener("click", ()=>{
        page = Math.min(getPageTotal(), page + 1)
        search()
    })
})
document.querySelectorAll(".prev-btn").forEach( (btn) => {
    btn.addEventListener("click", ()=>{
        page = Math.max(1, page - 1)
        search()
    })
})

//sort form
document.getElementById("sort-form").addEventListener("change", (ev)=>{
    resultsPerPage = +ev.target.value;
    page = 1;
    search();
})
document.getElementById("sort-dropdown").addEventListener("change", (ev)=>{
    page = 1;
    try{
        sortBy = JSON.parse(ev.target.value);
    } catch{
        sortBy = undefined;
    }
    search();
})
// Promo button
document.getElementById("promo-button").addEventListener("click", (ev)=>{
    document.querySelector("#search-input").value = ev.target.value;
    page = 1;
    search()
})

async function search() {
    //Reference user query
    query = document.querySelector("#search-input").value
    // if(query === "") return; //do nothing if query is empty, else call api

    //Call Searchpring API with specified params
    let params = {"q" : query};
    if(resultsPerPage) params["resultsPerPage"] = resultsPerPage;
    if(page) params["page"] = page;
    if(sortBy) params = {...params,...sortBy};
    let data = await callAPISearch(params)

    //Create Product View for each returned product
    createProductsHtml(data.results);

    //add event listeners to buttons
    document.querySelectorAll(".add-to-cart-btn").forEach( (btn,i) => {
        btn.addEventListener("click", ()=>{
            cartTotal+=1;
            document.getElementById("cart-total").innerHTML = cartTotal;
        })
    })

    //format pagination
    updatePagination(data.pagination);
    
    //update results description labels
    document.getElementById("search-term").innerHTML = (query==="")? "all products":`"${query}"`;
    let num = data.pagination.begin
    let num2 = data.pagination.end
    document.getElementById("visible-results").innerHTML = `${num} - ${num2}`;
    document.getElementById("total-results").innerHTML = data.pagination.totalResults;
}

async function callAPISearch(params){
    //call api and return product data only
    let result = await $.ajax({
        url: `http://localhost:3000/query`,
        type: 'GET',
        data: params,
    })
    return result;
}

function updatePagination(pagination){
    let current = pagination.currentPage;
    total = pagination.totalPages;

    //setup HTML
    let pagination_div = document.getElementById("page-labels1");
    let pagination_div2 = document.getElementById("page-labels2");
    pagination_div.innerHTML = ""; //clear last results;
    pagination_div2.innerHTML = "";
    let insertHTML = ""

    //add label
    //first
    let currentPage = (1 == current)? "currentPage":"";
    insertHTML += `<button class="page-bts ${currentPage}">1</button>\n`
    //first dots
    if(current >= 5){
        insertHTML += `<label class="page-label">…</label>\n`
    }
    //middle
    for(i = Math.max(current - 2,2); i <= Math.min(current + 2,total-1);i++){
        let currentPage = (i == current)? "currentPage":"";
        insertHTML += `<button class="page-bts ${currentPage}">${i}</button>\n`
    }
    //last dots
    if(total - current >= 4 ){
        insertHTML += `<label class="page-label">…</label>\n`
    }
    //last
    currentPage = (total == current)? "currentPage":"";
    insertHTML += `<button class="page-bts ${currentPage}">${total}</button>\n`
    
    //insert html
    pagination_div.innerHTML = insertHTML;
    pagination_div2.innerHTML = insertHTML;

    //add event listeners to buttons
    document.querySelectorAll(".page-bts").forEach( (btn,i) => {
        btn.addEventListener("click", ()=>{
            page = +btn.textContent;
            search()
        })
    })
    //show or hide buttons depending on page
    document.getElementById("prev-btn1").style.display = (current == 1)? "none":"block";
    document.getElementById("next-btn1").style.display = (current == total)? "none":"block";
    document.getElementById("prev-btn2").style.display = (current == 1)? "none":"block";
    document.getElementById("next-btn2").style.display = (current == total)? "none":"block";
}

function createProductsHtml(data = []){
    //Reference results grid
    let results = document.querySelector("#results");
    results.innerHTML = ""; //clear old data

    //loop over product data, create html, and add to results grid
    data.forEach( (v,i) => {

        //create wrapping div
        let product_div = document.createElement("div");
        product_div.classList.add("prod-container");
        product_div.id = `prod-${i}`;

        //show msrp label if data exists and change price color
        let msrpHTML = "";
        let lowerdPrice = ""
        if(v.msrp && v.msrp > v.price){
            msrpHTML = `<label class="product-msrp crossed">$${(+v.msrp)}</label>`
            lowerdPrice = "lowerdPrice"
        }

        //set final html
        product_div.innerHTML = 
            `<div class="prod-inner">
                <img alt="${v.title[0]} Product Image"src="${v.imageUrl}" width = "100%">
                <div class="product-info">
                    <label class="product-name">${v.name}</label>
                    <div class="price-labels">
                        ${msrpHTML}
                        <label class="product-price ${lowerdPrice}" >$${(+v.price)}</label>
                    </div>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>`

        //append div
        results.appendChild(product_div);
    })
}
