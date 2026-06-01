#!/bin/bash

echo "Starting Dual Arm Robot with Gazebo and RVIZ2..."

source /opt/ros/humble/setup.bash

WORKSPACE_PATH="/path/to/your/workspace"
source $WORKSPACE_PATH/install/setup.bash

ros2 launch dual_arm_robot robot.launch.py
