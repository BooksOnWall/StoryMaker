# Install 
    $ git clone git@git.pulsar113.org:BooksOnWall/BooksOnWall_BackOffice.git
    $ cd BooksOnWall_BackOffice
    $ yarn 
    $ yarn start 
# Server 
    $ cd server 
    // open server.js and set mysql db credentials
    `const sequelize = new Sequelize({
      database: 'test_sequelize',
      username: 'root',
      password: '',
      dialect: 'mysql',
    });`
    // launch the server 
    $ node server.js 
## Server Nodemon 
   Actually, for development, I would recommend we use nodemon, this would always restart our app as soon as 
   we make any change(s) to the file(s), so let’s install it and save it as a dev dependency.
    $ yarn add --dev  nodemon
    After then, we can run the app like so:
    $ nodemon server.js
