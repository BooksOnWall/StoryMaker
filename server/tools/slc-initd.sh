#!/usr/bin/env bash
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
exit $RETVAL
