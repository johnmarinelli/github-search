(function() {
  var app = angular.module('githubSearch', []);

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
        queryString += ('&sort=stars&order=desc');

        console.log(queryString);

        return $http({
          method: 'get',
          url: queryString
        });
      },

      searchGithubResults: []
    }
  }]);

  app.controller('SearchController', ['$scope', '$filter', 'Search', function($scope, $filter, Search) {
    var twoWeeksAgo = Date.now() - (1000*60*60*24*14);

    $scope.parameters = { 
      keywords: 'math',
      language: 'ActionScript',
      pushed: '>'+$filter('date')(twoWeeksAgo, 'yyyy-MM-dd'),
      stars: '<=10',
      forks: '<=3'
    };

    $scope.showOptionalParams = false;
    $scope.toggleOptionalParams = function() {
      $scope.showOptionalParams = !$scope.showOptionalParams;
    };

    var handleSearchSuccess = function(data, status) {
      /* clear array */
      while(Search.searchGithubResults.length > 0) Search.searchGithubResults.pop();

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
