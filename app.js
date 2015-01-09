(function() {
  var app = angular.module('githubSearch', []);

  var repos = [];

  /* service to call github's api */
  app.factory('Search', ['$http', function($http) {
    return { 
      searchGithub: function(keywords, language, pushed, stars, forks) {
        /* build query string out of params */
        var queryString = 'https://api.github.com/search/repositories?q=';
        queryString += keywords;
        queryString += ('+language:'+language);
        queryString += ('+pushed:'+pushed);
        queryString += ('+stars:'+stars);
        queryString += ('+forks:'+forks);
        queryString += ('&sort=starts&order=desc');
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

    $scope.doSearch = function(p) {
      /* use Search service to search github */
      Search.searchGithub(p.keywords, p.language, p.pushed, p.stars, p.forks)
              .success(handleSearchSuccess);
    }
  }]);
  
  app.controller('SearchResultsController', ['$scope', 'Search', function($scope, Search) {
    /* set results to Search services' results object */
    $scope.results.repos = Search.searchGithubResults;
  }]);
})();
