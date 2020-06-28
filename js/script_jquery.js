// Custom JavaScript For Public API Requests Project
// Waiting for the document to be ready
$(document).ready(() => {
    // refrences for important dom elements
    const $galleryDiv = $('#gallery');
    const $modalDiv = $('#modal-div');
    
    // creating markup for search bar
    /* even though there's no need for interpolation, a template literal is best used here
    so the markup can be written without escape characters & maximize readability */
    const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
    `;

    // appending the search HTML
    $('.search-container').append(searchHTML);

    // function to create a card for each random user from an array of user objects
    function cards(allUsers) {
        // refrences for user information
        let cardTemplate = '';

        // iterating over each random user object
        allUsers.forEach(user => {
            // creating the HTML for the user card
            cardTemplate += `
            <div class='card'>
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
        
        return cardTemplate;
    } // close user card function
    // function to create a modal for each random user from an array of user objects
    function modal(allUsers) {
        // creating the HTML for the user modals
        let modalTemplate = '';
        
        allUsers.forEach((user, index) => {
            // references for user information
            modalTemplate += `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="modal-text">${user.email}l</p>
                        <p class="modal-text cap">${user.location.city}</p>
                        <hr>
                        <p class="modal-text">${user.phone}</p>
                        <p class="modal-text">${user.location.street}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                        <p class="modal-text">Birthday: ${user.dob.date.substring(0, 10)}</p>
                    </div>
                </div>

                <div class="modal-btn-container">
                    
                    ${index !== 0 ? '<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>' : ''}
                    ${index !== 11 ? '<button type="button" id="modal-next" class="modal-next btn">Next</button>' : ''}
                </div>
            </div>
            `;
        }); 

        return modalTemplate;
    }

    function displayModal() {
        $('.card').click((e) => {
            // traversing upwards to the parent .card div
            const parents = $(e.target).parentsUntil('.gallery');
            let parentCard;

            /* if there are no ancestors to traverse to .div, 
            then e.target is the parent div.card
            if there are ancestors, then the last element will be the parent div.card */
            if (parents.length === 0) {
                parentCard = e.target;
            } else {
                parentCard = parents[parents.length - 1]; // accessing the last element in the array
            }

            // finding the name of the employee
            const $empName = $(parentCard).find('.card-info-container>h3').text();

            // reference to the current modal
            const $currentModal = $(`.modal-container:has(h3:contains(${$empName}))`);

            // displaying the modal
            $currentModal.show();
        }); // close display modal handler
    } // close displayModal function
    // function to handle the modal prev/next btns
    function handleSlide() {
        // event listener for modal prev/next btns
        $('.modal-btn-container>button').click((e) => {
            // finding the index of the current element
            const parentModal = $(e.target).parents('.modal-container')[0];
            let parentIndex = $('.modal-container').index(parentModal);

            // finding the index of the target modal
            let targetIndex;
            if ($(e.target).attr('id') === 'modal-next') {
                targetIndex = parentIndex + 1;
            } else {
                targetIndex = parentIndex - 1;
            }

            // hiding the current modal
            $(parentModal).hide();

            // showing the target modal
            const targetModal = $('.modal-container').get(targetIndex);
            $(targetModal).show();
        });
    }
    // function to handle modal x button
    function handleX() {
        $('.modal-close-btn').click((e) => {
            // find the parent modal and hide it
            let parentModal = $(e.target).parents('.modal-container')[0];
            $(parentModal).hide();
        }); //
    } // close handleX function
    // handling the search event
    function handleSearch() {
        // event listener on the search event
        $('#search-input').keyup((e) => {
            // refrence to the input
            let inputVal = $(e.target).val().toLowerCase();
            
            // conditional to show or hide based on whether there is appropriate input to filter with
            $('.card').each(function() {
                // jqeury reference for the current .card
                let $this = $(this); 

                // if the current card contains the input: show the element, else: hide
                if ($this.find(`h3:contains(${inputVal})`).length !== 0) {
                    $this.show();
                } else {
                    $this.hide();
                }
            }); // close .card iteration

        }); // close search event handler
    } //close search event function
    // =========================== API REQUEST =========================================================
    // getting random user data


    $.getJSON('https://randomuser.me/api/?results=12&nat=us,gb&inc=picture,name,email,location,dob,phone', 
        data => {
            // Hiding the loader when the request is complete
            $('.loader').hide();

            // appending the data into the gallery div
            $galleryDiv.append(cards(data.results));

            // appending modals to the modal-div
            $modalDiv.append(modal(data.results));
            
            // handling modal display
            displayModal();
            $(".modal-container").hide();
            // handling modal slide
            handleSlide();

            // handling the x functionality
            handleX();

            // handling the search function
            handleSearch();

        }); // close Random User API request    

    
}); // close doc.ready