
function handleSearch() {

    if (!rainbowSDK) {
        console.error('Rainbow SDK is not initialized yet.');
        return;
    }

    // Get the search keyword from the input field
    let keyword = document.getElementById('searchInput').value;
    console.log('[Hello World] :: Search By ' + keyword);

    // Perform the search operation
    rainbowSDK.contacts.searchByName(keyword, 10)

        .then(function (usersFound) {
            // Get the container to display search results
            let searchResultsContainer = document.getElementById('searchResults');
            searchResultsContainer.innerHTML = ''; // Clear previous results

            if (usersFound.length > 0) {
                // At least one user has been found
                usersFound.forEach(function (user) {
                    // Create a div element to display each contact
                    let contactDiv = document.createElement('div');
                    contactDiv.textContent = user.displayName;

                    // button to start a chat with the contact
                    let chatButton = document.createElement('button');
                    chatButton.textContent = 'Chat';
                    chatButton.addEventListener('click', function() {
                        chatWithContact(user);
                    });

                    // Append the contact div and chat button to the search results container
                    searchResultsContainer.appendChild(contactDiv);
                    searchResultsContainer.appendChild(chatButton);
                });
            }
            else {
                // No contact returned
                searchResultsContainer.textContent = 'No contacts found.';
            }
        })
        .catch(function (error) {
            // Handle any errors that occur during the search
            console.error('[Hello World] :: Error occurred during search:', error);
        });
}

// Function to start a chat with the specified contact
function chatWithContact(contact) {
    console.log('Starting chat with contact:', contact);
    // Implement the logic to start a chat with the contact here
}

// Add event listener to the search button
document.getElementById('searchBtn').addEventListener('click', handleSearch);
