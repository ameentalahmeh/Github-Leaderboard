const app = require('./app.js');

// Server Running...
app.listen(app.get('port'), () => {
    console.log('Our server running on port', app.get('port'));
});
