import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-fd0f4-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const endorsementsListInDB = ref(database, "endorsementsList");
const publishButton = document.querySelector('.publish-button');
let endorsementText = document.querySelector('.endorsement-text');
let fromFieldText = document.querySelector('.from-textfield');
let toFieldText = document.querySelector('.to-textfield');
const endorsementsContainer = document.querySelector('.endorsements-container');

publishButton.addEventListener('click', function () { 

    console.log('Button is clicked');
    
    const endorsementObj = {

        text: endorsementText.value,
        from: fromFieldText.value,
        to: toFieldText.value,
        likes: 0

    }

    push(endorsementsListInDB, endorsementObj);

    clearTextFields();


});

function clearTextFields() {
    
    endorsementText.value = '';
    fromFieldText.value = '';
    toFieldText.value = '';

}


onValue(endorsementsListInDB, function (snapshot) {
   
    if (snapshot.exists()) {
    
        clearEndorsementsContainer()
        
        let endorsementValues = snapshot.val();
        console.log(endorsementValues);

        Object.keys(endorsementValues).forEach(key => { 

            let currentItem = endorsementValues[key];
            console.log(currentItem);
            let currentItemID = key;
            console.log(currentItemID);
            let currentItemTo = currentItem.to;
            console.log(currentItemTo);
            let currentItemText = currentItem.text;
            console.log(currentItemText);
            let currentItemFrom = currentItem.from;
            console.log(currentItemFrom);
            let currentItemLikes = currentItem.likes;
            console.log(currentItemLikes);

            appendItemToShoppingListEl(currentItemID, currentItem);


        });
    
       

    } else {
        

        endorsementsContainer.innerHTML = 'No endorsements here... yet. Go on - be nice!';


    }

});

function clearEndorsementsContainer() {
    
    endorsementsContainer.innerHTML = '';

}


function appendItemToShoppingListEl(itemID, item) {

    let newEl = document.createElement('div');

    newEl.classList.add('endorsements-display');

    let itemToPara = document.createElement('p');

    itemToPara.textContent = 'To ' + item.to;

    newEl.appendChild(itemToPara);

    let itemEndorsementPara = document.createElement('p');

    itemEndorsementPara.textContent = item.text;

    newEl.appendChild(itemEndorsementPara);

    let itemFromPara = document.createElement('p');

    itemFromPara.textContent = 'From ' + item.from;

    itemFromPara.classList.add('item-from-paragraph');

    let likeCount = document.createElement('span');

    likeCount.textContent = item.likes || 0;

    likeCount.classList.add('like-count');

    let heartIcon = document.createElement('i');

    heartIcon.classList.add('fa-solid', 'fa-heart');

    let likesContainer = document.createElement('span');

    likesContainer.appendChild(likeCount);

    likesContainer.insertBefore(heartIcon, likeCount);

    itemFromPara.appendChild(likesContainer);

    newEl.appendChild(itemFromPara);

    heartIcon.addEventListener('click', function (event) { 

        event.stopPropagation();
        
        event.preventDefault();
        
        item.likes = (item.likes || 0) + 1;

        likeCount.textContent = item.likes;

        const updates = {};

        updates[`endorsementsList/${itemID}/likes`] = item.likes;

        update(ref(database), updates);


    });

       
    newEl.addEventListener('click', function () { 

        let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemID}`);
        remove(exactLocationOfItemInDB);

    });

    endorsementsContainer.append(newEl);

}


