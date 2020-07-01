
// credit to
//https://github.com/Jaydos/public-api-requests
//https://github.com/MBoone5/Public-Api-Requests

const searchHTML = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
</form>
`;

document.querySelector('.search-container').innerHTML = searchHTML;


// create cards html
function cards(allUsers) {
    var gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

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

// Displays model window when specific card is clicked.
document.querySelectorAll('.card').forEach(profile => {
    profile.addEventListener('click', (e) => {
        displayModal(parseInt(e.currentTarget.id), allUsers);
    })
})
}

// function for displaying a card's modal window
const displayModal = (profileIndex, data) => {
        var user = data[profileIndex];
        let modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
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

        // hides (prev/next) buttons depending if the selected card is the first/last
        addOrRemoveButtons(profileIndex, data.length, buttons);

        // Click listener for each button, displays either next or previous modal window.
        buttons.forEach(button => {
            button.addEventListener('click', e => {
                addOrRemoveButtons(profileIndex, data.length, buttons);

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
        filteredProfiles = [];
        // If a modal window exists, remove it.
        if(document.querySelector('.modal-container')){
            document.querySelector('body').removeChild('.modal-container');
        }
        console.log(searchInput);
        data.forEach(profile => {
            console.log(profile.name.first);
            if (profile.name.first.toLowerCase().includes(searchInput) || 
                    profile.name.last.toLowerCase().includes(searchInput)){
                filteredProfiles.push(profile);
            }
        })
        displayOrRemoveErrorMessage(filteredProfiles);
        console.log(filteredProfiles);
        cards(filteredProfiles);
}


// Function to hide or show 'Next' or 'Prev' buttons depending on displayed profile.
const addOrRemoveButtons = (displayedProfile, n_users, buttons) => {
    buttons[0].style.visibility = 'visible';
    buttons[1].style.visibility = 'visible';

    if(displayedProfile === 0 ){
        buttons[0].style.visibility = 'hidden';
    } 
    if (displayedProfile === n_users -1){
        buttons[1].style.visibility = 'hidden';
    } 
}

// Function to check if no search matches are found. Displays error message if so, removes error message (if it exists) if not.
const displayOrRemoveErrorMessage = results => {
        if(results.length === 0) {
            if(document.querySelector('.errorMessage') === null){
                let noResults = document.createElement('p');
                noResults.className = 'errorMessage';
                noResults.textContent = 'No results found. Try again.';
                document.querySelector('body').insertBefore(noResults, gallery);
            }      
        } else {
            if(document.querySelector('.errorMessage') !== null){
                document.querySelector('.errorMessage').style.display = 'none';
            }       
        }
}

// ------------------------------------ MAIN ------------------------------------------------
// getting random user data
fetch('https://randomuser.me/api/?results=12&inc=name,location,email,picture,cell,dob&nat=au&')
.then(data => data.json())
.then(data => {
    // Generate a profile card for each result.
    cards(data.results);
    
    // search to filter profiles.
    document.getElementById('search-input').addEventListener('keyup', e => {
        e.preventDefault();
        filterProfiles(e.target.value.toLowerCase(), data.results);
    })
})
.catch(error => console.log('Looks like there was a problem', error))

