#!/bin/bash

set -e

echo "================================"
echo "Installing ROS2 and Gazebo for Dual Arm Robot"
echo "================================"

echo "Step 1: Installing ROS2 Humble (if not already installed)..."

if command -v ros2 &> /dev/null; then
    echo "ROS2 is already installed"
else
    echo "Installing ROS2 Humble..."
    
    sudo apt update
    sudo apt install -y software-properties-common
    sudo add-apt-repository universe
    sudo apt install -y curl gnupg lsb-release
    
    sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo gpg --dearmor -o /usr/share/keyrings/ros-archive-keyring.gpg
    
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
    
    sudo apt update
    sudo apt install -y ros-humble-desktop
    
    echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
fi

echo "Step 2: Installing Gazebo..."

if command -v gazebo &> /dev/null; then
    echo "Gazebo is already installed"
else
    echo "Installing Gazebo Harmonic..."
    
    sudo apt update
    sudo apt install -y gazebo
    
    sudo sh -c "echo 'deb http://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main' > /etc/apt/sources.list.d/gazebo-stable.list"
    wget https://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -
    sudo apt update
    sudo apt install -y gazebo
fi

echo "Step 3: Installing Gazebo ROS packages..."

sudo apt install -y ros-humble-gazebo-ros-pkgs ros-humble-gazebo-ros2-control

echo "Step 4: Installing additional dependencies..."

sudo apt install -y \
    ros-humble-robot-state-publisher \
    ros-humble-joint-state-publisher \
    ros-humble-xacro \
    python3-colcon-common-extensions

echo "Step 5: Building the dual_arm_robot package..."

cd /path/to/your/workspace
colcon build
source install/setup.bash

echo "================================"
echo "Installation complete!"
echo "================================"
echo ""
echo "To launch the robot with Gazebo and RVIZ2, run:"
echo "  ros2 launch dual_arm_robot robot.launch.py"
echo ""
echo "To launch only Gazebo:"
echo "  ros2 launch dual_arm_robot robot_gazebo.launch.py"
echo ""
echo "To launch only RVIZ2:"
echo "  ros2 launch dual_arm_robot robot_rviz.launch.py"
