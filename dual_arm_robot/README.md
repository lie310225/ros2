# Dual Arm Mobile Robot

A ROS2-based mobile robot simulation with two 4-DOF robotic arms, featuring Gazebo simulation and RVIZ2 visualization.

## Robot Description

### Base
- Mobile platform with 4 wheels (differential drive)
- 2 caster wheels for stability
- LiDAR sensor for navigation
- Camera for vision

### Arms
- 2 independent 4-DOF robotic arms
- Each arm has:
  - Shoulder joint (yaw)
  - Upper arm joint (pitch)
  - Lower arm joint (pitch)
  - Gripper with 2 fingers

## Project Structure

```
dual_arm_robot/
├── urdf/
│   └── dual_arm_robot.urdf          # Robot description
├── worlds/
│   └── dual_arm_world.world         # Gazebo world
├── rviz/
│   └── dual_arm_robot.rviz          # RVIZ configuration
├── launch/
│   ├── robot.launch.py              # Full launch (Gazebo + RVIZ)
│   ├── robot_gazebo.launch.py       # Gazebo only
│   └── robot_rviz.launch.py         # RVIZ only
├── scripts/
│   ├── install_ros2.sh              # Installation script
│   └── start_robot.sh               # Quick start script
├── package.xml                       # ROS2 package manifest
└── CMakeLists.txt                   # Build configuration
```

## Installation

### Prerequisites
- Ubuntu 22.04 (Jammy) or 24.04 (Noble)
- ROS2 Humble or later

### Steps

1. Install ROS2 Humble:
   ```bash
   wget -c https://raw.githubusercontent.com/ros/rosdistro/master/ros-humble-desktop-setup.bash
   chmod +x ros-humble-desktop-setup.bash
   ./ros-humble-desktop-setup.bash
   ```

2. Install Gazebo:
   ```bash
   sudo apt update
   sudo apt install gazebo
   ```

3. Install Gazebo ROS packages:
   ```bash
   sudo apt install ros-humble-gazebo-ros-pkgs
   ```

4. Create a workspace:
   ```bash
   mkdir -p ~/ros2_ws/src
   cd ~/ros2_ws/src
   ```

5. Copy the package:
   ```bash
   cp -r /path/to/dual_arm_robot ~/ros2_ws/src/
   ```

6. Build the package:
   ```bash
   cd ~/ros2_ws
   colcon build
   source install/setup.bash
   ```

## Usage

### Launch Full Simulation (Gazebo + RVIZ2)

```bash
cd ~/ros2_ws
source install/setup.bash
ros2 launch dual_arm_robot robot.launch.py
```

This will:
- Start Gazebo with the world environment
- Spawn the dual arm robot
- Launch RVIZ2 with robot model visualization
- Start robot state publisher
- Start joint state publisher

### Launch Gazebo Only

```bash
ros2 launch dual_arm_robot robot_gazebo.launch.py
```

### Launch RVIZ2 Only

```bash
ros2 launch dual_arm_robot robot_rviz.launch.py
```

## Robot Control

### Teleoperation with Keyboard

```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard
```

Publishes to `/dual_arm_robot/cmd_vel` topic.

### Joint Control

Use `rqt_robot_steering` or `rqt_joint_trajectory_controller`:
```bash
ros2 run rqt_joint_trajectory_controller rqt_joint_trajectory_controller
```

## Topics

### Published Topics
- `/dual_arm_robot/scan` - LaserScan from LiDAR
- `/dual_arm_robot/odom` - Odometry data
- `/dual_arm_robot/joint_states` - Joint states
- `/dual_arm_robot/camera/image_raw` - Camera image
- `/dual_arm_robot/camera/depth` - Depth image

### Subscribed Topics
- `/dual_arm_robot/cmd_vel` - Velocity commands

### Services
- Various Gazebo services for world manipulation

## URDF Model Details

### Base Link
- Dimensions: 0.8m x 0.6m x 0.15m
- Mass: 10 kg

### Wheels
- Radius: 0.1m
- 4 drive wheels + 2 caster wheels
- Differential drive configuration

### Arms
- Base height: 0.15m
- Shoulder to upper arm: 0.3m
- Upper arm: 0.25m
- Lower arm: 0.25m
- Gripper: 0.1m

### Sensors
- LiDAR: 360° scan, 10m range
- Camera: 640x480, 30 FPS

## Customization

### Modify URDF
Edit `urdf/dual_arm_robot.urdf` to:
- Change dimensions
- Adjust joint limits
- Add/remove links
- Modify colors and materials

### Modify World
Edit `worlds/dual_arm_world.world` to:
- Add obstacles
- Change lighting
- Add more models
- Modify ground plane

### Modify RVIZ Config
Edit `rviz/dual_arm_robot.rviz` to:
- Change display layout
- Add/remove displays
- Adjust camera views

## Troubleshooting

### Gazebo doesn't start
```bash
export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/ros2_ws/src/dual_arm_robot
gazebo
```

### Robot model doesn't appear
Check if the URDF is valid:
```bash
check_urdf ~/ros2_ws/src/dual_arm_robot/urdf/dual_arm_robot.urdf
```

### Joints not moving
Check joint state publisher:
```bash
ros2 topic echo /dual_arm_robot/joint_states
```

## License

Apache 2.0

## Authors

Your Name <your.email@example.com>
