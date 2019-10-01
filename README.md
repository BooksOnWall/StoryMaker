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
    //maptoken for mapbox display 
        REACT_APP_MAT=pk.eyJ1IjoiY3JvbGwiLCJhIjoiY2p4cWVmZDA2MDA0aTNkcnQxdXhldWxwZCJ9.3pr6-2NQQDd59UBRCEeenA

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
        BOT_ACTIVE=false
        BOT_TOKEN=812731209:AAHkLo2hnJnnCFrK0XsYvnCR1c43LpOK-Tc
        
    // production using https on both sides with a react application builded 
        SERVER_HOST=bow.animaespacio.org
        SERVER_PROTOCOL=https
        SERVER_PORT=3010
        BOT_ACTIVE=false
        BOT_TOKEN=812731209:AAHkLo2hnJnnCFrK0XsYvnCR1c43LpOK-Tc


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
    
    ### Make bow.service and etc/init.d/bow start | stop 
        $ cp server/tools/bow.service /etc/systemd/system/bow.service
       
    
    `anima@Alerce:/bow/server# cat tools/bow.service 
        [Unit]
        Description=BooksOnWall Server
        After=network.target

        [Service]
        Type=forking
        PIDFile=/var/run/bow/bow.pid
        User=anima
        ExecStart=/etc/init.d/bow start
        ExecStop=/etc/init/d/bow stop
        ExecReload=/etc/init.d/bow restart

        [Install]
        WantedBy=multi-user.target`
        
     $ cp server/slc-initd.sh /etc/init.d/bow
     $ root@Alerce:/home/anima/web/bow.animaespacio.org/public_html/bow/server# cat tools/slc-initd.sh
     `#!/usr/bin/env bash
        #
        # An example init script for running a Node.js process as a service
        # using Strongloop's slc as the process monitor. For more configuration options
        # associated with slc, see: http://docs.strongloop.com/display/public/SLC/slc+run.
        # This script assumes you've installed slc globally with `npm install -g strongloop`.
        #
        # You will need to set the environment variables noted below to conform to
        # your use case, and change the init info comment block.
        #
        # This was written for Debian distributions such as Ubuntu, but should still
        # work on RedHat, Fedora, or other RPM-based distributions, since none
        # of the built-in service functions are used. If you do adapt it to a RPM-based
        # system, you'll need to replace the init info comment block with a chkconfig
        # comment block.
        #
        ### BEGIN INIT INFO
        # Provides:             my-application
        # Required-Start:       $syslog $remote_fs
        # Required-Stop:        $syslog $remote_fs
        # Should-Start:         $local_fs
        # Should-Stop:          $local_fs
        # Default-Start:        2 3 4 5
        # Default-Stop:         0 1 6
        # Short-Description:    My Application
        # Description:          My Application
        ### END INIT INFO
        #
        # This script was adapted from its "forever" version, and is based on:
        # https://gist.github.com/3748766
        # https://github.com/hectorcorrea/hectorcorrea.com/blob/master/etc/forever-initd-hectorcorrea.sh
        # https://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever/

        # Source function library. Note that this isn't used here, but remains to be
        # uncommented by those who want to edit this script to add more functionality.
        # Note that this is Ubuntu-specific. The scripts and script location are different on
        # RPM-based distributions.
        # . /lib/lsb/init-functions

        # The example environment variables below assume that Node.js is
        # installed into /home/node/local/node by building from source as outlined
        # here:
        # https://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever/
        #
        # It should be easy enough to adapt to the paths to be appropriate to a
        # package installation, but note that the packages available for Ubuntu in
        # the default repositories are far behind the times. Most users will be
        # building from source to get a more recent Node.js version.
        #
        # An application name to display in echo text.
        # NAME="My Application"
        # The full path to the directory containing the node and forever binaries.
        # NODE_BIN_DIR=/home/node/local/node/bin
        # Set the NODE_PATH to the Node.js main node_modules directory.
        # NODE_PATH=/home/node/local/node/lib/node_modules
        # The directory containing the application start Javascript file.
        # APPLICATION_DIRECTORY=/home/node/my-application
        # The application start Javascript filename.
        # APPLICATION_START=start-my-application.js
        # Process ID file path.
        # PIDFILE=/var/run/my-application.pid
        # Log file path.
        # LOGFILE=/var/log/my-application.log
        #
        NAME="BooksOnWall"
        NODE_BIN_DIR="/usr/bin"
        NODE_PATH="/usr/lib/node_modules"
        APPLICATION_DIRECTORY="/home/anima/web/bow.animaespacio.org/public_html/bow/server"
        APPLICATION_START="server.js"
        PIDFILE="/var/run/bow/bow.pid"
        LOGFILE="/home/anima/web/bow.animaespacio.org/public_html/bow/server/logs/server.log"

        # Add node to the path for situations in which the environment is passed.
        PATH=$NODE_BIN_DIR:$PATH

        # Export all environment variables that must be visible for the Node.js
        # application process forked by slc. It will not see any of the other
        # variables defined in this script.
        export NODE_PATH=$NODE_PATH
        export NODE_ENV=production

        start() {
            echo "Starting $NAME"
            echo "cd $APPLICATION_DIRECTORY"
            cd $APPLICATION_DIRECTORY
            echo "slc run --detach --cluster cpu --pid $PIDFILE --log $LOGFILE $APPLICATION_START"
            slc run --detach --cluster "cpu" --pid $PIDFILE --log $LOGFILE $APPLICATION_START
            RETVAL=$?
        }

        stop() {
            if [ -f $PIDFILE ]; then
                echo "Shutting down $NAME"
                echo "cd $APPLICATION_DIRECTORY"
                cd $APPLICATION_DIRECTORY
                echo "slc runctl stop"
            slc runctl stop
                # No need to get rid of the pidfile, slc does that for us.
                RETVAL=$?
            else
                echo "$NAME is not running."
                RETVAL=0
            fi
        }

        restart() {
            if [ -f $PIDFILE ]; then
                echo "Restarting $NAME"
                echo "cd $APPLICATION_DIRECTORY"
                cd $APPLICATION_DIRECTORY
                echo "slc runctl restart"
                slc runctl restart
            else
                echo "$NAME isn't currently running.  Starting from scratch ..."
                start
            fi
        }

        status() {
            echo "Status for $NAME:"
            cd $APPLICATION_DIRECTORY
            slc runctl status
            RETVAL=$?
        }

        case "$1" in
            start)
                start
                ;;
            stop)
                stop
                ;;
            status)
                status
                ;;
            restart)
                restart
                ;;
            *)
                echo "Usage: {start|stop|status|restart}"
                exit 1
                ;;
        esac
        exit $RETVAL`
            // then add server on boot 
            start
            $systemctl 
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