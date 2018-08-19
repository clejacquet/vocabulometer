#!/bin/bash

function usage {
    echo "Usage:"
    echo -e "\tnew <new-config-filename>"
    echo -e "\t\tCreates a new environment configuration file"
    echo ""
    echo -e "\tget-secrets"
    echo -e "\t\tDisplays a help message on how to get the secret environment configuration files"
}

if [ $# -eq 0 ]
then
    echo "Error: no argument provided"
    usage
    exit 1
fi

while [ $# -gt 0 ]
do
    case $1 in
	"new")
	    shift
	    if [ $# -eq 0 ]
	    then
		echo "Parameter value for 'new' action missing"
		exit 1
	    fi
	    
	    echo "Creating a new environment config file..."
	    FILENAME=$1
	    cp .env-template.sh $FILENAME
	    echo "Done"

	    shift
	    ;;

	"get-secrets")
	    shift
	    echo "As you may have already seen, environment config files contain passwords for database access. For obvious security concerns those files cannot be released on the public Github repository. If you want them please write an email to this address: clem.jacquet@gmail.com"
	    ;;
    esac
done
