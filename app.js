(function() {
  var app = angular.module('githubSearch', []);

  var repos = [];

  /* service to call github's api */
  app.factory('Search', ['$http', function($http) {
    return { 
      searchGithub: function(keywords, language, pushed, stars, forks) {
        /* build query string out of params */
        var queryString = 'https://api.github.com/search/repositories?q=';

        pushed = '>2014-12-01';
        stars = '<=10';
        forks = '<=3';

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
    $scope.showOptionalParams = false;
    $scope.toggleOptionalParams = function() {
      $scope.showOptionalParams = !$scope.showOptionalParams;
    };

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
    $scope.results.repos = Search.searchGithubResults;    
  }]);
})();

(function() {
  var app = angular.module('frontend', []);

  /* language dropdown in search */
  app.directive('languageDropdown', function() {
    return {
      restrict: 'E',
      templateUrl: 'language_dropdown.html'
    };
  });
}());

var app = angular.module('Search', ['githubSearch', 'frontend']);
