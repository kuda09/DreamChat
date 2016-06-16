// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Dreamchat', ['ionic', 'Dreamchat.controllers', 'Dreamchat.services', 'Dreamchat.directives', 'ngCordova', 'ngCordovaOauth', 'firebase'])
    .run(function ($ionicPlatform, $rootScope) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

                if(error === 'AUTH_REQUIRED'){

                    $state.go("main");
                }

            })


        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.views.transition('platform');
        $ionicConfigProvider.navBar.alignTitle('center');
        
        $stateProvider
            .state('main', {
                
                url:'/',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl',
                cache: false,
                resolve: {
                    'currentAuth': ['FirebaseFactory', 'Loader', function (FBFactory, Loader) {
                        
                        Loader.show('Checking Auth...');
                        
                        return FBFactory.auth().$waitForAuth();
                        
                    }]
                }
            })
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                cache: false,
                resolve: {
                    'currentAuth': ['FirebaseFactory', 'Loader', function (FBFactory, Loader) {

                        Loader.show('Checking Auth...');

                        return FBFactory.auth().$waitForAuth();

                    }]
                }
            })
            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                },
                cache: false,
                resolve: {
                    'currentAuth': ['FirebaseFactory', 'Loader', function (FBFactory, Loader) {

                        Loader.show('Checking Auth...');

                        return FBFactory.auth().$waitForAuth();

                    }]
                }
            })
            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                },
                cache: false,
                resolve: {
                    'currentAuth': ['FirebaseFactory', 'Loader', function (FBFactory, Loader) {

                        Loader.show('Checking Auth...');

                        return FBFactory.auth().$waitForAuth();

                    }]
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                },
                cache: false,
                resolve: {
                    'currentAuth': ['FirebaseFactory', 'Loader', function (FBFactory, Loader) {

                        Loader.show('Checking Auth...');

                        return FBFactory.auth().$waitForAuth();

                    }]
                }
            })
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                },
                cache: false,
                resolve: {
                    'currentAuth': ['FirebaseFactory', 'Loader', function (FBFactory, Loader) {

                        Loader.show('Checking Auth...');

                        return FBFactory.auth().$waitForAuth();

                    }]
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');

    })
    .constant('FirebaseUrl','https://dreamchatt.firebaseio.com')
    .constant('GOOGLEKEY','184583154303-jb70mtstd0bcm5kp7004hpsjbb2ck2s9.apps.googleusercontent.com')
    .constant('GOOGLEAUTHSCOPE',['email']);
