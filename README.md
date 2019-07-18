# Install 
    $ git clone git@git.pulsar113.org:BooksOnWall/BooksOnWall_BackOffice.git
    $ cd BooksOnWall_BackOffice
    $ yarn 
    // add a .env file at the root of your main directory 
    // for developpement in localhost for both react client app and Express nodejs server 
        REACT_APP_SERVER_HOST=localhost
        REACT_APP_SERVER_PROTOCOL= http
        REACT_APP_SERVER_PORT=3010
    // production using https on both sides with a react application builded 
        REACT_APP_SERVER_HOST=bow.animaespacio.org/
        REACT_APP_SERVER_PROTOCOL= https
        REACT_APP_SERVER_PORT=3010

    $ yarn start 
# Server 
    $ cd server 
    $ yarn 
    // create conf/mysql.conf from conf/mysql.conf.default 
    $ cp conf/mysql.js.default conf/mysql.js
    // open mysql.conf and set mysql db credentials
      database: 'test_sequelize',
      username: 'root',
      password: '',
      dialect: 'mysql',
    // generate https certificates for express server 
    $ openssl req -nodes -new -x509 -keyout server.key -out server.cert
    // launch the server 
    $ node server.js 
    
## Server Nodemon 
   Actually, for development, I would recommend we use nodemon, this would always restart our app as soon as 
   we make any change(s) to the file(s), so let’s install it and save it as a dev dependency.
    $ yarn add --dev  nodemon
    After then, we can run the app like so:
    $ nodemon server.js
    
## Build
    $ yarn build 
    put this .htaccess file inside your deploy or build directory 
    .htaccess

    RewriteEngine on
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
