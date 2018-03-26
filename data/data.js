var firebase = require('firebase/app'); // firebase app
require('firebase/database'); // firebase database
// TODO: Replace with your project's customized code snippet
var config = {
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com"
};
var app = firebase.initializeApp(config); // Initialize Firebase
var database = firebase.database(); // Get a reference to the database service

// Create a reference to status node.
// This is where we will store data about being online/offline.
const STATUS_REF = firebase.database().ref('/status');

// We'll create two constants which we will write to
// the Realtime database when this device is offline
// or online.
const IS_OFFLINE_FOR_DATABASE = {
    state: 'offline',
    lastChanged: firebase.database.ServerValue.TIMESTAMP,
};

const IS_ONLINE_FOR_DATABASE = {
    state: 'online',
    lastChanged: firebase.database.ServerValue.TIMESTAMP,
};

// Firebase server listens our connection status
function listenStatus() {
    return database.ref('.info/connected').on('value', (snapshot) => {
        if (snapshot.val()) {
            STATUS_REF.onDisconnect().set(IS_OFFLINE_FOR_DATABASE).then(function () {
                STATUS_REF.set(IS_ONLINE_FOR_DATABASE)  
            });
        } 
    });
}

// Listens ref value from Firebase path
function listenRef(path, callback) {
    database.ref(path).on('value', (snapshot) => {
        callback(snapshot);  
    });    
}

function sendToFirebase(path, value) {
    return database.ref(path).set(value).then(() => {
        console.log('Synchronization succeeded');
        return value;
    }).catch((error) => {
        console.log('Synchronization failed at ' + path);
        console.log('Error on send data ' + error);
        throw error;
    });
}

var output = {
    listenStatus: listenStatus,
    listenRef: listenRef,
    sendToFirebase: sendToFirebase
};

module.exports = output;