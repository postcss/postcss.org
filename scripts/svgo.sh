#!/usr/bin/env bash

for file in $(node_modules/.bin/staged-files)
do
    if [[ $file == *.svg ]]
    then
	    echo 'Optimizing: ' + $file
    	node_modules/.bin/svgo --enable=removeTitle --enable=removeDesc --precision=2 --multipass $file
    fi

done
