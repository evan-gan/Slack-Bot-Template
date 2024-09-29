#!/bin/bash

# Get the directory of the current script
SCRIPT_DIR=$(dirname "$0")

# Navigate to the project directory
cd "$SCRIPT_DIR"

# Prompt the user to enter a custom name for the tmux session
read -p "Enter a name for the tmux session: " session_name

# Check if a tmux session with the entered name already exists
if tmux has-session -t "$session_name" 2>/dev/null; then
    echo "A tmux session with the name '$session_name' already exists. Please choose a different name."
    exit 1
fi

# Define the command to start the Node.js server
start_command='npm start'

# Start the Node.js server using tmux with the custom session name
tmux new-session -d -s "$session_name" "$start_command"

echo "Node.js server started in tmux session '$session_name' with command: $start_command."
