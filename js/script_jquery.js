// Waiting for the document to be ready
$(document).ready(() => {
    // refrences for important dom elements
    const $galleryDiv = $('#gallery');
    const $modalDiv = $('#modal-div');
    
    const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
    `;

    $('.search-container').append(searchHTML);

    function cards(allUsers) {
        let cardTemplate = '';

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
    } 
    function modal(allUsers) {
        // creating the HTML for the user modals
        let modalTemplate = '';
        
        allUsers.forEach((user, index) => {
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


            if (parents.length === 0) {
                parentCard = e.target;
            } else {
                parentCard = parents[parents.length - 1]; 
            }

            const $empName = $(parentCard).find('.card-info-container>h3').text();
            const $currentModal = $(`.modal-container:has(h3:contains(${$empName}))`);
            $currentModal.show();
        });
    } 
    // function to handle the modal prev/next btns
    function addOrRemoveButtons() {
        // event listener for modal prev/next btns
        $('.modal-btn-container>button').click((e) => {
            const parentModal = $(e.target).parents('.modal-container')[0];
            let parentIndex = $('.modal-container').index(parentModal);

            let targetIndex;
            if ($(e.target).attr('id') === 'modal-next') {
                targetIndex = parentIndex + 1;
            } else {
                targetIndex = parentIndex - 1;
            }

            $(parentModal).hide();
            const targetModal = $('.modal-container').get(targetIndex);
            $(targetModal).show();
        });
    }

    // function to handle modal x button
    function closeModal() {
        $('.modal-close-btn').click((e) => {
            // find the parent modal and hide it
            let parentModal = $(e.target).parents('.modal-container')[0];
            $(parentModal).hide();
        }); 
    } 
    
    // handling the search event
    function handleSearch() {
        // event listener on the search event
        $('#search-input').keyup((e) => {
            let inputVal = $(e.target).val().toLowerCase();
            
            // conditional to show or hide based on whether there is appropriate input to filter with
            $('.card').each(function() {
                // jqeury reference for the current .card
                let $this = $(this); 

                if ($this.find(`h3:contains(${inputVal})`).length !== 0) {
                    $this.show();
                } else {
                    $this.hide();
                }
            }); n

        }); 
    } 

    // =========================== Main =========================================================

    $.getJSON('https://randomuser.me/api/?results=12&nat=us,gb&inc=picture,name,email,location,dob,phone', 
        data => {
            // Hiding the loader when the request is complete
            $('.loader').hide();

            $galleryDiv.append(cards(data.results));

            $modalDiv.append(modal(data.results));
            displayModal();
            $(".modal-container").hide();
            addOrRemoveButtons();
            closeModal();
            handleSearch();

        }); // close Random User API request    

    
}); // close doc.ready