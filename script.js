var resultView = new Vue({
  el: '#app',
  data: {
  	query: '',
  	results: '',
    artist1: './img/1.jpg',
    artist2: './img/2.jpg',
  },
  methods: {
  	search: function() {
      console.log("Searching for " + this.query + "...");
        axios
          .get('https://itunes.apple.com/search?origin=*&term=' + this.query)
          .then(function (response) {
          	console.log(response);
          	this.results = response.data.results;
          	console.log(results.length);
          })
          .catch(error => console.log(error))
    }
  }
})
