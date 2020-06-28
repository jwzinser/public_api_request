// Custom JavaScript For Public API Requests Project
// Waiting for the document to be ready
// refrences for important dom elements    
// creating markup for search bar
/* even though there's no need for interpolation, a template literal is best used here
so the markup can be written without escape characters & maximize readability */


//https://github.com/Jaydos/public-api-requests
//https://github.com/MBoone5/Public-Api-Requests

const searchHTML = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
</form>
`;

// appending the search HTML
document.querySelector('.search-container').innerHTML = searchHTML;

// function to create a card for each random user from an array of user objects
function cards(allUsers) {
    // refrences for user information
    var gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    // iterating over each random user object
    allUsers.forEach((user, i) => {
        // creating the HTML for the user card
        gallery.innerHTML += `
        <div class='card' id="${i}">
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div> 
        `;
    });


// Add click listener to each profile card, display corresponding modal window for selected profile.
let profiles = document.querySelectorAll('.card');
profiles.forEach(profile => {
    profile.addEventListener('click', (e) => {
        console.log("tro");
        displayModal(parseInt(e.currentTarget.id), allUsers);
    })
})

} // close user card function
// function to create a modal for each random user from an array of user objects
// Function to create modal window for selected user.
const displayModal = (profileIndex, data) => {
var user = data[profileIndex];
let modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';
//modalContainer.style.backgroundColor = generateRandomColor();
modalContainer.innerHTML = 
    `<div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${user.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p>
            <hr>
            <p class="modal-text">${user.cell}</p>
            <p class="modal-text">${user.location.state}, ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${user.dob.date.substring(0,10)}</p>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>`

document.querySelector('body').appendChild(modalContainer);

// Remove modal window when 'X' button is clicked.
document.querySelector('.modal-close-btn').addEventListener('click', () => {
    document.querySelector('body').removeChild(document.querySelector('.modal-container'));
})

// Target 'Next' and 'Prev' buttons on modal window.
const buttons = document.querySelectorAll('.modal-btn-container button');

/*
    Hide or display buttons depending on index of profile. 
    Eg. If first profile is selected, 'Prev' button is hidden.
    If last profile is selected, 'Next' button is hidden.
    If only one profile is displayed, no buttons are visible.
*/
addOrRemoveButtons(profileIndex, data, buttons);

// Click listener for each button, displays either next or previous modal window.
buttons.forEach(button => {
    button.addEventListener('click', e => {
        addOrRemoveButtons(profileIndex, data, buttons);

        document.querySelector('body').removeChild(modalContainer);
        if(e.target.textContent === 'Next'){
            displayModal(profileIndex + 1, data);
        } else if (e.target.textContent === 'Prev'){
            displayModal(profileIndex - 1, data);
        }
    })
})
}

// Function to filter profiles depending on search bar value.
const filterProfiles = (searchInput, data) => {
// Empty existing filtered array.
filteredProfiles = [];

// If a modal window exists, remove it.
if(document.querySelector('.modal-container')){
    document.querySelector('body').removeChild('.modal-container');
}
console.log(searchInput);
// Filtering process, pushes matching profiles to filteredProfiles array.
data.forEach(profile => {
    console.log(profile.name.first);
    if (profile.name.first.toLowerCase().includes(searchInput) || profile.name.last.toLowerCase().includes(searchInput)){
        filteredProfiles.push(profile);
    }
})

// Display or remove error message as required.
displayOrRemoveErrorMessage(filteredProfiles);

// Generate new profile cards using filteredProfiles array of objects.
console.log(filteredProfiles);
cards(filteredProfiles);
}

// Function to hide or show 'Next' or 'Prev' buttons depending on displayed profile.
const addOrRemoveButtons = (displayedProfile, data, buttons) => {
if(displayedProfile === 0 && data.length === 1){
    buttons[0].style.visibility = 'hidden';
    buttons[1].style.visibility = 'hidden';
} else if (displayedProfile === 0){
    buttons[0].style.visibility = 'hidden';
    buttons[1].style.visibility = 'visible';
} else if (displayedProfile === data.length -1){
    buttons[0].style.visibility = 'visible';
    buttons[1].style.visibility = 'hidden';
}
}

// Function to check if no search matches are found. Displays error message if so, removes error message (if it exists) if not.
const displayOrRemoveErrorMessage = results => {
if(results.length === 0) {
    if(document.querySelector('.errorMessage') === null){
        let noResultsFound = document.createElement('p');
        noResultsFound.className = 'errorMessage';
        noResultsFound.textContent = 'No results found. Try again.';
        document.querySelector('body').insertBefore(noResultsFound, gallery);
    }      
} else {
    if(document.querySelector('.errorMessage') !== null){
        document.querySelector('.errorMessage').style.display = 'none';
    }       
}
}

// Generate a random color to use as background color on modal windows.
const generateRandomColor = () => {
let numbers = [];

while(numbers.length < 3){
    numbers.push(Math.floor(Math.random() * (255 - 0 + 1) + 0));
}

let newColor = `rgba(${numbers[0]},${numbers[1]},${numbers[2]},0.5)`;
return newColor;
}


// =========================== API REQUEST =========================================================
// getting random user data
fetch('https://randomuser.me/api/?results=12&inc=name,location,email,picture,cell,dob&nat=au&')
.then(data => data.json())
.then(data => {
    // Generate a profile card for each result.
    cards(data.results);
    
    // Submit event listener on form to filter profiles.
    document.getElementById('search-input').addEventListener('keyup', e => {
        e.preventDefault();
        filterProfiles(e.target.value.toLowerCase(), data.results);
    })
})
.catch(error => console.log('Looks like there was a problem', error))

