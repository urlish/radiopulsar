// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'ngStorage', 'ngSanitize', 'ngCordova', 'myTranslate'])
    .run(function($ionicPlatform, $rootScope, $state, $ionicLoading, $localStorage, $ionicHistory, $window, $ionicPopup, $cordovaNetwork, $cordovaToast) {
        if(rtl_language) $rootScope.app_direction = "rtl";
        $ionicPlatform.ready(function() {
            if (navigator.splashscreen) {
                setTimeout(function() {
                    navigator.splashscreen.hide();
                }, 100);
            }
            //google
             if (window.ga) {
            window.ga.startTrackerWithId(google_analytics, 30);
            if (ionic.Platform.isAndroid()) window.ga.trackView('Android');
            else window.ga.trackView('iOS');
            }
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            $rootScope.comeBack = function() {
                $ionicHistory.goBack();
            }
            if (window.plugins) {
                window.plugins.OneSignal
                    .startInit(your_appid, your_google_project)
                    .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
                    .handleNotificationReceived(function(jsonData) {
                        var dataNotifi = {};
                        dataNotifi.title = jsonData.payload.title;
                        dataNotifi.body = jsonData.payload.body;
                        dataNotifi.id = jsonData.payload.notificationID;
                        dataNotifi.date = new Date();
                        if (typeof jsonData.payload.additionalData != 'undefined') {
                            var addData = jsonData.payload.additionalData;
                            if (addData.posts != undefined) {
                                dataNotifi.type = "1";
                                dataNotifi.idPost = addData.posts;
                            } else if (addData.category != undefined) {
                                dataNotifi.type = "2";
                                dataNotifi.idCategory = addData.category;
                            }
                        } else {
                            dataNotifi.type = "3";
                        }
                        $localStorage.notification.push(dataNotifi);
                    })
                    .handleNotificationOpened(function(jsonData) {
                        if (ionic.Platform.isAndroid()) {
                            var addData = JSON.parse(jsonData.notification.payload.additionalData);
                        } else {
                            var addData = jsonData.notification.payload.additionalData;
                        }
                        if (addData != undefined) {
                            if (addData.posts != undefined) {
                                var idadd = Number(addData.posts);
                                $state.go('app.details', { idPost: idadd });
                            } else if (addData.category != undefined) {
                                var idcategory = addData.category;
                                $state.go('app.categories', { idCategory: idcategory })
                            }
                        } else {
                            $state.go('app.detailsNotifi', { idNotifi: jsonData.notification.payload.notificationID });
                        }
                    })
                    .endInit();
            }
        });
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
        $rootScope.hostName = url + verJson;
        $rootScope.url = url;
        $rootScope.fontSize = $localStorage.font;
        $rootScope.per_page = 10;
        $rootScope.showLoad = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner><span style="margin-left:10px;">Waiting...</span>'
            })
        }
        $rootScope.hideLoad = function() {
            $ionicLoading.hide();
        }
        $rootScope.showPopup = function(template) {
            var myPopup1 = $ionicPopup.show({
                template: template,
                scope: $rootScope,
                buttons: [{
                    text: 'Close',
                    onTap: function(e) {
                        setTimeout(function(){ $state.reload(); }, 100);
                    }
                }]
            })
        }
        // check network
        document.addEventListener("deviceready", function() {

            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                    var onlineState = networkState;
                     $rootScope.offlineState = false;

                })
                // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                var offlineState = networkState;
                $rootScope.offlineState = networkState;
                $cordovaToast.show('No Network Connection', 'long', 'center').then(function(success) {
                    // success
                }, function(error) {
                    // error
                });
            })
        }, false);
        if (window.plugins) { window.plugins.OneSignal.setSubscription(true); }

    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.latest', {
                url: '/latest',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab/latest.html',
                        controller: 'postCtrl'
                    }
                }
            })

        .state('app.feature', {
                url: '/feature',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab/feature.html',
                        controller: 'postCtrl'
                    }
                }
            })
            .state('app.video', {
                url: '/video',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab/video.html'
                    }
                }
            })

        .state('app.photo', {
                url: '/photo/:photoId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab/photo.html',
                        controller: 'photoCtrl'
                    }
                }
            }).state('app.details', {
                url: '/details/:idPost',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/details.html',
                        controller: 'detailsCtrl'
                    }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'homeCtrl'
                    }
                }
            })
            .state('app.notification', {
                url: '/notification',
                cache: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/notification/notification.html',
                        controller: 'notifiCtrl'
                    }
                }
            }).
        state('app.detailsNotifi', {
            url: '/detailsNotifi/:idNotifi',
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: 'templates/notification/detailsNotifi.html',
                    controller: 'detailsNotifiCtrl'
                }
            }
        }).
        state('app.bookmark', {
            url: '/bookmark',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/bookmark/index.html',
                    controller: 'bookmarkCtrl'
                }
            }
        }).
        state('app.help', {
            url: '/help',
            views: {
                'menuContent': {
                    templateUrl: 'templates/help/index.html',
                    controller: 'helpCtrl'
                }
            }
        }).
        state('app.faq', {
            url: '/faq',
            views: {
                'menuContent': {
                    templateUrl: 'templates/help/faq.html'
                }
            }
        }).
        state('app.term', {
                url: '/term',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/help/term.html'
                    }
                }
            }).
            /*state('app.rate',{
              url:'/rate',
              views :{
                'menuContent':{
                  templateUrl:'templates/help/rate.html'
                }
              }
            }).*/
        state('app.pushNotifi', {
                url: '/pushNotifi',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/notification/pushnotifi.html'
                    }
                }
            })
            .state('app.signin', {
                url: '/signin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/sign/signin.html',
                        controller: 'signinCtrl'
                    }
                }
            }).
        state('app.signup', {
                url: '/signup',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/sign/signup.html',
                        controller: 'signupCtrl'
                    }
                }
            })
            .state('app.profile', {
                url: '/profile',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile/index.html',
                        controller: 'profileCtrl'
                    }
                }
            })
            .state('app.changeemail', {
                url: '/changeemail',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile/changeemail.html',
                        controller: 'profileCtrl'
                    }
                }
            })
            .state('app.changepass', {
                url: '/changepass',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile/changepass.html',
                        controller: 'profileCtrl'
                    }
                }
            })
            .state('app.forgotpass', {
                url: '/forgotpass',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile/forgotpass.html',
                        controller: 'forgotpassCtrl'
                    }
                }
            })
            .state('app.categories', {
                url: '/categories/:idCategory',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/categories/index.html',
                        controller: 'categoriesCtrl'
                    }
                }
            })

        .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search/index.html',
                        controller: 'searchCtrl'
                    }
                }
            })
            .state('app.slidebox', {
                url: '/slidebox/:idImage',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/view/slidebox.html',
                        controller: 'slideboxCtrl'
                    }
                }
            })
            .state('app.comment', {
                url: '/comment/:id1',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/comment.html',
                        controller: 'commentCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    })
    .config(function($ionicConfigProvider) {
        $ionicConfigProvider.navBar.alignTitle('left');
        $ionicConfigProvider.tabs.position('top');
        $ionicConfigProvider.tabs.style('standard');

    })
    .config(function($cordovaAppRateProvider) {

        document.addEventListener("deviceready", function() {

            var prefs = {
                language: 'en',
                appName: 'MY APP',
                iosURL: '<my_app_id>',
                androidURL: anDroidLink,
                windowsURL: windowLink
            };

            $cordovaAppRateProvider.setPreferences(prefs)

        }, false);
    })
    .filter('datePost', function() {
        return function(x) {
            date1 = new Date(x)
            date = new Date();
            var txt = '';
            var y = date - date1;
            if (y < (60 * 1000 * 60)) {
                y = Math.floor(y / 60000);
                txt = y + ' minutes ago';
            }
            if (y > (60 * 1000) && y < (60 * 60 * 1000 * 24)) {
                y = Math.floor(y / (60 * 60 * 1000))
                txt = y + ' hours ago';
            }
            if (y > (60 * 60 * 1000 * 24) && y < 60 * 60 * 1000 * 24 * 30) {
                y = Math.floor(y / (60 * 60 * 1000 * 24))
                txt = y + ' days ago';
            }
            /*if(y>(60*60*1000*24*30)){
                 y = Math.floor(y/(60*60*1000*24*30))
                 txt = y +' mounths ago';
               }*/
            return txt;

        }
    }).filter('dateComment', function() {
        return function(x) {
            date1 = new Date(x)
            date = new Date();
            var txt = '';
            var y = date - date1;
            if (y < (60 * 1000 * 60) && y > 0) {
                y = Math.floor(y / 60000);
                txt = y + ' mins';
            }
            if (y > (60 * 1000) && y < (60 * 60 * 1000 * 24)) {
                y = Math.floor(y / (60 * 60 * 1000))
                txt = y + ' hours';
            }
            if (y > (60 * 60 * 1000 * 24)) {
                y = Math.floor(y / (60 * 60 * 1000 * 24))
                txt = y + ' days';
            }
            /*if(y>(60*60*1000*24*30)){
                 y = Math.floor(y/(60*60*1000*24*30))
                 txt = y +' mounths';
               }*/
            return txt;

        }
    })
    .filter('dateToString', function() {
        return function(x) {
            return x.toDateString();
        }
    })
    .filter('getTime', function() {
        return function(x) {
            var y = new Date(x)
            var z = y.getMinutes();
            if (z.toString().length == 1) {
                z = '0' + z;
            }
            var txt = y.getHours() + ':' + z + ' ' + y.toDateString();
            return txt;
        }
    })
    .directive('detail', function($compile, $parse) {
        return {
            restrict: 'E',
            link: function(scope, element, attr) {
                scope.$watch(attr.content, function() {
                    element.html($parse(attr.content)(scope));
                    $compile(element.contents())(scope);
                }, true);
            }
        }
    });
