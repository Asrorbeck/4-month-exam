var elWrapper = document.querySelector(".info__container");
var elWrapperInfo = document.querySelector(".info__container--active");
var elBookWrapper = document.querySelector(".hero__main");
var elNumberOfBooks = document.querySelector("#result-number");
var elForm = document.querySelector(".header__top-right");
var elSearchInput = document.querySelector(".header__search");
var elBookmarkBook = document.querySelector(".hero__btn-bookmark");
var elBookmarkedWrapper = document.querySelector(".hero__sidebar-list");
var elSorting = document.querySelector(".header__order");
var elBookmarkedItem = document.querySelector(".hero__sidebar-item");


var elInfoHeading = document.querySelector(".info__heading");
var elInfoImg = document.querySelector(".info-img");
var elInfoBody = document.querySelector(".info__main-text");
var elInfoAuthor = document.querySelector(".info__author");
var elInfoYear = document.querySelector(".info__year");
var elInfoPublisher = document.querySelector(".info__publisher");
var elInfoCategory = document.querySelector(".info__category");
var elInfoCount = document.querySelector(".info__count");
var elInfoRead = document.querySelector(".info__btn-read");


//buttons
var elBtn = document.querySelector(".hero__btn-read");
var elInfoBtn = document.querySelector(".hero__btn-info");
var elCloseBtn = document.querySelector(".info__btn-close");
var elDeleteBtn = document.querySelector(".hero__sidebar-remove");

//templates
var elBookTemplate = document.querySelector("#bookTemplate").content;
var elBookmarkedTemplate = document.querySelector("#bookmarkedList").content;
var elInfo = document.querySelector("#info-template").content;

let localStorageBooks = JSON.parse(localStorage.getItem("bookmarkedList"))

let bookmarkedList = localStorageBooks? localStorageBooks : [] 

elForm.addEventListener("submit", function (evt) {
    evt.preventDefault()
    
    let inputBook = elSearchInput.value.trim().toLowerCase()
    
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputBook}`)
    .then(response => response.json())
    .then(data => renderBook(data.items))
    
    elSorting.addEventListener("click", function () {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputBook}&orderBy=newest`)
        .then(response => response.json())
        .then(data => renderBook(data.items))
    })
    
    elBookWrapper.addEventListener("click", function (evt) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputBook}`)
        .then(response => response.json())
        .then(function (data) {
            let clickedInfo = evt.target.dataset.infoId
            
            
            if (clickedInfo) {
                elWrapper.classList = "info__container--active"
                let foundBook = data.items.find(function (item) {
                    return item.id == clickedInfo
                })
                
                elInfoHeading.textContent = foundBook.volumeInfo.title
                elInfoImg.src = foundBook.volumeInfo.smallThumbnail
                elInfoBody.textContent = foundBook.volumeInfo.description
                elInfoAuthor.textContent = foundBook.volumeInfo.authors
                elInfoYear.textContent = foundBook.volumeInfo.publishedDate
                elInfoPublisher.textContent = foundBook.volumeInfo.publisher
                elInfoCount.textContent = foundBook.volumeInfo.pageCount
                elInfoCategory.textContent = foundBook.volumeInfo.categories
                elInfoRead.href = foundBook.volumeInfo.previewLink
                elInfoRead.setAttribute("target", "blank")

            }

        })
    })
    
    elBookWrapper.addEventListener("click", function (evt) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputBook}`)
        .then(response => response.json())
        .then(function (data) {
            let clicked = evt.target.dataset.bookmarkId;
            if (clicked) {
                let foundBook = data.items.find(function (item) {
                    return item.id == clicked
                })
                console.log(foundBook);
                
                if (bookmarkedList.length == 0) {
                    bookmarkedList.unshift(foundBook)
                    localStorage.setItem("bookmarkedList", JSON.stringify(bookmarkedList)) 
                } else {
                    let check = false
                    for (const item of bookmarkedList) {
                        if (item.id == clicked) {
                            check = true
                        }
                    }
                    
                    if (!check) {
                        bookmarkedList.unshift(foundBook)
                        localStorage.setItem("bookmarkedList", JSON.stringify(bookmarkedList))
                    }
                }
                
                console.log(bookmarkedList);
                renderBookmarked(bookmarkedList, elBookmarkedWrapper)
            }
        })
    })
    
    elBookmarkedWrapper.addEventListener("click", function (evt) {
        let clickedId = evt.target.closest(".hero__sidebar-remove").dataset.removeId
        
        if (clickedId) {
            let indexBook = bookmarkedList.find(function(item) {
                return item.id == clickedId
            })
            
            bookmarkedList.splice(indexBook, 1)
            
            renderBookmarked(bookmarkedList, elBookmarkedWrapper)
            localStorage.setItem("bookmarkedList", JSON.stringify(bookmarkedList)) 
        }
    })
})

function renderBook(array) {
    elBookWrapper.innerHTML = null;
    elNumberOfBooks.textContent = array.length
    
    let bookFragment = document.createDocumentFragment()
    for (const item of array) {
        let newItem = elBookTemplate.cloneNode(true)
        
        newItem.querySelector(".hero__item-heading").textContent = item.volumeInfo.title
        newItem.querySelector(".hero__item-author").textContent = item.volumeInfo.authors
        newItem.querySelector(".hero__item-year").textContent = item.volumeInfo.publishedDate
        newItem.querySelector(".hero__item-img").src = item.volumeInfo.imageLinks.smallThumbnail
        newItem.querySelector(".hero__btn-bookmark").dataset.bookmarkId = item.id
        newItem.querySelector(".hero__btn-info").dataset.infoId = item.id
        newItem.querySelector(".hero__btn-read").href = item.volumeInfo.previewLink
        newItem.querySelector(".hero__btn-read").setAttribute("target", "blank")
        
        bookFragment.appendChild(newItem)
    }
    elBookWrapper.appendChild(bookFragment)
}

function renderBookmarked(array, wrapper) {
    wrapper.innerHTML = null;
    
    let newFragment = document.createDocumentFragment()
    
    for (const item of array) {
        let newItem = elBookmarkedTemplate.cloneNode(true)
        
        newItem.querySelector(".hero__sidebar-item-heading").textContent = item.volumeInfo.title
        newItem.querySelector(".hero__sidebar-item-author").textContent = item.volumeInfo.authors
        newItem.querySelector(".hero__sidebar-remove").dataset.removeId = item.id
        newItem.querySelector(".hero__sidebar-read").href = item.volumeInfo.previewLink
        newItem.querySelector(".hero__sidebar-read").setAttribute("target", "blank")
        
        
        newFragment.appendChild(newItem)
    }
    
    wrapper.appendChild(newFragment)
}

elCloseBtn.addEventListener("click", function () {
    elWrapper.classList = "info__container"
})