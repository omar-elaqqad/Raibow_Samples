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

                // Get the user's avatar URL
                var avatarData = rainbowSDK.contacts.getConnectedUser().avatar;
                var userAvatarUrl = avatarData.src;
                console.log('the avar url:', userAvatarUrl)

                // Get the profile avatar element
                var profileAvatar = document.getElementById('profileAvatar');

                // Create an image element for the avatar
                var avatarImg = new Image();
                avatarImg.src = userAvatarUrl;

                // Get the dimensions of the profile icon
                var profileIcon = document.querySelector('.profile-icon');
                var iconWidth = window.getComputedStyle(profileIcon).width;
                var iconHeight = window.getComputedStyle(profileIcon).height;

                // Set the width and height of the avatar image to match the profile icon
                avatarImg.style.width = iconWidth;
                avatarImg.style.height = iconHeight;

                // Set the background size and position of the profile avatar
                profileAvatar.style.backgroundSize = 'cover';
                profileAvatar.style.backgroundPosition = 'center';

                // Once the image is loaded, replace the profile icon with the avatar image
                avatarImg.onload = function () {
                    // Clear any existing content from the profile icon
                    profileAvatar.innerHTML = '';
                    // Append the avatar image to the profile icon
                    profileAvatar.appendChild(avatarImg);
                };

                // Get recent conversations and populate the flipper flesh
                rainbowSDK.conversations.getAllConversations()
                    .then(function (conversations) {
                        const flipperFlesh = document.getElementById('recentConversationsList');
                        flipperFlesh.innerHTML = '';

                        conversations.forEach(conversation => {

                            if (conversation.type === 0) {

                                rainbowSDK.contacts.getContactById(conversation.contact.dbId)
                                    .then(contact => {

                                        console.log('the conversation id', conversation);
                                        var contactName = contact.firstname + ' ' + contact.lastname;
                                        var contactAvatar = contact.avatar;
                                        //var name=contact.name;

                                        // Create the conversation item
                                        var conversationItem = document.createElement('div');
                                        conversationItem.classList.add('conversation-item');
                                        // Create the avatar element
                                        var avatarImg = document.createElement('img');
                                        avatarImg.classList.add('contact-avatar');

                                        avatarImg.src = contactAvatar;
                                        avatarImg.alt = contactName;

                                        // Create the avatar element
                                        var avatarImg = document.createElement('img');
                                        avatarImg.classList.add('contact-avatar');
                                        avatarImg.alt = contactName;

                                        if (contactAvatar) {
                                            // If avatar exists, use it
                                            avatarImg.src = contactAvatar.src;
                                        } else {
                                            // If avatar is null, use first letter of the name
                                            var initials = contactName.split(' ').map(part => part.charAt(0)).join('');
                                            avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                                        }

                                        // Set the size of the avatar
                                        avatarImg.style.width = '30px';
                                        avatarImg.style.height = '30px';
                                        avatarImg.style.borderRadius = '50%';

                                        // Create the name element
                                        var nameSpan = document.createElement('span');
                                        nameSpan.textContent = contactName;

                                        // Append avatar and name to the conversation item
                                        conversationItem.appendChild(avatarImg);
                                        conversationItem.appendChild(nameSpan);

                                        // Make the conversation item clickable
                                        conversationItem.addEventListener('click', function () {
                                            var contactId = contact.dbId;
                                            handleConversationClick(conversation.dbId);
                                            handleDisplayContact(contactId);

                                        });

                                        // Append the conversation item to the flipper flesh
                                        flipperFlesh.appendChild(conversationItem);
                                    })
                                    .catch(err => {
                                        console.log('[Hello World] :: Something went wrong while getting the contactById..', err)
                                    });

                            }

                            if (conversation.type === 1) {
                                // Create the conversation item
                                var conversationItem = document.createElement('div');
                                conversationItem.classList.add('conversation-item');

                                // Create the avatar element
                                var avatarImg = document.createElement('img');
                                avatarImg.classList.add('contact-avatar');
                                avatarImg.style.width = '30px';
                                avatarImg.style.height = '30px';
                                avatarImg.style.borderRadius = '50%';

                                // Set the avatar source
                                if (conversation.room.avatar) {
                                    avatarImg.src = conversation.room.avatar;
                                } else {
                                    // If no avatar, use the first letter of the room name as initials
                                    var initials = conversation.room.name.charAt(0).toUpperCase();
                                    avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                                }

                                // Create the name element
                                var nameSpan = document.createElement('span');
                                nameSpan.textContent = conversation.room.name;

                                // Append avatar and name to the conversation item
                                conversationItem.appendChild(avatarImg);
                                conversationItem.appendChild(nameSpan);

                                // Make the conversation item clickable
                                conversationItem.addEventListener('click', function () {
                                    handleConversationClick(conversation.dbId);
                                    // Optionally, you can handle other actions when a bubble conversation item is clicked
                                });

                                // Append the conversation item to the flipper flesh
                                flipperFlesh.appendChild(conversationItem);
                            }



                        });
                    })
                    .catch(function (error) {
                        console.error('Error getting conversations:', error);
                    });

                updateNotificationCounter();

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

// Function to toggle the profile options popup
function toggleProfileOptionsPopup() {
    console.log('on profile options toggle');
    var popup = document.getElementById("profileOptionsPopup");
    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        //Display the profile options popup
        popup.style.display = "block";

        // Show the presence status
        showPresenceStatus();
    }
}

// Event for profile options popup
document.getElementById('profileIcon').addEventListener('click', toggleProfileOptionsPopup);

// popup a page to display the connected user
function toggleMyProfilePopup() {
    console.log('on my profile toggle toggle')
    var popup = document.getElementById("profilePopup");
    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        popup.style.display = "block";
        handleProfile();
    }
}
// Function to show the presence status of the connected user
function showPresenceStatus() {
    // Get the connected user object
    var connectedUser = rainbowSDK.contacts.getConnectedUser();

    // Convert the presence status to a valid value
    var convertedStatus = convertPresenceState(connectedUser.status);

    // Map the presence status to corresponding strings and icons
    var presenceMap = {
        online: { text: "Online", icon: "fas fa-circle text-success" },
        away: { text: "Away", icon: "fas fa-clock text-warning" },
        xa: { text: "Invisible", icon: "fas fa-eye-slash text-secondary" },
        dnd: { text: "Do Not Disturb", icon: "fas fa-ban text-danger" }
    };

    // Get the presence info based on the converted status
    var presenceInfo = presenceMap[convertedStatus] || { text: "Unknown", icon: "fas fa-question text-muted" };

    // Update the presence option element with the current presence status
    var presenceOption = document.getElementById('presence');
    var presenceIcon = presenceOption.querySelector('i');
    var presenceText = presenceOption.querySelector('span');

    presenceIcon.className = presenceInfo.icon;
    presenceText.innerText = presenceInfo.text;

}

// Function to convert presence states to valid values
function convertPresenceState(state) {
    switch (state) {
        case 'online':
            return 'online';
        case 'away':
            return 'away';
        case 'offline':
            return 'xa'; // 'xa' represents invisible state
        case 'dnd':
            return 'dnd';
        default:
            return 'online'; // Default to 'online' if state is unknown
    }
}
// Function to show the presence options on hover
var presence = document.getElementById('presence');
var presenceOptions = document.getElementById('presenceOptions');

presence.addEventListener('mouseover', function () {
    presenceOptions.style.display = 'block';
});
// Select all the presence options
var presenceValues = document.querySelectorAll('.profile-popup .option');

// Add click event listener to each presence option
presenceValues.forEach(function (option) {
    option.addEventListener('click', function () {
        var status = this.querySelector('span').innerText;
        changePresence(status);
    });
});

// Function to change the presence status
function changePresence(status) {
    // Map the status to the corresponding value expected by the Rainbow SDK
    var presenceMap = {
        Online: 'online',
        Away: 'away',
        Invisible: 'xa', // 'xa' represents invisible state
        'Do Not Disturb': 'dnd'
    };

    // Get the status value expected by the Rainbow SDK
    var presenceStatus = presenceMap[status];

    if (!presenceStatus) {
        console.error('Invalid presence status:', status);
        return;
    }

    // Update the presence status locally
    var presenceText = document.getElementById('presenceValue');
    presenceText.innerText = status;

    // Set the presence status on the server using Rainbow SDK
    rainbowSDK.presence.setPresenceTo(presenceStatus);

    var pre = rainbowSDK.contacts.getConnectedUser().status;
    console.log('the new presense status is ', pre)
}

function handleProfile() {
    var user = rainbowSDK.contacts.getConnectedUser();
    if (user) {
        var username = user.firstname + " " + user.lastname;
        var email = user.loginEmail;
        var avatarUrl = user.avatar.src;
        // Update profile popup with fetched data
        document.getElementById("username").innerText = username;
        document.getElementById("email").innerText = email;
        document.getElementById("popupAvatar").src = avatarUrl;
    }
}
// Event for "My Profile" option
document.getElementById('myProfileOption').addEventListener('click', toggleMyProfilePopup);
document.getElementById('closeProfileBtn').addEventListener('click', toggleMyProfilePopup);
document.getElementById('editProfileBtn').addEventListener('click', function () {
    console.log("Edit Profile clicked");
});

function handleSearch() {
    // Get the search keyword from the input field
    let keyword = document.getElementById('searchInput').value;
    console.log('[Hello World] :: Search By ' + keyword);

    rainbowSDK.contacts.searchByName(keyword, 10)
        .then(function (usersFound) {
            // Get the container to display search results
            let searchResultsContainer = document.getElementById('recentConversationsList');
            searchResultsContainer.innerHTML = '';

            if (usersFound.length > 0) {
                // At least one user has been found
                usersFound.forEach(function (user) {
                    // Create a conversation item similar to recent conversations
                    var contactName = user.firstname + ' ' + user.lastname;
                    var contactAvatar = user.avatar;

                    // Create the conversation item
                    var conversationItem = document.createElement('div');
                    conversationItem.classList.add('conversation-item');

                    // Create the avatar element
                    var avatarImg = document.createElement('img');
                    avatarImg.classList.add('contact-avatar');
                    avatarImg.src = contactAvatar;
                    avatarImg.alt = contactName;

                    if (contactAvatar) {
                        // If avatar exists, use it
                        avatarImg.src = contactAvatar.src;
                    } else {
                        // If avatar is null, use first letter of the name
                        var initials = contactName.split(' ').map(part => part.charAt(0)).join('');
                        avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                    }

                    // Create the name element
                    var nameSpan = document.createElement('span');
                    nameSpan.textContent = contactName;

                    // Append avatar and name to the conversation item
                    conversationItem.appendChild(avatarImg);
                    conversationItem.appendChild(nameSpan);

                    // Make the conversation item clickable
                    conversationItem.addEventListener('click', function () {

                        console.log('the id of selected contact', user.dbId)

                        rainbowSDK.conversations.getConversationByContactId(user.dbId).then(function (conversation) {
                            console.log('the conversation for the selected contact', conversation);
                            handleConversationClick(conversation.dbId);

                        }).catch(function (err) {
                            console.log('something went Wrong while getting the conversation for each search result', err)
                        });

                        handleDisplayContact(user.dbId);
                    });

                    // Append the conversation item to the search results container
                    searchResultsContainer.appendChild(conversationItem);
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

// Add event listener to the search input
document.getElementById('searchInput').addEventListener('input', handleSearch);

// Function to toggle the notification list
function toggleNotificationList() {
    var notificationList = document.getElementById("notificationList");
    if (notificationList.style.display === "block") {
        notificationList.style.display = "none";
    } else {
        notificationList.style.display = "block";
        displayNotifications();
    }
}

// Function to display notifications
function displayNotifications() {
    const invitations = rainbowSDK.contacts.getInvitationsReceived();
    console.log('here are your invitations', invitations);
    displayInvitations(invitations);
}

// Function to display invitations
function displayInvitations(invitations) {
    const invitationList = document.getElementById('invitationList');

    // Clear existing invitations
    invitationList.innerHTML = '';

    // Iterate through the list of invitations
    invitations.forEach((invitation) => {
        // Create a list item for each invitation
        const listItem = document.createElement('li');
        listItem.classList.add('invitation-item');

        var invitingUserId = invitation.invitingUserId;
        console.log('Id of inviting user', invitingUserId)
        // Display sender's name and message
        rainbowSDK.contacts.getContactById(invitingUserId)
            .then((sender) => {

                console.log('the inviting user', sender);

                // Create a list item for each invitation
                const listItem = document.createElement('li');
                listItem.classList.add('invitation-item');

                var senderName = sender ? (sender.firstname + ' ' + sender.lastname) : 'Unknown User';
                var senderAvatar = sender ? sender.avatar : null;
                const message = ` would like to add you to their network  `;

                // Create the avatar element
                var avatarImg = document.createElement('img');
                avatarImg.classList.add('invitation-avatar');
                avatarImg.alt = senderName;

                if (senderAvatar) {

                    avatarImg.src = senderAvatar.src;
                } else {
                    var initials = senderName.split(' ').map(part => part.charAt(0)).join('');
                    avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                }

                // Append avatar to the list item
                listItem.appendChild(avatarImg);

                // Add sender's name and message to the list item
                listItem.innerHTML += `<span style='font-weight: bold'>${senderName}</span>${message}`;

                // Add icons for accepting and declining the invitation
                const acceptIcon = document.createElement('i');
                acceptIcon.classList.add('fas', 'fa-check', 'accept-icon');
                const declineIcon = document.createElement('i');
                declineIcon.classList.add('fas', 'fa-times', 'decline-icon');

                // Add event listeners for accepting and declining the invitation
                acceptIcon.addEventListener('click', () => acceptInvitation(invitation.id));
                declineIcon.addEventListener('click', () => declineInvitation(invitation.id));

                // Append icons to the list item
                listItem.appendChild(acceptIcon);
                listItem.appendChild(declineIcon);

                // Append the list item to the invitation list
                invitationList.appendChild(listItem);

            })
            .catch((error) => {
                console.error('Error fetching sender information:', error);
            });

        // Append the list item to the invitation list
        invitationList.appendChild(listItem);
    });
}
// Function to handle accepting an invitation
function acceptInvitation(invitationId) {
    console.log('accept invitation', invitation);
    rainbowSDK.contacts
        .acceptInvitation(invitationId)
        .then(function () {
            updateNotificationCounter()
        })
        .catch(function (err) {
            console.log('something went wrong while accepting the invitation', err)
        });
}

// Function to handle declining an invitation
function declineInvitation(invitationId) {
    console.log('decline invitation', invitationId);
    rainbowSDK.contacts
        .declineInvitation(invitationId)
        .then(function () {
            updateNotificationCounter()
        })
        .catch(function (err) {
            console.log('something went wrong while declining the invitation', err)
        });
}

// Function to update notification counter
function updateNotificationCounter() {
    const invitations = rainbowSDK.contacts.getInvitationsReceived();
    const count = invitations.length;
    var counter = document.getElementById("notificationCounter");
    counter.innerText = count;
    if (count > 0) {
        counter.classList.remove("hide");
    } else {
        counter.classList.add("hide");
    }
}
// Event for notification button
document.getElementById("notificationBtn").addEventListener("click", toggleNotificationList);

// Define the function to handle new invitation received
function onNewInvitationReceived(event) {
    var invitation = event.detail;
    console.log('The invitation received:', invitation);
    // Update the notification counter
    updateNotificationCounter();
    displayNotifications();
}
// Listen for the RAINBOW_ONCONTACTINVITATIONRECEIVED event
rainbowSDK.events.on(rainbowSDK.constants.events.RAINBOW_ONCONTACTINVITATIONRECEIVED, onNewInvitationReceived);

// Function to start a chat with the specified contact
function chatWithContact(contactId, message) {
    console.log('Starting chat with contact with ID :', contactId);

    rainbowSDK.contacts.getContactById(contactId)
        .then(function (selectedContact) {
            console.log('the contact found:', selectedContact);
            if (selectedContact) {
                // Contact found, do something with it
                var associatedConversation = null;
                rainbowSDK.conversations.getConversationByContactId(selectedContact.dbId)
                    .then(function (conversation) {
                        associatedConversation = conversation;
                        var lastMessage = associatedConversation.lastMessageText;
                        console.log('Last message:', lastMessage);
                        // Send an answer
                        rainbowSDK.im.sendMessageToConversation(associatedConversation.dbId, message)
                        // Reload conversation after sending message
                        handleConversationClick(associatedConversation.dbId);
                    })
                    .catch(function (err) {
                        console.log('Error getting the associated conversation:', err);
                        reject(err); // Reject the promise if there's an error getting the conversation
                    });
            } else {
                console.log('Contact not found');
                reject(new Error('Contact not found')); // Reject the promise if the contact is not found
            }
        })
        .catch(function (err) {
            console.log('Error getting contact by ID:', err);
            reject(err); // Reject the promise if there's an error getting the contact by ID
        });
}

let onNewMessageReceived = function (event) {
    let message = event.detail.message;
    let conversation = event.detail.conversation;
    console.log('the conversation',conversation);
    console.log('You just recieved this Message :', message.data)

    if (conversation.type === 0) {

        rainbowSDK.contacts.getContactById(conversation.contact.dbId)
            .then(contact => {

                console.log('the conversation id', conversation);
                var contactName = contact.firstname + ' ' + contact.lastname;
                var contactAvatar = contact.avatar;
                //var name=contact.name;

                // Create the conversation item
                var conversationItem = document.createElement('div');
                conversationItem.classList.add('conversation-item');
                // Create the avatar element
                var avatarImg = document.createElement('img');
                avatarImg.classList.add('contact-avatar');

                avatarImg.src = contactAvatar;
                avatarImg.alt = contactName;

                // Create the avatar element
                var avatarImg = document.createElement('img');
                avatarImg.classList.add('contact-avatar');
                avatarImg.alt = contactName;

                if (contactAvatar) {
                    // If avatar exists, use it
                    avatarImg.src = contactAvatar.src;
                } else {
                    // If avatar is null, use first letter of the name
                    var initials = contactName.split(' ').map(part => part.charAt(0)).join('');
                    avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                }

                // Set the size of the avatar
                avatarImg.style.width = '30px';
                avatarImg.style.height = '30px';
                avatarImg.style.borderRadius = '50%';

                // Create the name element
                var nameSpan = document.createElement('span');
                nameSpan.textContent = contactName;

                // Append avatar and name to the conversation item
                conversationItem.appendChild(avatarImg);
                conversationItem.appendChild(nameSpan);

                // Make the conversation item clickable
                conversationItem.addEventListener('click', function () {
                    var contactId = contact.dbId;
                    handleConversationClick(conversation.dbId);
                    handleDisplayContact(contactId);

                });

                // Append the conversation item to the flipper flesh
                flipperFlesh.appendChild(conversationItem);
            })
            .catch(err => {
                console.log('[Hello World] :: Something went wrong while getting the contactById..', err)
            });

    }

    // Do something with the new message received
};

document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived)

//function to handle onclick conversation
function handleConversationClick(conversationId) {
    // Get the main content element
    const mainContent = document.getElementById('mainContent');

    const myUserId = rainbowSDK.contacts.getConnectedUser().dbId;
    console.log('my user id', myUserId);

    // Show the main content
    mainContent.style.display = 'block';

    // Get chat box and input container
    const chatBox = document.getElementById('chatBox');
    const inputContainer = document.querySelector('.input-container');
    // Clear previous content in the main content
    chatBox.innerHTML = '';

    chatBox.style.display = 'block';
    inputContainer.style.display = 'block';

    // Get contact ID from the conversation
    const contactId = rainbowSDK.conversations.getConversationById(conversationId).contact.dbId;

    // Get conversation history messages
    rainbowSDK.im.getMessagesFromConversation(conversationId, 30)
        .then(conversation => {
            var messages = conversation.messages;
            // Check if messages is an array
            if (messages && messages.length > 0) {
                // Process the messages, for example, display them in the chat box
                messages.forEach(message => {
                    // Determine if message sender is me (adjust this based on your message structure)
                    const isMe = message.from.dbId === myUserId; // Adjust myUserId according to your implementation

                    // Display the message
                    displayMessage(message.data, isMe);
                });
            } else {
                console.log('No messages found for this conversation.');
            }
        })
        .catch(error => {
            console.error('Error getting conversation history:', error);
        });

    // Add event listener to send button
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    sendMessageBtn.addEventListener('click', function () {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim(); // Trim whitespace from the message
        if (message !== '') {
            chatWithContact(contactId, message)

            messageInput.value = '';
        }
    });
}

function displayMessage(message, isMe) {
    const chatBox = document.getElementById('chatBox');

    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;

    // Apply different styles based on sender (me or not me)
    if (isMe) {
        messageElement.classList.add('sent-message');
        messageElement.id = 'sentMessage'; // Add ID for sent message
    } else {
        messageElement.classList.add('received-message');
        messageElement.id = 'receivedMessage'; // Add ID for received message
    }

    // Append message element to message container
    messageContainer.appendChild(messageElement);

    // Append message container to chat box
    chatBox.appendChild(messageContainer);
}

function handleDisplayContact(contactId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.innerHTML = '';

    // Get contact info and display in detail-contact
    rainbowSDK.contacts.getContactById(contactId)
        .then(contact => {
            // Create and append the avatar
            const avatar = document.createElement('img');
            avatar.src = contact.avatar.src || ''; // Use contact avatar if available, otherwise empty string
            avatar.alt = 'Contact Avatar';
            avatar.classList.add('contact-detail-avatar');
            detailContact.appendChild(avatar);

            // Create and append the buttons div
            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('contact-buttons');

            // Create and append the favorite button
            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = 'Favorite';
            favoriteButton.classList.add('favorite-button');
            favoriteButton.addEventListener('click', () => {
                Favorite(contact.dbId, 'user');
            });
            buttonsDiv.appendChild(favoriteButton);

            // Create and append the invite button
            const inviteButton = document.createElement('button');
            inviteButton.textContent = 'Invite';
            inviteButton.classList.add('invite-button');
            inviteButton.addEventListener('click', () => {
                inviteContact(contact.dbId);
            });
            buttonsDiv.appendChild(inviteButton);

            detailContact.appendChild(buttonsDiv);

            // Create and append the full name
            const fullName = document.createElement('h2');
            fullName.textContent = `${contact.firstname} ${contact.lastname}`;
            fullName.classList.add('contact-name');
            detailContact.appendChild(fullName);

            // Create and append contact information
            const contactInfoDiv = document.createElement('div');
            contactInfoDiv.classList.add('contact-information');

            // Email
            const emailDiv = document.createElement('div');
            const emailLabel = document.createElement('span');
            emailLabel.textContent = 'Email:';
            const emailValue = document.createElement('span');
            emailValue.textContent = contact.loginEmail || '';
            emailDiv.appendChild(emailLabel);
            emailDiv.appendChild(emailValue);
            contactInfoDiv.appendChild(emailDiv);

            // Add other contact information here

            // Create and append the remove from network button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove from Network';
            removeButton.classList.add('remove-from-network-button');
            removeButton.addEventListener('click', () => {
                removeFromNetwork(contact.dbId);
            });
            contactInfoDiv.appendChild(removeButton);

            detailContact.appendChild(contactInfoDiv);

            // Show the detail contact section
            detailContact.style.display = 'block';
            const mainContent = document.getElementById('mainContent');
            mainContent.style.flex = 'auto';
        })
        .catch(err => {
            console.error('Error getting contact info:', err);
        });
}

function Favorite(contactId, type) {


}

function removeFromNetwork(contactId) {
    // Remove the fist contact from your network
    var Contact = rainbowSDK.contacts.getNetworkContacts()[0];

    rainbowSDK.contacts
        .removeFromNetwork(contact)
        .then(function () {
            // Do something once the contact has been removed
        })
        .catch(function (err) {
            // Do something in case of error when removing the contact
        });

}
// Function to invite a contact
function inviteContact(contactId) {
    console.log('Starting to invite contact:', contact);

    // Check if the contact object has the correct identifier
    if (!contactId) {
        console.error('Invalid contact identifier:', contactId);
        return;
    }

    // Retrieve the contact by its ID
    rainbowSDK.contacts.getContactById(contactId)
        .then(function (contactFound) {
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
        .catch(function (err) {
            console.log('Something went wrong:', err);
        });
}

// Handle sending messages
document.getElementById('sendButton').addEventListener('click', function () {

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

//document.getElementById('createBroupBtn').addEventListener('click', handleCreateGroup);

document.addEventListener(rainbowSDK.RAINBOW_ONGROUPCREATED, onGroupCreated);