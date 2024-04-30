import rainbowSDK from './rainbow-sdk.min.js'; // If you do not use the bundler
//import rainbowSDK from 'rainbow-web-sdk'; // If you use the bundler (for example - Webpack)


var onReady = function onReady() {
    var token = sessionStorage.getItem('rainbowToken');
    console.log(token);
    if (token) {
        // Token exists, sign in with the token
        rainbowSDK.connection.signinWithToken(token)
            .then(function (account) {
                // Successfully signed in with token
                console.log('Signed in Successfully');
                console.log(account);

            })
            .catch(function (err) {
                // An error occurs
                console.log('[Hello World] :: Something went wrong with the signing...', err);
            });
    } else {
        window.location.href = 'login.html';

    };
};

var onSigned = function onSigned(event) {
    let account = event.detail;
    console.log('[Hello World] :: Signed in Successfully')
    // Authentication has been performed successfully. Account information could be retrieved.

};

var signout = function signout() {

    // The SDK for Web is ready to be used, so you can sign in
    rainbowSDK.connection.signout()
        .then(function () {
            // Successfully signed out from Rainbow
            console.log('[Hello World] :: Successfully signed out from Rainbow')
        })
        .catch(function (err) {
            // An error occurs during the stop of the Rainbow SDK

        });
};

var onStopped = function onStopped(event) {
    // The SDK has been completely stopped.
    console.log('[Hello World] :: On SDK completely stopped!');
};

var onStarted = function onStarted(event, account) {
    console.log('[Hello World] :: On SDK Started!');

};


let onLoaded = function onLoaded() {
    
    console.log('[Hello World] :: On SDK Loaded!');
    rainbowSDK
        .initialize('69b09490015611ef9f25994f9ae1ef66', 'KZFoAjNDZtyj0i089TyUTEFaM9SHp9tUk1BQ1mc72z628kfTvZAsbvLX8HHkqwVU')
        .then(() => {
            console.log('[Hello World] :: Rainbow SDK is initialized!');
            handleRainbowAuthenticationRedirect();
        })
        .catch(err => {
            console.log('[Hello World] :: Something went wrong with the SDK...', err);
        });
};

// Function to handle redirect back from Rainbow's authentication
function handleRainbowAuthenticationRedirect() {

    var hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove the leading '#'
    var token = hashParams.get('access_token');
    if (token) {
        sessionStorage.setItem('rainbowToken', token);
        console.log('[Hello World] :: Authentication redirect handled:');
    }

}

// 
var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(event) {
    let status = event.detail.status;

    switch (status) {
        case rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED:
            console.log('[Hello World] :: connection has changed to "connected" which means:your application is now connected to Rainbow')
            // The state of the connection has changed to "connected" which means that your application is now connected to Rainbow
            break;
        case rainbowSDK.connection.RAINBOW_CONNECTIONINPROGRESS:
            console.log('[Hello World] :: connection is now in progress which means:your application try to connect to Rainbow')
            // The state of the connection is now in progress which means that your application try to connect to Rainbow
            break;
        case rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED:
            console.log('[Hello World] :: connection changed to "disconnected" which means:your application is no more connected to Rainbow')
            // The state of the connection changed to "disconnected" which means that your application is no more connected to Rainbow
            break;
        default:
            break;
    };
};

// Fonction pour gérer le clic sur le bouton de déconnexion
var handleSignoutClick = function () {
    rainbowSDK.connection.signout()
        .then(function () {
            // Successfully signed out from Rainbow
            console.log('[Hello World] :: Successfully signed out from Rainbow');

            // Delete token from session storage
            sessionStorage.removeItem('rainbowToken');

            // Redirect to the login page
            window.location.href = 'login.html';
           
        })
        .catch(function (err) {
            // An error occurs during the stop of the Rainbow SDK
            console.error('[Hello World] ::  Error during sign out:', err);
        });
};

// Ajouter un écouteur d'événements pour le clic sur le bouton de déconnexion
document.getElementById("signoutBtn").addEventListener("click", handleSignoutClick);

document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
// Listen when the SDK is signed
document.addEventListener(rainbowSDK.connection.RAINBOW_ONSIGNED, onSigned);

// Subscribe to Rainbow connection change event
document.addEventListener(rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED, onConnectionStateChangeEvent);

document.addEventListener(rainbowSDK.connection.RAINBOW_ONSTARTED, onStarted); // event will be fired once user connects and all SDK services start

// Listen when the SDK is stopped
document.addEventListener(rainbowSDK.connection.RAINBOW_ONSTOPPED, onStopped)

rainbowSDK.start();
rainbowSDK.load();

function handleSearch() {
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
                         // Toggle display of chat box and send button/icon
                         let chatBox = document.getElementById('chatBox');
                         chatBox.style.display = 'block';
                         // Store the selected contact ID somewhere (e.g., data attribute)
                         chatBox.setAttribute('data-contact-id', user.dbId);
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

// Function to invite a contact
function inviteContact(contact) {
    console.log('Starting to invite contact:', contact);

    // Check if the contact object has the correct identifier
    if (!contact.dbId || typeof contact.dbId !== 'string' || contact.dbId.length !== 24) {
        console.error('Invalid contact identifier:', contact.dbId);
        return;
    }

    // Retrieve the contact by its ID
    rainbowSDK.contacts.getContactById(contact.dbId)
        .then(function(contactFound) {
            if (contactFound) {
                console.log('Here is the contact we found:', contactFound);

                // Once the contact is found, add it to the network
                rainbowSDK.contacts.addToNetwork(contactFound.dbId)
                    .then(function () {
                        // Invitation sent successfully, do something if needed
                        console.log('Invitation sent successfully');
                    })
                    .catch(function (err) {
                        // Handle errors if the invitation fails
                        console.error('Failed to send invitation:', err);
                    });
            } else {
                console.log('Contact not found');
            }
        })
        .catch(function(err) {
            console.log('Something went wrong:', err);
        });
}

// Handle sending messages
document.getElementById('sendButton').addEventListener('click', function() {

    let messageInput = document.getElementById('messageInput');
    let message = messageInput.value.trim();
    if (message) {
        // Get the selected contact ID from the chat box
        let contactId = document.getElementById('chatBox').getAttribute('data-contact-id');
        // Send the message
        chatWithContact(contactId, message);
        // Clear the message input
        messageInput.value = '';
    }
});


// Function to start a chat with the specified contact
function chatWithContact(contactId,message) {
    console.log('Starting chat with contact with ID :', contactId);

    rainbowSDK.contacts.getContactById(contactId)
        .then(function (selectedContact) {
            console.log('the contact found:', selectedContact);
            if (selectedContact) {
                // Contact found, do something with it
                var associatedConversation = null;
                rainbowSDK.conversations.getConversationByContactId(contactId)
                    .then(function (conversation) {
                        associatedConversation = conversation;
                        var lastMessage = conversation.lastMessageText                        ;
                        console.log('Last message:', lastMessage);
                        //let messageContent = "Good Employee";
                        // Send an answer
                        rainbowSDK.im.sendMessageToConversation(conversation.id, message);


                    })
                    .catch(function (err) {
                        console.log('Error getting the associated conversation:', err);
                    });
            } else {
                console.log('Contact not found');
            }
        })
        .catch(function (err) {
            console.log('Error getting contact by ID:', err);
        });
}


let onNewMessageReceived = function(event) {
    let message = event.detail.message;
    let conversation = event.detail.conversation
    console.log('You just recieved this Message :',message.data)

    // Do something with the new message received
};

document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived)

// Add event listener to the search button
document.getElementById('searchBtn').addEventListener('click', handleSearch);
document.getElementById('createBroupBtn').addEventListener('click', handleCreateGroup);

// popup a poge to displat the connected user
function toggleProfilePopup() {
    var popup = document.getElementById("profilePopup");
    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        popup.style.display = "block";
        handleProfile();
    }
}

function handleProfile() {
    var user = rainbowSDK.contacts.getConnectedUser();
    console.log('[Hello World] :: coneected user ' + user)
    if (user) {
        var username = user.firstname + " " + user.lastname;
        var email = user.loginEmail;
        var avatarUrl = user.avatar;
        var job = user.jobTitle;

        // Update profile popup with fetched data
        document.getElementById("username").innerText = username;
        document.getElementById("email").innerText = email;
        document.getElementById("popupAvatar").src = avatarUrl;
        document.getElementById("jobTitle").innerText = job;
    }
}

// Event listener registration
document.getElementById('profileIcon').addEventListener('click', toggleProfilePopup);

// Create a new group
function handleCreateGroup() {
    // Uncomment the following code to create a new group
    // var isFavorite = false;
    // rainbowSDK.groups
    //     .createGroup("Group 2", "a description 2", isFavorite)
    //     .then(function(group) {
    //         console.log('Group Created successfully :' + group);
    //     })
    //     .catch(function(err) {
    //         console.log('Something went wrong');
    //     });

    /*var ownedBubble;

    /* Handler called when the user clicks on a contact */
    /*rainbowSDK.bubbles.createBubble("My New Bubble", "The description of my bubble").then(function(bubble) {
        ownedBubble = bubble;
        // Do something when the bubble has been created
        console.log('Bubble has been Created');
    }).catch(function(err) {
        // Do something if there is a server issue when creating the new bubble
        console.log('Something went wrong',err);
    });*/

    // List of existing groups
    // Get the container to display group
    let resultsContainer = document.getElementById('divGroup');
    resultsContainer.innerHTML = ''; // Clear previous results

    try {
        let groups = rainbowSDK.groups.getAll(); // Synchronous call
        if (groups && groups.length > 0) {
            groups.forEach(function (group) {
                let groupDiv = document.createElement('div');
                groupDiv.textContent = group.name;
                resultsContainer.appendChild(groupDiv);
            });
        } else {
            // No groups found
            resultsContainer.textContent = 'No groups found.';
        }
    } catch (error) {
        // Handle any errors that occur during the search
        console.error('Error occurred during getAll Groups:', error);
    }
}

var onGroupCreated = function (event) {
    let group = event.detail;
    console.log('Group Created successfully :' + group);
};

document.addEventListener(rainbowSDK.RAINBOW_ONGROUPCREATED, onGroupCreated);