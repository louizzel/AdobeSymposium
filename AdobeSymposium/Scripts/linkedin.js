function onLinkedInLoad() {
    IN.Event.on(IN, 'auth', onLinkedInAuth);
}

function onLinkedInAuth() {
    IN.API.Profile('me').result(displayProfiles);
}

function displayProfiles(profiles) {
    member = profiles.values[0];
}