var app = new Vue({
  el: '#app',
  data() {
    return {
      query: '',
      results: [],
      genres: [],
      selectedGenres: [],
      playURL: ''
    }
  },
  methods: {
    reset: function() {
      app.results = [];
      app.genres = [];
      app.selectedGenres = [];
    },
  	search: function() {
      app.reset();
      axios
        .get('https://itunes.apple.com/search?origin=*&term=' + this.query)
        .then(function (response) {
        	console.log(response);
          app.results = response.data.results;
          if (app.results.length === 0) {
            alert("No matches found :(");
            return;
          }
        	for (let i = 0; i < app.results.length; i++) {
            app.results[i].id = i;
            app.results[i].descriptionActive = true;
            app.results[i].artistInfo = "";
            app.results[i].loading = false;
            if (app.results[i].artistName === "") {
              app.results[i].artistName = "No information provided";
            }
            if (app.results[i].trackName === "") {
              app.results[i].trackName = "No information provided";
            }
            if (app.results[i].collectionName === "") {
              app.results[i].collectionName = "No information provided";
            }
            if (app.results[i].trackPrice === "") {
              app.results[i].trackPrice = "No information provided";
            }
            if (app.results[i].kind === "") {
              app.results[i].kind = "No information provided";
            }
            if (!app.genres.includes(app.results[i].primaryGenreName)) {
              app.genres.push(app.results[i].primaryGenreName);
            }
          }
        })
        .catch(error => console.log(error))
    },
    toggleGenre: function(g) {
      var index = app.selectedGenres.indexOf(g);
      if (index !== -1) {
        app.selectedGenres.splice(index, 1);
      }
      else {
        app.selectedGenres.push(g);
      }
    },
    toggleDescription: function(id, state) {
      var newboi = app.results[id];
      newboi.descriptionActive = state;
      app.$set(app.results, id, newboi);
      if (state === false) {
        app.artistSearch(id);
      }
    },
    artistSearch: function(id) {
      if (app.results[id].artistInfo !== "") {
        return;
      }
      var newboi = app.results[id];
      newboi.loading = true;
      app.$set(app.results, id, newboi);
      axios
        .get('https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=' + app.results[id].artistName)
        .then(function (response) {
          console.log(response);
          var newboi = app.results[id];
          newboi.loading = false;
          var data = response.data[2][1];
          if (data) {
            newboi.artistInfo = data;
          }
          else newboi.artistInfo = "Sorry, there is no information for this artist!";
          app.$set(app.results, id, newboi);
        })
        .catch(error => console.log(error))
    },
    playSong: function(id) {
      axios
        .get("https://cors-anywhere.herokuapp.com/https://www.google.com/search?origin=*&q=youtube " + app.results[id].artistName.replace(/&/g, "%26") + " " + app.results[id].trackName.replace(/&/g, "%26") + " audio")
        .then(function (response) {
          var pattern = /href="https:\/\/www.youtube.com\/watch\?v=(.*?)[/&"]/;
          var result = pattern.exec(response.data)[1];
          app.playURL = "https://www.youtube.com/embed/" + result + "?autoplay=1";
        })
        .catch(error => console.log(error))
    }
  }
})













