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
        REACT_APP_SERVER_HOST=bow.animaespacio.org
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
    // add a .env file at the root of your main directory 
    // for developpement in localhost for both react client app and Express nodejs server 
        SERVER_HOST=localhost
        SERVER_PROTOCOL=http
        SERVER_PORT=3010

    // production using https on both sides with a react application builded 
        SERVER_HOST=bow.animaespacio.org
        SERVER_PROTOCOL=https
        SERVER_PORT=3010

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
    $ sh build.sh
    
## Production 
    strong-pm https://strong-pm.io/
    strongloop 
        http://strong-pm.io/getting-started/ 
        https://github.com/strongloop/strong-pm
    http://strong-pm.io/prod/
    
    // First install on the server 
    $ npm install -g strong-pm
    Or to deploy and manage remotely, install the manager on a production server using npm:

    $ npm install -g strong-pm && sl-pm-install
    Writing job...
    Service strong-pm installed (/etc/init/strong-pm.conf)


    $ slc start
        Process Manager is attempting to run app `.`.

          To confirm it is started: slc ctl status bowbo
          To view the last logs: slc ctl log-dump bowbo
          To see more options: slc ctl -h
          To see metrics, the profilers and other diagnostic features run: slc arc
    
    // then start
    $ sudo /sbin/initctl start strong-pm
    
    // launch at server start && restart on crash 
    
## Deploy 
### Deploy using git
Build your application
NOTE: This assumes you followed the steps in Use locally on your workstation to install StrongLoop on your workstation and have a Node app to deploy.

Back on your workstation, you're going to build your app for deployment. You can either build an npm package (a .tgz file) or build to a Git branch.

If your project code is in a Git repository, then by default slc build will commit to a 'deploy' branch in Git.
See Committing a build to Git for details.

    $ slc build
        Running `git branch "deploy"`
        Not merging HEAD into `deploy`, already up to date.
        Running `npm install --ignore-scripts`
        Running `npm prune --production`
        Running `git add --force --all .`
        Running `git write-tree`
          => 5da82d501cb26c6661856165424b2518d862418e
        Running `git commit-tree -p "refs/heads/deploy" -m "Commit build products" 5da82d501cb26c6661856165424b2518d862418e`
        Running `git update-ref "refs/heads/deploy" 168f1a132e178e2c0986e3e7cf9057cf04cbc266`
        Committed build products onto `deploy`

### Deploy using ssh and archive

If your project code is not in a Git repository, then by default slc build will build an npm package (a .tgz file).
See Creating a build archive for details.

    $ slc build
    Running `npm install --ignore-scripts`
    Running `npm prune --production`
    Packing application to ../express-example-app-1.0.0.tgz`
    
    //Deploy the production build on an external server
    $ slc build
        Running `npm install --ignore-scripts`
        Running `npm prune --production`
        Packing application to ../bowbo-1.0.0.tgz`
    $ slc deploy http://your.remote.host   