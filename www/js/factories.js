angular.module('app.factories', ['ngResource'])

.factory('YouTube', function($scope, $resource, $q) {

  $scope.youtubeParams = {
    key: 'AIzaSyCg-fnWqMviuQBVZSMwjpuRX1nKrKGrZMo',
    type: 'video',
    maxResults: '5',
    part: 'id,snippet',
    q: tags,
    playlistId: $scope.playlistid,
    order: 'date',
    channelId: 'UCUEi4kiMMcEdLjNfNAqA2rg',
  }
  var videosFound = $resource('https://www.googleapis.com/youtube/v3/playlistItems', {params: $scope.youtubeParams} );
      
  return {
    search: function(query) {
      var q = $q.defer();
      videosFound.load({
        tags: query
      }, function(resp) {
        q.resolve(resp);
      }, function(err) {
        q.reject(err);
      })
      
      return q.promise;
    }
  }
})
;