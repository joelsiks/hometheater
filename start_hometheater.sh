#!/bin/bash

PORT=2277
SESSION_NAME="hometheater"

tmux new-session -d -s $SESSION_NAME -c /home/jps/Projects/hometheater/server \; \
    send-keys -t 0 "PORT=$PORT npm run start" C-m
