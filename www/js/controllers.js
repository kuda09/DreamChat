(function () {
    
    "use strict";
    
    angular.module('Dreamchat.controllers', [])
        .run(['FirebaseFactory', '$rootScope', 'UserFactory', 'Utils', function (FirebaseFactory, $rootScope, UserFactory, Utils) {

            $rootScope, chatHistory = [];

            var baseChatMonitor = FirebaseFactory.chatBase();
            var unwatch = baseChatMonitor.$watch(function (snapshot) {

                var user = UserFactory.getUser();

                if (!user) return;

                if (snapshot.event == 'child_added' || snapshot.event == 'child_changed') {

                    var key = snapshot.key;

                    if (key.indexOf(Utils.escapeEmailAddress(user.email)) >= 0) {

                        var otherUser = snapshot.key.replace(/_/g, '').replace('chat', '').replace(Utils.escapeEmailAddress(user.email), '');

                        if ($rootScope.chatHistory.join('_').indexOf(otherUser) === -1) {

                            $rootScope.chatHistory.push(otherUser);
                        }

                        $rootScope.$broadcast('newChatHistory');
                        /*
                         * TODO: PRACTICE
                         * Fire a local notification when a new chat
                         comes in.
                         */

                    }
                }

            })

        }]) 
        .controller('MainCtrl', ['$scope', 'Loader', '$ionicPlatform', '$cordovaOauth', 'FirebaseFactory', 'GOOGLEKEY', 'GOOGLEAUTHSCOPE', 'UserFactory', 'currentAuth', '$state', function ($scope, Loader, $ionicPlatform, $cordovaOauth, FirebaseFactory, GOOGLEKEY, GOOGLEAUTHSCOPE, UserFactory, currentAuth, $state) {

            $ionicPlatform.ready(function () {

                Loader.hide();

                $scope.$on('showChatInterface', function ($event, authData) {

                    if(authData.google){

                        authData = authData.google;
                    }

                    UserFactory.setUser(authData);

                    Loader.toggle('Redirecting...');

                    $scope.onlineUsers = FirebaseFactory.onlineUsers();

                    $scope.onlineUsers
                        .$loaded()
                        .then(function () {

                            $scope.onlineUsers
                                .$add({
                                    picture: authData.cachedUserProfile.picture,
                                    name: authData.displayName,
                                    email: authData.email,
                                    login: Date.now()
                                })
                                .then(function (ref) {

                                    UserFactory.setPresenceId(ref.key());
                                    UserFactory.setOnlineUsers($scope.onlineUsers);

                                    $state.go('tab.dash');

                                });
                        });

                    return;
                });

                if (currentAuth) {
                    $scope.$broadcast('showChatInterface', currentAuth.google);
                }


                $scope.loginWithGoogle  = function () {


                    Loader.show('Authenticating...');

                    $cordovaOauth.google(GOOGLEKEY, GOOGLEAUTHSCOPE)
                        .then(function (result) {
                            FirebaseFactory.auth()
                                .$authWithOAuthToken('google', result.access_token)
                                .then(function (authData) {

                                    $scope.$broadcast('showChatInterface', authData);

                                }, function (error) {

                                    Loader.toggle(error);

                                });

                        });
                }
            })
            
        }])
})();