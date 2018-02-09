angular.module('starter.controllers', ['ngSanitize'])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicPopup, $ionicSideMenuDelegate, $ionicHistory, $http, $localStorage, $state, $window, $cordovaCamera, $rootScope) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
         $scope.$storage = $localStorage.$default({ font: 'fontnormal', search: [{ id: '', name: '', format: '' }], notification: [{ title: '', id: '', body: '', date: '' }] });
        $scope.loginData = {};
        $scope.data = [];
        $scope.font = {}
        $scope.imageProfile;
        // $scope.$storage.$reset();
        if (angular.isDefined($localStorage.font)) $scope.font.v = $localStorage.font;
        else $scope.font.v = $localStorage.font;
        // Create the login modal that we will use later
        // console.log($localStorage.notification);
        // template show

        //----------log out--------------------

        $scope.showLogOut = function() {
                var myLogout = $ionicPopup.confirm({
                    template: '<p style="text-align:center !important;">Are you sure to logout?</p>'
                })
                myLogout.then(function(res) {
                    if (res) {
                        //do somethin
                       delete $localStorage.login;
						$localStorage.checkSingn = false;
						setTimeout(function(){window.location = "index.html";},1000);
                    } else {
                        //do something
                    }
                })
            }
            //text-size
        $rootScope.showTextSize = function() {
            var myPopup1 = $ionicPopup.show({
                templateUrl: 'templates/option/textsize.html',
                title: 'Text Size',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    onTap: function(e) {}
                }, {
                    text: 'Ok',
                    onTap: function(e) {
                        $localStorage.font = $scope.font.v;
                        $localStorage.$apply();
                        $rootScope.fontSize = $scope.font.v;
                    }
                }]
            })
        }
        $rootScope.showAlert = function(template) {
            var alertPopup = $ionicPopup.alert({
                template: template
            });
        }
        $scope.share = function() {
			if(ionic.Platform.isAndroid())
			window.plugins.socialsharing.share(null,null,null,"https://play.google.com/store/apps/details?id="+android_packageName);
			else window.plugins.socialsharing.share(null,null,null,"https://itunes.apple.com/app/id"+apple_id+"?mt=8");
        }
        $scope.goProfile = function() {
            if ($localStorage.login == undefined) {
                $state.go('app.signup');
            } else {
                $state.go('app.profile');
            }
        }
        $rootScope.getInfoUser = function() {
            $http.post($scope.url + '/wp-json/mobiconnector/user/get_info?username=' + $localStorage.login.user).then(function(res) {
                $rootScope.dataUser = res.data;
                $rootScope.imageProfile = res.data.wp_user_avatar;
                $rootScope.emailUser = res.data.user_email;
                $rootScope.displayName = res.data.nickname;
            })
        }
        if (angular.isDefined($localStorage.login) && $localStorage.login.user) {
            $rootScope.getInfoUser();
        }
        // Open the login modal
        // Perform the login action when the user submits the login form
        //-----------------------share---------------------------
        $scope.parentId = [];
        $scope.dataCategory = [];
        $rootScope.d = {};
        $rootScope.d.c = true;
        $http.get($scope.url + '/wp-json/wp/v2/categories?orderby=id&&per_page=100').then(function(res) {
            $scope.length = res.data.length;
            angular.copy(res.data, $scope.dataCategory);
        })


        //sign
        $scope.signIn = function() {
            if (!$localStorage.login) {
                $state.go('app.signin', {}, { reload: true });
            }
        }

    })
    //  -------------Post Controller------------------------
    .controller('postCtrl', function($scope, $http, $rootScope, $timeout, $ionicScrollDelegate) {
        $scope.data = {};
        $scope.topNew = [];
        $scope.topFeature = [];
        $scope.page = 1;
        $scope.page1 = 1;
        $rootScope.latest = [];
        $rootScope.maxLatest = 0;
        $http.get($scope.hostName, {
            params: { 'page': $scope.page }
        }).then(function(response) {
            $rootScope.maxLatest = response.data[0].id;
            console.log('response.data[0].id', response.data[0].id);
        });
        $scope.loadMore = function(isRefreshing) {
            $http.get($scope.hostName, {
                params: { 'page': $scope.page, 'per_page': $scope.per_page, 'order': 'desc' }
            }).then(function(response) {
				if(isRefreshing) {
					$scope.topNew = [];
					$scope.over = false;
				}
				$scope.refreshing = false;
                if (response.data.length == 0) {
                    $scope.over = true;
                }
                angular.forEach(response.data, function(item) {
                    if ($scope.topNew.length > 0) {
                        if ($scope.topNew[$scope.topNew.length - 1].id != item.id) {
                            $scope.topNew.push(item);
                        }
                    } else {
                        $scope.topNew.push(item);

                    }
                })
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.page = $scope.page + 1;
            })
        }
		// doRefresh start
		$scope.doRefresh = function(){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.page = 1;
			$scope.over = true;
			$scope.$apply();
			$scope.refreshing = true;
			$scope.loadMore(true);
		};
		// doRefresh end
    })
    /*------------------Feature-Ctrl-----------------------------*/
    .controller('featureCtrl', function($scope, $http, $ionicScrollDelegate) {
        $scope.page1 = 1;
        $scope.per_page = 10;
        $scope.topFeature = [];
        $scope.loadMore = function(isRefreshing) {
            $http.get($scope.hostName, {
                params: {
                    'page': $scope.page1,
                    'per_page': $scope.per_page,
                    'order': 'desc',
                    'filter[orderby]=': 'post_views'
                }
            }).then(function(response) {
				if(isRefreshing) {
					$scope.topFeature = [];
					$scope.over = false;
				}
				$scope.refreshing = false;
                if (response.data.length == 0) {
                    $scope.over1 = true;
                }

                angular.forEach(response.data, function(item) {
                    $scope.topFeature.push(item);
                })
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.page1 = $scope.page1 + 1;
            })
        }
		// doRefresh start
		$scope.doRefresh = function(){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.page1 = 1;
			$scope.over = true;
			$scope.$apply();
			$scope.refreshing = true;
			$scope.loadMore(true);
		};
		// doRefresh end
    })
    //-----------------Video Controller---------------------------
    .controller('videoCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $http, $rootScope, $localStorage, $ionicScrollDelegate) {
        $scope.page = 1;
        $scope.topVideo = [];
        $scope.loadMore = function(isRefreshing) {
            $http.get($scope.hostName, {
                params: { 'page': $scope.page, 'per_page': $scope.per_page, 'filter[post_format]': 'post-format-video' }
            }).then(function(res) {
				if(isRefreshing) {
					$scope.topVideo = [];
					$scope.over = false;
				}
				$scope.refreshing = false;
                if (res.data.length == 0) {
                    $scope.over = true;
                }
                angular.forEach(res.data, function(item) {
                    $scope.topVideo.push(item);
                })
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.page += 1;
            })
        }
        $scope.$on('share', function(event, data) {
            $scope.maxVideo = data;
            console.log('$scope.maxVideo', $scope.maxVideo);
        });
		// doRefresh start
		$scope.doRefresh = function(){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.page = 1;
			$scope.over = true;
			$scope.$apply();
			$scope.refreshing = true;
			$scope.loadMore(true);
		};
		// doRefresh end
    })
    //--------------------------Photo-Ctrl----------------------------
    .controller('photoCtrl', function($scope, $rootScope, $http, $localStorage, $ionicScrollDelegate) {
        $scope.page = 1;
        $scope.topImage = [];
        $scope.loadMore = function(isRefreshing) {
            $http.get($scope.hostName, {
                params: { 'page': $scope.page, 'per_page': $scope.per_page, 'filter[post_format]': 'post-format-image' }
            }).then(function(res) {
				if(isRefreshing) {
					$scope.topImage = [];
					$scope.over = false;
				}
				$scope.refreshing = false;
                if (res.data.length == 0) {
                    $scope.over = true;
                }
                angular.forEach(res.data, function(item) {
                    $scope.topImage.push(item);
                })
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.page += 1;
            })
        }
        $http.get($scope.hostName, {
            params: { 'per_page': '1', 'filter[post_format]': 'post-format-gallery' }
        }).then(function(response) {
            $scope.dataGallery = response.data;
        })
        $scope.$on('share', function(event, data) {
            $scope.maxPhoto = data;
            console.log('$scope.maxPhoto', $scope.maxPhoto);
        })
		// doRefresh start
		$scope.doRefresh = function(){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.page = 1;
			$scope.over = true;
			$scope.$apply();
			$scope.refreshing = true;
			$scope.loadMore(true);
		};
		// doRefresh end
    })

//---------------------------Details controller---------------------------

.controller('detailsCtrl', function($scope, $rootScope, $ionicPopup, $cordovaToast, $ionicTabsDelegate, $timeout, $ionicModal, $stateParams, $http, $sce, $localStorage, $state, $ionicHistory, $ionicScrollDelegate) {
		
		if(angular.isUndefined($localStorage.bookMark)) $localStorage.bookMark ={};
	   var link = $scope.url
        var data = {};
        $scope.data1 = [];
        $scope.test = function() {
            $scope.ch = true;
        }
        $scope.page = 1;
        $scope.over = false;
        $scope.id = parseInt($stateParams.idPost);
        $scope.booked = false;
        $scope.font = {};
        $scope.font.v = $localStorage.font;
        $scope.$sce = $sce;
        $scope.dataIncategory = [];
		if(angular.isDefined($localStorage.bookMark[$scope.id])) $scope.booked = true;
        // select tab
        $scope.selectTab = function(id) {
                $ionicTabsDelegate.$getByHandle('my-tab').select(id);
            }
        $scope.openLink = function(link) {
            if (open_link_inappbrowser) cordova.InAppBrowser.open(link, '_blank', 'location=yes');
            else cordova.InAppBrowser.open(link, '_system', 'location=yes');
            return false;
        };
        $scope.showLoad();
        $http.get($scope.url + '/wp-json/mobiconnector/post/counter_view?post_id=' + $scope.id).then(function(res) {});
        $http.get($scope.hostName + '/' + $scope.id).then(function(res) {
            console.log(res.data);
            $scope.idCate = res.data.categories[0];
            var tmp = document.createElement('div');
            tmp.innerHTML = res.data.content.rendered;
            var iframe = tmp.querySelectorAll('iframe');
            //dùng for lặp các thẻ iframe
            for (var i = 0; i < iframe.length; i++) {
                //nếu đường dẫn thẻ iframe từ Youtube
                if (iframe[i].src.indexOf("youtube.com") != -1) {
                    //thêm đối số enablejsapi=1 vào đường dẫn thẻ iframe để kích hoạt jsapi Youtube
                    if (iframe[i].src.split('?').length > 1) iframe[i].src += "&enablejsapi=1";
                    else iframe[i].src += "?enablejsapi=1";
                }
            }

            var a = tmp.querySelectorAll('a');
            for (var i = 0; i < a.length; i++) {
                var href = a[i].getAttribute("href");
                if (href.match('link://')) {
                    if (href.match('link://posts')) {
                        var index = a[i].getAttribute("href").search('s/');
                        var id = href.substring(index + 2, href.length);
                        var attributes = "app.details({idPost:" + id + "})";
                        a[i].setAttribute("ui-sref", attributes);
                    }
                    if (href.match('link://category')) {
                        var index = a[i].getAttribute("href").search('y/');
                        var id = href.substring(index + 2, href.length);
                        var attributes = "app.categories({idCategory:" + id + "})";
                        a[i].setAttribute("ui-sref", attributes);
                    }
                    if (href.match('link://bookmark')) {
                        var attributes = "app.bookmark";
                        a[i].setAttribute("ui-sref", attributes);
                    }
                    if (href.match('link://bookmark/video')) {
                        var attributes = "app.bookmark";
                        var attributes1 = "selectTab(2)";
                        a[i].setAttribute("ui-sref", attributes);
                        a[i].setAttribute("ng-click", "attributes1");
                    }
                    if (href.match('link://bookmark/photo')) {
                        var attributes = "app.bookmark";
                        var attributes1 = "selectTab(1)";
                        a[i].setAttribute("ui-sref", attributes);
                        a[i].setAttribute("ng-click", "attributes1");
                    }
                    if (href.match('link://about-us') || href.match('link://term-and-conditions')) {
                        var attributes = "app.term";
                        a[i].setAttribute("ui-sref", attributes);
                    }
                } else {
                    var attributes = "openLink('" + a[i].getAttribute('href') + "')";
                    a[i].setAttribute("ng-click", attributes);
                    a[i].setAttribute("href", "javascipt:void(0)");
                }
            }
            res.data.content.rendered = tmp.innerHTML;

            // var tmp = document.createElement('div');
            // tmp.innerHTML = res.data.content.rendered;
            // var a = tmp.querySelectorAll('a');
            // for (var i = 0; i < a.length; i++) {
            //     var attributes = "openApp("+a[i].getAttribute('href')+",_system)";
            //     a[i].setAttribute("ng-click", attributes);
            //     console.log(a[i]);
            // }
            // res.data.content.rendered = tmp.innerHTML;
            $scope.detailsData = res.data;
			console.log($scope.detailsData);
            $scope.totalCommnet = res.data.mobiconnector_comments.length;
            data = res.data;
            angular.forEach($scope.dataIncategory, function(item) {
                $http.get($scope.hostName + '/' + item.ID).then(function(res) {
                    $scope.data1.push(res.data);
                })
            })
            $scope.hideLoad();
        })
        $scope.$on('$stateChangeStart', function(event, toState, toParams) {
            //biến iframe là mảng tất cả các thẻ iframe trong nội dung bài viết
            var iframe = document.querySelectorAll('iframe');
            //dùng for lặp các thẻ iframe
            for (var i = 0; i < iframe.length; i++) {
                //nếu đường dẫn thẻ iframe từ Youtube
                if (iframe[i].src.indexOf("youtube.com") != -1) {
                    //postMessage để chạy func tắt video
                    iframe[i].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            }
        });

        $scope.share = function() {
            window.plugins.socialsharing.share(null, null, null, data.link);
        }
        $scope.bookmark = function() {
            if($scope.booked){
				delete $localStorage.bookMark[$scope.id];
				$scope.booked = false;
				window.plugins.toast.showShortBottom('Remove from Bookmark');
			} else {
				$localStorage.bookMark[$scope.id] = true;
				console.log($localStorage.bookMark[$scope.id]);
				$scope.booked = true;
				// window.plugins.toast.showShortBottom('Bookmark success');
			}
        }
          $scope.loadMore = function() {
            $http.get($scope.url+'/wp-json/wp/v2/posts?categories='+$scope.idCate, {
                params: {
                    'page':$scope.page,
                    'per_page': 10
                }
            }).then(function(response) {
                if (response.data.length == 0) {
                    $scope.over = true;
                }

                angular.forEach(response.data, function(item) {
                    $scope.data1.push(item);
                })
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.page = $scope.page + 1;
            })
        }
        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };
		////////////////////////////
		// Swipe-drag-slideDetail
		$scope.onDrag = function(e){
			switch(e.gesture.direction){
				case "left":
					if(Math.abs(e.gesture.deltaX) > 5 && Math.abs(e.gesture.deltaY) < 50){
						if($scope.detailsData.mobiconnector_next_id){
							$ionicHistory.currentView($ionicHistory.backView());
							$state.go('app.details', {idPost:$scope.detailsData.mobiconnector_next_id}, {location:'replace'});
						}
					}
					break;
				case "right":
					if(Math.abs(e.gesture.deltaX) > 5 && Math.abs(e.gesture.deltaY) < 50){
						if($scope.detailsData.mobiconnector_previous_id){
							$ionicHistory.currentView($ionicHistory.backView());
							$state.go('app.details', {idPost:$scope.detailsData.mobiconnector_previous_id}, {location:'replace'});
						}
					}
					break;
			}
		};
		////////////////////////////
    })
    ///------------------book-mark-------------------------
.controller('bookmarkCtrl', function($scope, $localStorage, $http, $state, $ionicTabsDelegate, $window) {
		if (angular.isUndefined($localStorage.bookMark)) $localStorage.bookMark = {};
		if($localStorage.bookMark && angular.isObject($localStorage.bookMark)){
			$scope.include = [];
			angular.forEach($localStorage.bookMark, function(value, key){
				$scope.include.push(key);
			});
			$scope.include = $scope.include.join(",");
			var removeVideo = [];
			$scope.arrayID = [];
			$scope.arrremoveImage = [];
			var i;
			$scope.y = false;
			$scope.checkY = function(id) {
				$scope.arrayID.push(id);
				console.log($scope.arrayID);
				$scope.y = !$scope.y;
			}
			$scope.showcheckbox = false;
			$scope.share = function(link) {
				window.plugins.socialsharing.share(null, null, null, link);
			}
			$scope.getBookmark = function() {
				$scope.showLoad();
				$http.get(url+'/wp-json/wp/v2/posts',{params:{"include":$scope.include}}).then(function(res) {
					$scope.bookNews = res.data;
					$scope.hideLoad();
				})
			}
			// console.log($scope.include);
			if ($scope.include != ''){
				$scope.getBookmark();
			} 
			// $scope.getBookmark();
			$scope.removeNews = function(id) {
				angular.forEach($localStorage.bookMark, function(items,key){
						if (key == id)delete $localStorage.bookMark[key];
					});
				$state.reload();
			}
			$scope.removeVideo = function(name, id) {
				if (name == true) {
					removeVideo.push(id);
				} else {
					i = removeVideo.indexOf(id);
					removeVideo.splice(i, 1);
				}
				if (removeVideo.length > 0) {
					$scope.showdelete = true;
				} else {
					$scope.showdelete = false;
				}
			}
			$scope.removeImage = function(name, id) {
				if (name == true) {
					$scope.arrremoveImage.push(id);
					console.log($scope.arrremoveImage);
				} else {
					i = $scope.arrremoveImage.indexOf(id);
					$scope.arrremoveImage.splice(i, 1);
				}
				if ($scope.arrremoveImage.length > 0) {
					$scope.showdelete = true;
				} else {
					$scope.showdelete = false;
				}
			}

			function remove1(str, a) {
				var x = [];
				for (var i = 0; i < a.length; i++) {
					if (a[i] != str) {
						x.push(a[i]);
					}
				}
				return x;
			}

			$scope.deleteBook = function() {
				var t = $ionicTabsDelegate.$getByHandle('my-tab').selectedIndex();
				if (t == 2) {
					// console.log('1');
					angular.forEach($localStorage.bookMark, function(items,key){
						angular.forEach( $scope.arrayID, function(item){
							if (key == item) delete $localStorage.bookMark[key];
						});
					});
					$state.reload();
				}
				removeVideo = [];
				if (t == 1) {
					angular.forEach($localStorage.bookMark, function(items,key){
						angular.forEach( $scope.arrremoveImage, function(item){
							if (key == item) delete $localStorage.bookMark[key];
						});
					});
					$state.reload();
				}
			}

			$scope.showCheckBox = function() {
				$scope.showcheckbox = !$scope.showcheckbox;
			}
		}
		
    })
    /*----------------------help--------------------------*/
    .controller('helpCtrl', function($scope, $ionicPopup, $cordovaAppRate) {
        $scope.rateApp = function() {
            if (ionic.Platform.isAndroid())
                cordova.InAppBrowser.open("market://details?id=" + android_packageName, "_system");
            else cordova.InAppBrowser.open("itms-apps://itunes.apple.com/app/id" + apple_id + "?mt=8", "_system");
        };
    })
    //--------------------------Categories----------------------------///

.controller('categoriesCtrl', function($scope, $rootScope, $http, $ionicLoading, $stateParams) {
        $scope.id = $stateParams.idCategory;
        $rootScope.childCategory = [];
        $scope.maxCategory = [];
        $scope.data = [];
        $scope.page = 1;
        $scope.data1 = [];
        $scope.over = false;
        $scope.checkCategory = function(id) {
            var childId = [];
            angular.forEach($scope.dataCategory, function(item) {
                if (item.parent == id) {
                    childId.push(item.id)
                }
            })
            if (childId.length > 0) {
                $scope.e = true;
                var id1 = childId.toString();
                $rootScope.d.c = false;
                $http.get($scope.url + '/wp-json/wp/v2/categories?include=' + id1).then(function(res) {
                    $rootScope.childCategory = res.data;
                })
            }
        }
        $scope.checkCategory($scope.id);
        $http.get($scope.url + '/wp-json/wp/v2/categories/' + $scope.id).then(function(data) {
            $rootScope.dataCate = data.data;
        });
        $scope.loadMore = function(isRefreshing) {
            $http.get($scope.url + '/wp-json/wp/v2/posts?categories=' + $scope.id, {
                params: {
                    'page': $scope.page,
                    'per_page': 10
                }
            }).then(function(response) {
				if(isRefreshing) {
					$scope.data1 = [];
					$scope.over = false;
				}
				$scope.refreshing = false;
                if (response.data.length == 0) {
                    $scope.over = true;
                }

                angular.forEach(response.data, function(item) {
                    $scope.data1.push(item);
                })
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.page = $scope.page + 1;
            })
        }
		$scope.doRefresh = function(){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.page = 1;
			$scope.over = true;
			$scope.$apply();
			$scope.refreshing = true;
			$scope.loadMore(true);
		};

        $scope.$watch('maxCategory', function(newValue, oldValue, scope) {
            if (newValue != oldValue) {
                if ($scope.data.id == newValue[0].categories[0]) {
                    $scope.data1.unshift(newValue[0]);
                }
            }
        });
        $rootScope.$on('share', function(event, data) {
            $scope.maxCategory = data;
        })
    })
    // -------------------Sign-in---------------------------
    .controller('signinCtrl', function($scope, $http, $localStorage, $state, $window, $ionicPopup, $timeout, $ionicHistory, $rootScope) {
        $scope.user = {};
        var template = '<p style="color:red;text-align:center">Account does not exist, or the password provided is incorrect.<p>';
        $scope.change = function(x) {
            if (x.length > 0) {
                $scope.show1 = false;
            }
        }
        $scope.change1 = function(x) {
            if (x.length > 0) {
                $scope.show2 = false;
            }
        }
        $scope.show = false;
        $scope.signIn = function() {

            if ($scope.user.name == undefined || $scope.user.name.length == 0) {
                $scope.show1 = true;
            }
            if ($scope.user.pass == undefined || $scope.user.pass.length == 0) {
                $scope.show2 = true;
            }
            sign();
        }

        function sign() {
            if ($scope.user.name != undefined && $scope.user.pass != undefined && $scope.user.name.length != 0 && $scope.user.pass.length != 0) {
                $scope.showLoad();
                $http.post($scope.url + '/wp-json/jwt-auth/v1/token', {
                    username: $scope.user.name,
                    password: $scope.user.pass
                }, {
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }
                }).then(function(response) {
                    $localStorage.login = response.data;
                    $localStorage.login.user = $scope.user.name;
                    $localStorage.login.pass = $scope.user.pass;
                    console.log($localStorage.login);
                    $scope.getInfoUser();
					$localStorage.checkSingn = true;
					setTimeout(function(){
						window.location = "index.html";
						$scope.hideLoad();
					}, 1000);
                }).catch(function(error) {
                    $scope.hideLoad();
                    $scope.showPopup(template);
                });
            }
        };

    })
    //--------------------------------------Sign-up--------------------------------//
    .controller('signupCtrl', function($scope, $ionicSideMenuDelegate, $http, $ionicLoading, $state, $ionicPopup) {
        $scope.signup = {};
        var userSingnup = $scope.signup.name;
        var passSignUp = $scope.signup.pass;
        var emailSignup = $scope.signup.email;
        var template = '<p style="color:red;text-align:center">Error, Account Has Exists !<p>';
        var template1 = '<p style="text-align:center">Successful Register !<p>';
        $scope.change = function(x) {
            if (x.length > 0) {
                $scope.show2 = false;
            }
        }
        $scope.change1 = function(x) {
            if (x.length > 0) {
                $scope.show3 = false;
            }
        }
        $scope.signUp = function() {
            if ($scope.signup.name == undefined || $scope.signup.name.length == 0) {
                $scope.show1 = true;
            }
            if ($scope.signup.email == undefined || $scope.signup.email.length == 0) {
                $scope.show2 = true;
            }
            if ($scope.signup.pass == undefined || $scope.signup.pass.length == 0) {
                $scope.show3 = true;
            }
            if ($scope.signup.username == undefined || $scope.signup.username.length == 0) {
                $scope.show4 = true;
            }
            if($scope.signup.name) sign1($scope.signup.name.length);
        }

        function sign1(check) {
            if (check > 3 && $scope.signup.name != undefined && $scope.signup.email != undefined && $scope.signup.pass != undefined && $scope.signup.name.length != 0 && $scope.signup.email.length != 0 && $scope.signup.pass.length != 0) {

                $scope.showLoad();
                $http.post($scope.url + '/wp-json/mobiconnector/user/register', {
                    username: $scope.signup.username,
                    password: $scope.signup.pass,
                    email: $scope.signup.email,
                    nickname: $scope.signup.name
                }, {
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                        console.log(str);
                    }
                }).then(function(res) {
                    $scope.showPopup(template1);
                    $scope.hideLoad();
					$state.go('app.signin');
                }).catch(function(error) {
                    $scope.showPopup(template);
                    $scope.hideLoad();
                });
            }

        }
    })
    .controller('changepassCtrl', function($scope, $ionicLoading, $timeout) {})
    /*------------------------Forgot-pass----------------------*/
    .controller('forgotpassCtrl', function($scope, $ionicLoading, $timeout, $http) {
        $scope.forgot = {};
        var template = '<p style="text-align:center">Sucessfully, Please check your email</p>';
        var template1 = '<p style="text-align:center;color:red">Unsucessfully, Please check your email</p>';
        $scope.change = function(x) {
            if (x.length > 0) {
                $scope.show = false;
            }
        }
        $scope.forgotPass = function() {
            if ($scope.forgot.email == undefined || $scope.forgot.email.length == 0) {
                $scope.show = true;
            } else if ($scope.forgot.email != undefined && $scope.forgot.email.length != 0) {
                $scope.showLoad();
                $http.post($scope.url + '/wp-json/mobiconnector/user/forgot_password?username=' + $scope.forgot.email).then(function(res) {
                    $scope.hideLoad();
                    $scope.showPopup(template);
                }).catch(function(error) {
                    $scope.hideLoad();
                    $scope.showPopup(template1);
                });

            }
        }
    })
    ///------------Search------------------
    .controller('searchCtrl', function($scope, $http, $localStorage, $window) {
        var tmp = {};
        $scope.s = {};
        var per_page = 8;
        var page;
        $scope.search = function() {
            $scope.c1 = false;
            $scope.over = false;
            $scope.data = [];
            if (typeof $scope.s.q == 'undefined' || $scope.s.q.length == 0) {
                $scope.keyR = true;
            } else {
                page = 1;
                $scope.showLoad();
                $scope.keyR = false;
                $http.get($scope.hostName, {
                    params: { 'search': $scope.s.q, 'page': page, 'per_page': per_page }
                }).then(function(data) {
                    if (data.data.length == 0) {
                        $scope.c1 = true;
                    }
                    $scope.data = data.data;
                    $scope.c = true;
                    page = 2;
                    $scope.hideLoad();
                })
            }

        }
        $scope.loadMore = function() {
            console.log(page);
            $http.get($scope.hostName, {
                params: { 'search': $scope.s.q, 'page': page, 'per_page': per_page }
            }).then(function(data) {
                if (data.data.length == 0) {
                    $scope.over = true;
                    $scope.c = false;
                }
                angular.forEach(data.data, function(item) {
                    $scope.data.push(item);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
                page = page + 1;
            })

        }
        $scope.$on('share', function(event, data) {
            $scope.newCategory = data;
            console.log('$scope.maxPhoto', $scope.newCategory);
        })
        $scope.addRecentSearch = function(name, id, format) {
            $scope.check = false;
            for (var i = 0; i < $localStorage.search.length; i++) {
                if (name == $localStorage.search[i].name) {
                    $scope.check = true;
                }
            }
            if ($scope.check != true) {
                tmp.name = name;
                tmp.id = id;
                tmp.format = format;
                $localStorage.search.push(tmp);
                tmp = {};
            }
        }
        $scope.deleteSearch = function() {
            delete $localStorage.search;
            $localStorage.search = [' '];
        }
    })
    // ---------------------------Slide---Box----------------------
   .controller('slideboxCtrl', function($scope, $ionicSlideBoxDelegate, $stateParams, $http, $localStorage, $state, $ionicHistory) {
	if (angular.isUndefined($localStorage.bookMark)) $localStorage.bookMark = {};
        $scope.src = [];
        var imgObj = {};
        var bookImage = {};
        var data_link = "";
        $scope.show = false;
        $scope.idImage = parseInt($stateParams.idImage);
		if (angular.isDefined($localStorage.bookMark[$scope.idImage])) $scope.bookmarked = true;
        $scope.share = function() {
            window.plugins.socialsharing.share(null, null, null, data_link);
        }
        $http.get($scope.url + '/wp-json/mobiconnector/post/counter_view?post_id=' + $scope.idImage).then(function(res) {});
        $scope.showLoad();
        $http.get($scope.hostName + '/' + $scope.idImage).then(function(res) {
            $scope.dataImage = res.data;
            data_link = res.data.link;
            var tmp = document.createElement('div');
            tmp.innerHTML = $scope.dataImage.content.rendered;
            var img = tmp.querySelectorAll('img');
            var caption = tmp.querySelectorAll('figcaption');
            for (var i = 0; i < img.length; i++) {
                imgObj.src = img[i].getAttribute('src');
                if (img[i].getAttribute('title') != undefined) {
                    imgObj.title = img[i].getAttribute('title');
                }
                if (img[i].getAttribute('alt') != undefined) {
                    imgObj.alt = img[i].getAttribute('alt');
                }
                if (caption[i] != undefined) {
                    imgObj.caption = caption[i].innerHTML;
                }
                $scope.src.push(imgObj);
                imgObj = {};
                $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
            }
            $scope.hideLoad();
        }, function(e) { $scope.hideLoad() })
        $scope.onSlideChange = function(index) {
            $scope.index = index;
        }
		
        $scope.bookMarkImage = function() {
			if($scope.bookmarked){
				delete $localStorage.bookMark[$scope.idImage];
				$scope.bookmarked = false;
				window.plugins.toast.showShortBottom('Remove from Bookmark');
			} else {
				$localStorage.bookMark[$scope.idImage] = true;
				$scope.bookmarked = true;
				window.plugins.toast.showShortBottom('Bookmark success');
			}
        }
			//Start wipe
			$scope.onRelease = function(e, index){
				if(index != 0 && index != $scope.src.length-1) return;
				switch(e.gesture.direction){
					case "left":
						if(Math.abs(e.gesture.deltaX) > 100 && Math.abs(e.gesture.deltaY) < 50){
							if(index == $scope.src.length-1 && $scope.dataImage.mobiconnector_next_id){
								$ionicHistory.currentView($ionicHistory.backView());
								$state.go('app.slidebox', {id:$scope.dataImage.mobiconnector_next_id});
							}
						}
						break;
					case "right":
						if(Math.abs(e.gesture.deltaX) > 100 && Math.abs(e.gesture.deltaY) < 50){
							if(index == 0 && $scope.dataImage.mobiconnector_previous_id){
								$ionicHistory.currentView($ionicHistory.backView());
								$state.go('app.slidebox', {id:$scope.dataImage.mobiconnector_previous_id});
							}
						}
						break;
				}
			};
			//End swipe
    })

//---------------------------Comment--------------------------
.controller('commentCtrl', function($scope, $http, $stateParams, $localStorage, $state, $ionicPopup, $ionicHistory) {
    var template = '<p style="text-align:center;color:red">Unable to update. Please try again later.</p>';
    var template1 = '<p style="text-align:center">Please enter text</p>';
    var dataLength;
    $scope.idcomment = $stateParams.id1;
    $scope.getComment = function() {
        $scope.showLoad();
        $http.get($scope.url + '/wp-json/wp/v2/comments?post=' + $scope.idcomment + '&order=desc').then(function(res) {
            $scope.dataComment = res.data;
            console.log(res.data);
            $scope.lengthData = $scope.dataComment.length;
            $scope.titleComment = 'Comments ' + $scope.dataComment.length;
            $scope.hideLoad();
        })
    }
    $scope.getComment();
    $scope.sendComment = function() {
        if ($localStorage.login == undefined) {
            $state.go('app.signin');
        } else {
            if (($scope.dataSend == undefined || $scope.dataSend.length == 0)) {
                $scope.showAlert(template1);
            } else {
                $scope.showLoad();
                $http({
                    method: 'POST',
                    url: $scope.url + '/wp-json/wp/v2/comments',
                    data: { 'content': $scope.dataSend, 'post': $scope.idcomment },
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + $localStorage.login.token },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str.join("&"));
                        return str.join("&");
                    }

                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    $scope.getComment();
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    console.log(response.data);
                    $scope.hideLoad();
                    $scope.showAlert(template);
                });
            }
        }
    }

})

//---------------------------------Profile-------------------------
.controller('profileCtrl', function($scope, $http, $localStorage, $state, $cordovaCamera, $window, $ionicPopup, $rootScope) {
        $scope.y = {};
        $scope.x = {};
        $scope.check = $localStorage.checkSingn;
        $scope.y.fullname = $scope.displayName;
        var base64Image;
        var template1 = '<p style="text-align:center;color:red">Unable to update. Please try again later.</p>';
        var template = '<p style="text-align:center">Successful update</p>'
        $scope.change = function(x) {
            if (x.length > 0) {
                $scope.show4 = false;
            }
        }
        $scope.change1 = function(x) {
            if (x.length > 0) {
                $scope.show5 = false;
            }
        }
        $scope.change2 = function(x) {
            if (x.length > 0) {
                $scope.show = false;
            }
        }
        $scope.change3 = function(x) {
            if (x.length > 0) {
                $scope.show1 = false;
            }
        }
        $scope.change4 = function(x) {
            if (x.length > 0) {
                $scope.show2 = false;
            }
        }
        $scope.checkConfirm = function() {
            if ($scope.x.newPass == $scope.x.confirmPass) {
                $scope.checkpass = false;
            }
        }

        //   if($localStorage.login!=undefined){
        //   $http.get($scope.url+'/wp-json/wp/v2/users?username='+$localStorage.login.user).then(function(res){
        //     $scope.data = res.data;
        //     $scope.imageProfile = $scope.data.mobiconnector_local_avatar;
        //     $scope.y.fullname = $localStorage.login.user_display_name;
        //   })
        // }
        $scope.x = {};
        $scope.changeEmail = function() {
            if ($scope.x.emailChange == undefined || $scope.x.emailChange.length == 0) {
                $scope.show = true;
            }
            if ($scope.x.curretpass == undefined || $scope.x.curretpass != $localStorage.login.pass) {
                $scope.show4 = true;
            } else if ($scope.x.emailChange != undefined && $scope.x.curretpass != undefined) {
                $scope.showLoad();
                $http({
                    method: 'POST',
                    url: $scope.url + '/wp-json/mobiconnector/user/update_profile',
                    data: { 'user_email': $scope.x.emailChange },
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + $localStorage.login.token },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str.join("&"));
                        return str.join("&");
                    }

                }).then(function successCallback(response) {
                    $scope.hideLoad();
                    $scope.getInfoUser();
                    $scope.showPopup(template);
                    // this callback will be called asynchronously
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    $scope.showPopup(template1)
                    $scope.hideLoad();
                });
            }
        }
        $scope.changePass = function() {
            if ($scope.x.passCurrent == undefined || $scope.x.passCurrent != $localStorage.login.pass) {
                $scope.show5 = true;
            }
            if ($scope.x.newPass == undefined || $scope.x.newPass.length == 0) {
                $scope.show1 = true;
            }
            if ($scope.x.confirmPass == undefined || $scope.x.confirmPass.length == 0) {
                $scope.show2 = true;
            }
            if ($scope.x.newPass != $scope.x.confirmPass) {
                $scope.checkpass = true;
            }
            changePass();
        }

        function changePass() {
            if ($scope.x.newPass == $scope.x.confirmPass && $scope.x.passCurrent != undefined && $scope.x.newPass != undefined && $scope.x.passCurrent == $localStorage.login.pass && $scope.x.confirmPass.length != 0 && $scope.x.newPass.length != 0) {
                $scope.showLoad();
                $http({
                    method: 'POST',
                    url: $scope.url + '/wp-json/mobiconnector/user/update_profile',
                    data: { 'user_pass': $scope.x.newPass },
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + $localStorage.login.token },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str.join("&"));
                        return str.join("&");
                    }

                }).then(function successCallback(response) {
                    $localStorage.login.pass = $scope.x.newPass;
                    $scope.hideLoad();
                    $scope.showe2(template3);
                    console.log(response);
                    // this callback will be called asynchronously
                }, function errorCallback(response) {
                    // called asynchronously if an error occurso
                    console.log(response);
                    $scope.showe(template1);
                    $scope.hideLoad();
                });
            }

        }
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $scope.getPicture = function() {
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.imageProfile = "data:image/jpeg;base64," + imageData;
                    base64Image = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    // error
                });
            }
        }, false);

        $scope.updateProfile = function() {
            if (base64Image != undefined) {
                $scope.showLoad();
                $http({
                    method: 'POST',
                    url: $scope.url + '/wp-json/mobiconnector/user/update_profile',
                    data: { 'user_profile_picture': base64Image },
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + $localStorage.login.token },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str.join("&"));
                        return str.join("&");
                    }
                }).then(function successCallback(response) {
                    $rootScope.getInfoUser();
                    $scope.hideLoad();
                    // this callback will be called asynchronously
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    $scope.hideLoad();
                });
            }
        }
        $scope.changeFullName = function() {
            $scope.showLoad();
            $http({
                method: 'POST',
                url: $scope.url + '/wp-json/mobiconnector/user/update_profile',
                data: { 'nickname': $scope.y.fullname },
                cache: false,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + $localStorage.login.token },
                withCredentials: true,
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    console.log(str.join("&"));
                    return str.join("&");
                }

            }).then(function successCallback(response) {
                $scope.hideLoad();
                $scope.getInfoUser();
                $scope.showPopup(template);
                // this callback will be called asynchronously
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                $scope.hideLoad();
                $scope.showPopup(template1);
            });
        }
    })
    /*---------------------Notification----------------------*/
    .controller('notifiCtrl', function($scope, $localStorage, $rootScope, $ionicPopup, $state) {
        $scope.data = $localStorage.notification;
        $scope.allow = $localStorage.allow;
        $scope.confirm = function(id) {
            var confirm = $ionicPopup.confirm({
                template: '<p style="text-align:center !important;">Are You Sure Delete This Notification?</p>'
            })
            confirm.then(function(res) {
                if (res) {
                    //do somethin
                    deleteNotifi(id);
                    $state.reload();
                } else {
                    //do something
                }
            })
        }

        function deleteNotifi(id) {
            for (var i = 0; i < $localStorage.notification.length; i++) {
                if (id == $localStorage.notification[i].id) {
                    console.log($localStorage.notification[i].id)
                    $localStorage.notification.splice(i, 1);
                }
            }
        }
        if (window.plugins) { window.plugins.OneSignal.setSubscription(true); }

        $scope.allowNotifi = function(check) {
            if (window.plugins) { window.plugins.OneSignal.setSubscription(check); }
            $localStorage.allow = check;
            console.log(check);
        }
    })
    .controller('detailsNotifiCtrl', function($scope, $stateParams, $localStorage, $ionicHistory, $ionicPopup, $state, $ionicHistory) {
        if ($localStorage.login != undefined) {
            $scope.user = 'Hi ' + $localStorage.login.user_display_name;
        } else {
            $scope.user = '';
        }
        $scope.idNotifi = $stateParams.idNotifi;
        for (var i = 0; i < $localStorage.notification.length; i++) {
            if ($scope.idNotifi == $localStorage.notification[i].id) {
                $scope.dataNotifi = $localStorage.notification[i];
            }
        }

        function deleteNotifi(id) {

            for (var i = 0; i < $localStorage.notification.length; i++) {

                if (id == $localStorage.notification[i].id) {
                    console.log($localStorage.notification[i].id)
                    $localStorage.notification.splice(i, 1);
                }
            }
        }
        $scope.confirm = function(id) {
            var confirm = $ionicPopup.confirm({
                template: '<p style="text-align:center !important;">Are You Sure Delete This Notification?</p>'
            })
            confirm.then(function(res) {
                if (res) {
                    //do somethin
                    deleteNotifi(id);
                    $state.go('app.notification');
                } else {
                    //do something
                }
            })
        }
    })
    .controller('homeCtrl', function() {
		
		
    });
