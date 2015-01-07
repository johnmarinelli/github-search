(function() {
  var app = angular.module('githubSearch', []);

  var repos = [];

  /* service to call github's api */
  app.factory('Search', ['$http', function($http) {
    return { 
      searchGithub: function(language) {
        /* build query string out of params */
        var queryString = 'https://api.github.com/search/repositories?q=tetris+language:';
        queryString += language;
        queryString += '&sort=starts&order=desc';
        console.log(queryString);
        return $http({
          method: 'get',
          url: queryString
        });
      },

      searchGithubResults: []
    }
  }]);

  app.controller('SearchController', ['$scope', 'Search', function($scope, Search) {
    var handleSearchSuccess = function(data, status) {
      data.items.forEach(function(repo) {
        /* push repos onto Search services' results object */
        Search.searchGithubResults.push(repo);
      });
    };

    $scope.doSearch = function(parameters) {
      /* use Search service to search github */
      Search.searchGithub(parameters.language)
              .success(handleSearchSuccess);
    }
  }]);
  
  app.controller('SearchResultsController', ['$scope', 'Search', function($scope, Search) {
    /* set results to Search services' results object */
    $scope.results.repos = Search.searchGithubResults;
  }]);
})();
