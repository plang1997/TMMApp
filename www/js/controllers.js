angular.module('app.controllers', ['youtube-embed', 'ngResource', 'ngCordova'])

.controller('AppController', function($scope, $state){
  $scope.searchTMM = function(){
    $state.go('app.search');
  }

})

// .controller('TwitterController', function($scope, $ionicPlatform, $ionicPopup, $twitterApi, $cordovaOauth) {

//   var twitterKey = 'twitterkey';
//   var clientId = '1Ne9yMei016JuAUvOyAM6NB7V';
//   var clientSecret = 'y78voa6mP34vn63SY3JKhHlPiagnIih2Gw1flvmQP9NmHSa5xE';
//   var myToken = '';
//   var options = {"redirect_uri":"http://tinyurl.com/krmpchb"};
 
//   $scope.tweet = {};
   
//   $ionicPlatform.ready(function() {

//     myToken = JSON.parse(window.localStorage.getItem(twitterKey));
//     if (myToken === '' || myToken === null) {
//       $cordovaOauth.twitter(clientId, clientSecret, options).then(function (succ) {
//         myToken = succ;     
//         window.localStorage.setItem(twitterKey, JSON.stringify(succ));
//         $twitterApi.configure(clientId, clientSecret, succ);
//         $scope.showHomeTimeline();
//       }, function(error) {
//             var alertPopup = $ionicPopup.alert({
//       title : error,
//       template : 'Not Authorized'
//     });
//         console.log(error);
//       });
//     } else {
//       $twitterApi.configure(clientId, clientSecret, myToken);
//       $scope.showHomeTimeline();
//     }
//   });

//   $scope.showHomeTimeline = function() {
//     $twitterApi.getHomeTimeline().then(function(data) {
//       $scope.home_timeline = data;
//     });
//   };
 
//   $scope.submitTweet = function() {
//     $twitterApi.postStatusUpdate($scope.tweet.message).then(function(result) {
//       $scope.showHomeTimeline();
//     });
//   }
   
//   $scope.doRefresh = function() {
//     $scope.showHomeTimeline();
//     $scope.$broadcast('scroll.refreshComplete');
//   };
   
//   $scope.correctTimestring = function(string) {
//     return new Date(Date.parse(string));
//   };

// })

.controller('BlogController', function($scope, $http){
  //WordPress intergation
  $scope.posts = [];
    
  $scope.getPosts = function() {
    var wordpressUrl = "https://public-api.wordpress.com/rest/v1.1/sites/tmmmarcuslang.wordpress.com/posts";

    $http.get(wordpressUrl)
    .success(function(response){
      console.log("Reveived getPosts via HTTP: ", response, status);
      angular.forEach(response.posts, function(child){
        $scope.posts.push(child);
      });
    })
    .error(function(response, status){
      console.log("Error while received response. " + status + response);
    });
  }

  $scope.doRefresh = function() {
    $scope.posts = [];
    $scope.getPosts();
    //$scope.todos.unshift({name: 'Incoming todo ' + Date.now()})
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$apply()

  }

  $scope.getPosts();

})

.controller('HomeController', function($scope, $http, $ionicPopup, $timeout, $ionicPlatform){
  $scope.videos = [];
  $scope.nextPageToken = {};
  $scope.prevPageToken = {};
  $scope.nextVis = false;

  $scope.shareAnywhere = function(video) {
    console.log(video);
    //$cordovaSocialSharing.share($scope.data.message, video.title, null, "https://www.youtube.com/watch?v=" + video.id.videoId);
  }

  $scope.playerVars = {
    rel: 0,
    showinfo: 0,
    modestbranding: 0,
  }

  $scope.youtubeParams = {
    key: 'AIzaSyCg-fnWqMviuQBVZSMwjpuRX1nKrKGrZMo',
    type: 'video',
    maxResults: '5',
    part: 'id,snippet',
    q: '',
    order: 'date',
    channelId: 'UCUEi4kiMMcEdLjNfNAqA2rg',
  }

  $scope.getVideos = function(){
    $http.get('https://www.googleapis.com/youtube/v3/search', {params: $scope.youtubeParams} ).success(function(response){
        angular.forEach(response.items, function(child){
          console.log(child);
          $scope.videos.push(child);
        });
        $scope.nextPageToken = response.nextPageToken;
        $scope.nextVis = $scope.nextPageToken ? true : false;
    });
  }

  $scope.getNextPage = function(){
      $scope.youtubeParams["pageToken"] = $scope.nextPageToken;
      $scope.getVideos();
      $scope.$broadcast('scroll.infiniteScrollComplete');
  }

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    console.log(toState);
    if($scope.nextVis && toState.name == 'app.home'){
      $scope.getNextPage();
    }
  });

  $scope.getVideos();

})

.controller('PlaylistsController', function($scope, $http, $state){

  $scope.gotoPlaylist = function(id){
    console.log(id);
    $state.go('app.single', {"playlistid": id});
  }

  $scope.playlists = [];
  $scope.nextPageToken = {};
  $scope.prevPageToken = {};
  $scope.nextVis = false;

  $scope.playerVars = {
    rel: 0,
    showinfo: 0,
    modestbranding: 0,
  }

  $scope.youtubeParams = {
    key: 'AIzaSyCg-fnWqMviuQBVZSMwjpuRX1nKrKGrZMo',
    maxResults: '5',
    part: 'id,snippet',
    channelId: 'UCUEi4kiMMcEdLjNfNAqA2rg',
  }

  $scope.getPlaylists = function(){
    $http.get('https://www.googleapis.com/youtube/v3/playlists', {params: $scope.youtubeParams} ).success(function(response){
        angular.forEach(response.items, function(child){
          console.log(child);
          $scope.playlists.push(child);
        });
        $scope.nextPageToken = response.nextPageToken;
        $scope.nextVis = $scope.nextPageToken ? true : false;
    });
  }

  $scope.getNextPage = function(){
      $scope.youtubeParams["pageToken"] = $scope.nextPageToken;
      $scope.getVideos();
      $scope.$broadcast('scroll.infiniteScrollComplete');
  }

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    console.log(toState);
    if($scope.nextVis && toState.name == 'app.playlists'){
      $scope.getNextPage();
    }
  });

  $scope.getPlaylists();
})

.controller('PlaylistController', function($scope, $http, $stateParams){
  $scope.videos = [];
  $scope.nextPageToken = {};
  $scope.prevPageToken = {};
  $scope.nextVis = false;

  $scope.playlistid = $stateParams.playlistid;

  $scope.playerVars = {
    rel: 0,
    showinfo: 0,
    modestbranding: 0,
  }

  $scope.youtubeParams = {
    key: 'AIzaSyCg-fnWqMviuQBVZSMwjpuRX1nKrKGrZMo',
    type: 'video',
    maxResults: '5',
    part: 'id,snippet',
    q: '',
    playlistId: $scope.playlistid,
    order: 'date',
    channelId: 'UCUEi4kiMMcEdLjNfNAqA2rg',
  }

  $scope.getVideos = function(){
    $http.get('https://www.googleapis.com/youtube/v3/playlistItems', {params: $scope.youtubeParams} ).success(function(response){
        angular.forEach(response.items, function(child){
          console.log(child);
          $scope.videos.push(child);
        });
        $scope.nextPageToken = response.nextPageToken;
        $scope.nextVis = $scope.nextPageToken ? true : false;
    });
  }

  $scope.getNextPage = function(){
      $scope.youtubeParams["pageToken"] = $scope.nextPageToken;
      $scope.getVideos();
      $scope.$broadcast('scroll.infiniteScrollComplete');
  }

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    console.log(toState);
    if($scope.nextVis && toState.name == 'app.home'){
      $scope.getNextPage();
    }
  });

  $scope.getVideos();
})

.controller('SearchController', function($scope, $http){
  $scope.videos = [];
  $scope.nextPageToken = {};
  $scope.prevPageToken = {};
  $scope.nextVis = false;

  $scope.playerVars = {
    rel: 0,
    showinfo: 0,
    modestbranding: 0,
  }

  $scope.youtubeParams = {
    key: 'AIzaSyCg-fnWqMviuQBVZSMwjpuRX1nKrKGrZMo',
    type: 'video',
    maxResults: '10',
    part: 'id,snippet',
    order: 'date',
    channelId: 'UCUEi4kiMMcEdLjNfNAqA2rg',
  }

  $scope.clearSearch = function(){
    $scope.query = "";
  }
  
  $scope.getVideos = function(){
    $scope.youtubeParams['q']=$scope.query;
    $http.get('https://www.googleapis.com/youtube/v3/search', {params: $scope.youtubeParams} ).success(function(response){
        angular.forEach(response.items, function(child){
          console.log(child);
          $scope.videos.push(child);
        });
    });
  }
  
  $scope.search = function() {
    $scope.videos = [];
    $scope.getVideos();
  }

})
;


;