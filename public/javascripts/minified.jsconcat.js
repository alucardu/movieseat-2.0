app=angular.module("movieSeat",["ngMaterial","ngFitText"]),angular.module("movieSeat").factory("movieaddFactory",["$http","$q",function(e,o){var t={};return t.addMovie=function(t){var n=o.defer();return e({method:"POST",url:"/movies",data:t}).success(function(){console.log("success")}).catch(function(){n.reject()}),n.promise},t}]),angular.module("movieSeat").controller("getmovieController",["getmovieFactory","$scope","$filter",function(e,o,t){getmovieFactoryFN=function(){e.getMovies().then(function(e){o.movies=e;var n,r,a,i=e,s=t("orderBy"),c=s(i,"release_date",!0),l=8;for(o.movieGroups=[],n=0,r=c.length;r>n;n+=l)a=c.slice(n,n+l),o.movieGroups.push(a)})},getmovieFactoryFN()}]),angular.module("movieSeat").factory("getmovieFactory",["$http","$q",function(e,o){var t={};return t.getMovies=function(){var t=o.defer();return e({method:"GET",url:"movies"}).success(function(e){t.resolve(e)}).catch(function(){t.reject()}),t.promise},t}]),angular.module("movieSeat").controller("moviesearchCtrl",["movieaddFactory","moviesearchFactory","$scope","$q","$timeout",function(e,o,t,n,r){t.addMovie=function(o){e.addMovie(o).then(function(e){t.movies=e,console.log(t.movies)})},t.showResult=!1,t.createList=function(e){t.showResult=!0,t.searchquery.length>0?(t.showProgress=!0,o.searchMovies(e).then(function(e){function o(){function e(e){return n(function(o){var t=new Image;t.src=e,t.onload=function(){o(t)}})}var o=[];return t.moviesPreload.forEach(function(t){o.push(e(t.pre_load_poster_path))}),n.all(o).then(function(){t.movies=t.moviesPreload,t.showProgress=!1})}t.moviesResponse=e,t.noResult=t.moviesResponse.length>0?!1:!0,t.moviesPreload=[],t.moviesResponse.forEach(function(e){null!==e.poster_path&&(""==e.overview&&(e.overview="No summary available"),t.moviesPreload.push({poster_path:e.poster_path,pre_load_poster_path:"http://image.tmdb.org/t/p/w92"+e.poster_path,title:e.title,release_date:e.release_date,overview:e.overview}))}),o()})):(t.movies=[],t.noResult=!1,t.model={})},t.model={},t.toggleDisplay=function(e){e==t.model.displayedIndex?(t.model.displayedIndex=-1,t.toggleSsomething=!1):(t.model.displayedIndex=e,t.toggleSsomething=!0),r(function(){for(var e=document.getElementsByClassName("container_additional_information"),o=document.getElementsByClassName("additional_info "),t=0;o.length>t;t++)e[t].style.height=Number(o[t].clientHeight)+"px"},25)}}]),angular.module("movieSeat").factory("moviesearchFactory",["$http","$q",function(e,o){var t={};return t.searchMovies=function(t){var n=o.defer();return e({method:"JSONP",url:"http://api.themoviedb.org/3/search/movie?api_key=a8f7039633f2065942cd8a28d7cadad4&query="+encodeURIComponent(t)+"&callback=JSON_CALLBACK"}).success(function(e){n.resolve(e.results)}).catch(function(){n.reject()}),n.promise},t}]);