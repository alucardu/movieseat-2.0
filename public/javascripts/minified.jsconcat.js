app=angular.module("movieSeat",["ngMaterial","ngFitText","ui-notification"]),app.config(["NotificationProvider",function(e){e.setOptions({delay:4500,startTop:20,startRight:10,verticalSpacing:20,horizontalSpacing:20,positionX:"right",positionY:"top"})}]),angular.module("movieSeat").factory("movieFactory",["$http","$q",function(e,o){var t={};return t.selectMovie=function(t){var n=o.defer();return e({method:"JSONP",url:"https://api.themoviedb.org/3/movie/"+t.id+"?api_key=a8f7039633f2065942cd8a28d7cadad4&append_to_response=credits,images,videos&callback=JSON_CALLBACK"}).success(function(e){n.resolve(e)}).catch(function(){n.reject()}),n.promise},t.addMovie=function(t){var n=o.defer();return e({method:"POST",url:"/movies",data:t}).success(function(e){n.resolve(e)}).catch(function(){n.reject()}),n.promise},t.removeMovie=function(t){var n=o.defer();return e({method:"DELETE",url:"/movies",data:t,headers:{"Content-Type":"application/json;charset=utf-8"}}).success(function(e){n.resolve(e)}).catch(function(){n.reject()}),n.promise},t}]),angular.module("movieSeat").controller("moviesearchCtrl",["$rootScope","getmovieFactory","movieFactory","moviesearchFactory","$scope","$q","$timeout","Notification",function(e,o,t,n,i,r,a,s){i.addMovie=function(o){t.selectMovie(o).then(function(n){t.addMovie(n),s.success(o.title+" has been added to your watchlist"),i.movies=[],i.overlay=!1,i.searchquery="",e.$broadcast("onAddMovieEvent",o)})},i.$on("onRemoveMovieEvent",function(o,n){t.removeMovie(n).then(function(){s.success(n.title+" has been removed from your watchlist"),e.$broadcast("onRemoveMovieEventUpdate",n)})}),i.closeSearch=function(){i.movies=[],i.overlay=!1,i.searchquery=""},i.overlay=!1,i.showResult=!1,i.createList=function(e){i.overlay=!0,i.showResult=!0,i.searchquery.length>0?(i.showProgress=!0,i.toggleSsomething=!1,n.searchMovies(e).then(function(e){function o(){function e(e){return r(function(o){var t=new Image;t.src=e,t.onload=function(){o(t)}})}var o=[];return i.moviesPreload.forEach(function(t){o.push(e(t.pre_load_poster_path))}),r.all(o).then(function(){i.movies=i.moviesPreload,i.showProgress=!1})}i.moviesResponse=e,i.noResult=i.moviesResponse.length>0?!1:!0,i.moviesPreload=[],i.moviesResponse.forEach(function(e){null!==e.poster_path&&""!==e.release_date&&(""==e.overview&&(e.overview="No summary available"),i.moviesPreload.push({id:e.id,movie_id:e.id,poster_path:e.poster_path,pre_load_poster_path:"http://image.tmdb.org/t/p/w92"+e.poster_path,title:e.title,release_date:e.release_date}))}),o()})):(i.movies=[],i.noResult=!1,i.model={},i.toggleSsomething=!1,i.overlay=!1,i.searchquery="")},i.model={},i.toggleDisplay=function(e){e==i.model.displayedIndex?(i.model.displayedIndex=-1,i.toggleSsomething=!1):(i.model.displayedIndex=e,i.toggleSsomething=!0),a(function(){for(var e=document.getElementsByClassName("container_additional_information"),o=document.getElementsByClassName("additional_info "),t=0;o.length>t;t++)e[t].style.height=Number(o[t].clientHeight)+"px"},25)}}]),angular.module("movieSeat").factory("moviesearchFactory",["$http","$q",function(e,o){var t={};return t.searchMovies=function(t){var n=o.defer();return e({method:"JSONP",url:"https://api.themoviedb.org/3/search/movie?api_key=a8f7039633f2065942cd8a28d7cadad4&query="+encodeURIComponent(t)+"&callback=JSON_CALLBACK"}).success(function(e){n.resolve(e.results)}).catch(function(){n.reject()}),n.promise},t}]),angular.module("movieSeat").controller("getmovieController",["$rootScope","getmovieFactory","$scope","$filter","$q","$timeout",function(e,o,t,n,i,r){t.moviesX=[],t.removeMovie=function(o){t.model.rowIndex=null,t.transition="fadeOut",e.$broadcast("onRemoveMovieEvent",o),r(function(){t.overview=!1,t.movieDetail={},t.movieDetail.backdrop_path="/yqyZLEfSiSeqmn5oRahbOUTUHd9.jpg",t.transition=""},300)},getmovieFactoryFN=function(){o.getMovies().then(function(e){function o(){function e(e){return i(function(o){var t=new Image;t.src=e,t.onload=function(){o(t)}})}var o=[];return t.moviesPreload.forEach(function(t){o.push(e("http://image.tmdb.org/t/p/w500"+t.poster_path))}),i.all(o).then(function(){t.movies=t.moviesPreload;var e,o,i,r=n("orderBy"),a=r(t.movies,"release_date",!0),s=8;for(t.movieGroups=[],e=0,o=a.length;o>e;e+=s)i=a.slice(e,e+s),t.movieGroups.push(i);t.loadingWatchlist=!0})}t.moviesX=e,t.moviesPreload=e,t.loadingWatchlist=!1,o()})},getmovieFactoryFN(),t.$on("onAddMovieEvent",function(e,o){t.moviesX.push(o),t.movieGroups=[];var i,r,a,s=n("orderBy"),c=s(t.moviesX,"release_date",!0),u=8;for(i=0,r=c.length;r>i;i+=u)a=c.slice(i,i+u),t.movieGroups.push(a)}),t.$on("onRemoveMovieEventUpdate",function(e,o){var i=t.moviesX.indexOf(o);t.moviesX.splice(i,1),t.movieGroups=[];var r,a,s,c=n("orderBy"),u=c(t.moviesX,"release_date",!0),l=8;for(r=0,a=u.length;a>r;r+=l)s=u.slice(r,r+l),t.movieGroups.push(s)}),t.model={},t.toggleRow=function(e,o){if(t.movieDetail==o)return t.model.rowIndex=null,t.transition="fadeOut",r(function(){t.overview=!1,t.movieDetail={},t.movieDetail.backdrop_path=o.backdrop_path,t.transition=""},300),void 0;e!==t.model.rowIndex&&(t.model.rowIndex=e);var n=document.getElementById("movie_details_container");angular.element(n).hasClass("fadeIn")?(t.overview=!0,t.transition="fadeOut",r(function(){t.movieDetail=o,t.transition="fadeIn"},300)):(t.transition="fadeIn",t.overview=!0,t.movieDetail=o)},t.close=function(){t.model.rowIndex=null,t.transition="fadeOut",r(function(){t.overview=!1,t.movieDetail={},t.movieDetail.backdrop_path="/yqyZLEfSiSeqmn5oRahbOUTUHd9.jpg",t.transition=""},300)}}]),angular.module("movieSeat").factory("getmovieFactory",["$http","$q",function(e,o){var t={};return t.getMovies=function(){var t=o.defer();return e({method:"GET",url:"movies"}).success(function(e){t.resolve(e)}).catch(function(){t.reject()}),t.promise},t}]),angular.module("movieSeat").factory("authFactory",["$http","identityFactory","$q",function(e,o,t){return{authenticateUSer:function(n,i){var r=t.defer();return e.post("/login",{username:n,password:i}).then(function(e){e.data.success?(o.currentUser=e.data.user,r.resolve(!0)):r.resolve(!1)}),r.promise}}}]),angular.module("movieSeat").factory("identityFactory",function(){return{currentUser:void 0,isAuthenticated:function(){return!!this.currentUser}}}),angular.module("movieSeat").controller("loginCtrl",["$scope","$http","Notification","identityFactory","authFactory",function(e,o,t,n,i){e.identity=n,e.signIn=function(e,o){i.authenticateUSer(e,o).then(function(e){e?t.success("You have logged in"):t.error("Incorrect username/password combination")})}}]);