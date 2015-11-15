(function(){
   var app = angular.module('app', ['ionic', 'youtube-embed'])

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

  app.controller('mycontroller', function($scope, $http){
    $scope.videos = [];

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
    $http.get('https://www.googleapis.com/youtube/v3/search', {params: $scope.youtubeParams} ).success(function(response){
        angular.forEach(response.items, function(child){
          console.log(child);
          $scope.videos.push(child);
        });
    });


  });
// app.controller('mycontroller', function($scope, $http){
//     $scope.videos = [];

//     $scope.youtubeParams = {
//       key: 'AIzaSyCg-fnWqMviuQBVZSMwjpuRX1nKrKGrZMo',
//       type: 'video',
//       maxResults: '5',
//       part: 'id,snippet',
//       q: '',
//       order: 'date',
//       channelId: 'UCUEi4kiMMcEdLjNfNAqA2rg',
//     }

//     $http.get('https://www.googleapis.com/youtube/v3/search', {params:$scope.youtubeParams}).success(function(response){
//       angular.forEach(response.items, function(child){
//         console.log (child);
//         $scope.videos.push(child);
//       });
//     });

//   });
}());

