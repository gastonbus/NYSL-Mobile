var app = new Vue({
    el: "#app",
    data: {
        user: null,
        password: null,
        messages: [],
        message: null, //input text for sending messages
        gameId: null,
        currentUser: null,
        gameDate: null,
        gameKickOffTime: null,
        team1: null,
        team2: null,
    },
    methods: {
        updatePage: function(page) {
            document.getElementById("teams").style.display = "none";
            document.getElementById("locations").style.display = "none";
            document.getElementById("times").style.display = "none";
            document.getElementById("home").style.display = "none";
            document.getElementById("chat").style.display = "none";
            document.getElementById(page).style.display = "block";
        },
        firebaseInit: function() {
            var firebaseConfig = {
                apiKey: "AIzaSyD0_pLWJ5SP2vlDQbavUBDfoyafDQR1g_Q",
                authDomain: "nysl-62635.firebaseapp.com",
                databaseURL: "https://nysl-62635-default-rtdb.firebaseio.com",
                projectId: "nysl-62635",
                storageBucket: "nysl-62635.appspot.com",
                messagingSenderId: "308152210759",
                appId: "1:308152210759:web:2a549aa973feabe5b76862"
            };
            firebase.initializeApp(firebaseConfig);
        },
        createMessage: function() {
            var now = new Date();
            var date = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
            var hour = now.getHours() + ':' + now.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});

            firebase.database().ref("messages/" + app.gameId).push({
                text: app.message,
                messageDate: date,
                messageHour: hour,
                email: firebase.auth().currentUser.email,
                gameId: app.gameId,
                messageMiliseconds: Date.now(),
            });
            app.readMessages(app.gameId);
        },
        readMessages: function(gameIdRequested) {
            app.messages = [];
            firebase.database().ref("messages/" + gameIdRequested).on('child_added', function(dataSnapshot) {
                app.messages.push(dataSnapshot.val());
                // console.log(dataSnapshot.val());
            });
            app.gameDate = gameIdRequested.substring(4, 6) + '/' + gameIdRequested.substring(6, 8) + '/' + gameIdRequested.substring(0, 4);
            app.gameKickOffTime = gameIdRequested.substring(8, 10) + ':' + gameIdRequested.substring(10, 12) + ' ' + gameIdRequested.substring(12, 14);
            app.team1 = gameIdRequested.substring(14, 16);
            app.team2 = gameIdRequested.substring(16);
            app.updatePage('chat');
        },
        createUser: function() {
            firebase.auth().createUserWithEmailAndPassword(app.user,app.password)
            .then(function(){
                alert('The user has been created successfully.');
                app.currentUser = firebase.auth().currentUser.email;
                app.updatePage('chat');
            })
            .catch(function(error){
                var errorMessage = error.message;
                alert(errorMessage);
            })
        },
        userSignIn: function() {
            firebase.auth().signInWithEmailAndPassword(app.user, app.password)
            .then(function(){
                app.currentUser = firebase.auth().currentUser.email;
                app.updatePage('chat');
            })
            .catch(function(error){
                var errorMessage = error.message;
                alert(errorMessage);
            });
        },
        userSignOut: function() {
            firebase.auth().signOut()
            .then(function(){
                app.updatePage('chat');
                app.currentUser = null;
            })
        },
        selectGame: function(gameIdRequested) {
            app.gameId = gameIdRequested;
            app.readMessages(gameIdRequested);
        },
    },
});

app.firebaseInit();
console.log(firebase.auth().currentUser);
