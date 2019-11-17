// Modules
const modules = require("./modules.js");

// Routes
// modules.app.use('/data', require('./routes/data.js'));
modules.app.use('/user', require('./routes/user.js'));
modules.app.use('/ig', require('./routes/instagram.js'));
// modules.app.use('/store', require('./routes/store.js'));

// Destroy Connection MySQL
modules.db.on('release', function(connection) {
    // console.log('Connection %d released', connection.threadId);

    connection.destroy();
});

// Response Handling
modules.app.use((rjs, req, res, next) => {
    // console.log(rjs)
    if (rjs.code >= 100 && rjs.code < 600)
        res.status(rjs.code).json(rjs);
    else
        res.status(500);
    // return res.status(rjs.code).json(rjs)
});

// Execute
modules.app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`))