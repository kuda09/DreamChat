angular.module('Dreamchat.services', [])
    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'img/max.png'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'img/adam.jpg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'img/perry.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'img/mike.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })
    .factory('LocalStorage', [function () {


        return {

            set: function (key, value) {

                return localStorage.setItem(key, JSON.stringify(value));

            },
            get: function (key) {

                return JSON.parse(localStorage.getItem(key));

            },
            remove: function (key) {

                return localStorage.removeItem(key);

            }
        }

    }])
    .factory('Loader', ['$ionicLoading', '$timeout', function ($ionicLoading, $timemout) {


        return {


            show: function (text) {

                $ionicLoading.show({

                    content: text || 'Loading...',
                    noBackdrop: true
                })

            },
            hide: function () {

                $ionicLoading.hide();

            },
            toggle: function (text, timeout) {

                var that = this;
                that.show(text);


                $timemout(function () {

                    that.hide();

                }, timeout || 3000)l

            }
        }

    }])
    .factory('FirebaseFactory', ['$firebaseAuth', '$firebaseArray', 'FBURL', 'Utils', function ($firebaseAuth, $firebaseArray, FirebaseUrl, Utils) {


        return {

            auth: function () {

                var FirebaseRef = new Firebase(FirebaseUrl);


                return $firebaseAuth(FirebaseRef);
            },
            onlineUsers: function () {

                var onlineUsersRef = new Firebase(FirebaseUrl + 'onlineUsers');


                return $firebaseArray(onlineUsersRef);

            },
            chatBase: function () {


                var chatRef = new Firebase(FirebaseUrl + 'chats');


                return $firebaseArray(chatRef);
            },
            chatRef: function (loggedInUser, OtherUser) {


                var chatRef = new Firebase( FirebaseUrl + 'chats/chat_' + Utils.getHash(OtherUser, loggedInUser));

                return $firebaseArray(chatRef);

            }


        }
    }])
    .factory('UserFactory',['LocalStorage', function (LocalStorage) {


        var userKey = 'user';
        var presenceKey = 'presense';
        var onlineUsersKey = 'onlineusers';

        return {

            onlineUsers: {},
            setUser: function (user) {

                return LocalStorage.set(userKey, user);

            },
            getUser: function () {

                return LocalStorage.get(userKey);
            },
            cleanUser: function () {

                return LocalStorage.remove(userKey);

            },
            setOnlineUsers: function (users) {


                LocalStorage.set(onlineUsersKey, users);

                return this.onlineUsers.users;

            },
            getOnlineUsers: function () {

                if(this.onlineUsers && this.onlineUsers.length > 0) {

                    return this.onlineUsers
                } else {

                    return LocalStorage.get(onlineUsersKey);
                }

            },
            cleanOnlineUsers: function () {

                LocalStorage.remove(onlineUsersKey);

                return onlineUsers = null;

            },
            setPresenceId: function (presenceId) {


                return LocalStorage.get(presenceKey, presenceId);

            },
            getPresenceId: function () {

                return LocalStorage.get(presenceKey);

            },
            cleanPresenceId: function () {

                return LocalStorage.remove(presenceKey);
            }
        }


    }])
    .factory('Utils',[function () {


        return {

            escapeEmailAddress: function (email) {


                if(!email) return false;


                email = email.toLowerCase().replace(/\./g, ',').trim();

                return email;
            },
            unescapeEmailAddress: function (email) {


                if(!email) return false;

                email = email.toLowerCase().replace(/,/g,'.').trim();

                return email;

            },
            getHash : function (chatToUser, loggedInUser) {

                var hash = '';

                if(chatToUser > loggedInUser){

                    hash = this.escapeEmailAddress(chatToUser) + '_' + this.escapeEmailAddress(loggedInUser);
                } else {

                    hash = this.escapeEmailAddress(loggedInUser) + '_' + this.escapeEmailAddress(chatToUser);
                }


                return hash;

            },
            getBase64ImageFromInput: function (input, callback) {


                window.resolveLocalFileSystemURL(input, function (fileEntry) {

                    fileEntry.file(function (fille) {

                        var reader = new FileReader();
                        reader.onloadend = function (event) {

                            callback(null, event.target.result);

                        }

                    }, function () {

                        callback('failed', null);

                    })

                }, function () {

                    callback('failed', null);

                })

            }

        }

    }])
