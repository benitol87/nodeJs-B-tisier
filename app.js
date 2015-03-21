var express        = require('express'),
   session         = require('express-session'),
   cookieParser    = require('cookie-parser'),
   bodyParser      = require('body-parser'), //pour récuperer les résultats des post
   handlebars  	  = require('express-handlebars'), hbs,
	 http = require('http'),
	 path = require('path');
	 //fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 6800);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: 'nC0@#1pM/-0qA1+é',
    name: 'Betisier',
    // store: sessionStore, // connect-mongo session store
    // proxy: true,
    resave: true,
    saveUninitialized: true
}));

// secure : true pour httpS
app.use(function(request, response, next){
       response.locals.session = request.session;
       //console.log(res.locals.session);
       next();
});
/* express-handlebars - https://github.com/ericf/express-handlebars
A Handlebars view engine for Express. */
hbs = handlebars.create({
   defaultLayout: 'main', // nom de la page par defaut ici main.handlebars

   partialsDir: ['views/partials/'],
   helpers: {
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
// voir exemple utilisation dans listerVilles.handlebars
   ifCond : function (v1, operator, v2, options) {

      switch (operator) {
          case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
      }
  }
}
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// send app to router
require('./router/router')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});