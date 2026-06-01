================================
 快速启动指南
================================

1. 安装依赖
   bash dual_arm_robot/scripts/install_ros2.sh

2. 构建包
   cd ~/ros2_ws
   colcon build
   source install/setup.bash

3. 启动仿真
   ros2 launch dual_arm_robot robot.launch.py

================================
 项目文件结构
================================

dual_arm_robot/
├── urdf/dual_arm_robot.urdf      # 机器人模型 (URDF)
├── worlds/dual_arm_world.world   # Gazebo 世界
├── rviz/dual_arm_robot.rviz     # RVIZ 配置
├── launch/
│   ├── robot.launch.py          # 主启动文件
│   ├── robot_gazebo.launch.py   # 仅 Gazebo
│   └── robot_rviz.launch.py     # 仅 RVIZ
├── dual_arm_robot/
│   ├── arm_controller.py         # 机械臂控制器
│   └── mobile_base_controller.py # 移动底盘控制器
├── scripts/
│   ├── install_ros2.sh          # 安装脚本
│   └── start_robot.sh           # 快速启动
└── README.md                     # 详细文档

================================
 机器人规格
================================

底盘:
  - 尺寸: 0.8m x 0.6m x 0.15m
  - 重量: 10 kg
  - 驱动: 差分驱动 (4轮)

机械臂 (x2):
  - 自由度: 4 DOF + 夹爪
  - 肩关节: -180° 到 180°
  - 上臂: -90° 到 90°
  - 下臂: -90° 到 90°
  - 夹爪: 可调节开合

传感器:
  - LiDAR: 360° 扫描, 10m 范围
  - 相机: 640x480 @ 30 FPS

================================
 常用命令
================================

# 查看话题
ros2 topic list

# 查看节点
ros2 node list

# 订阅激光扫描
ros2 topic echo /dual_arm_robot/scan

# 发布速度命令
ros2 topic pub /dual_arm_robot/cmd_vel geometry_msgs/Twist '{linear: {x: 0.5}, angular: {z: 0.0}}'

# 启动键盘控制
ros2 run teleop_twist_keyboard teleop_twist_keyboard

# 启动 RVIZ
rviz2

# 查看 TF 树
ros2 run rqt_tf_tree rqt_tf_tree

# 关节状态
ros2 topic echo /dual_arm_robot/joint_states

================================
 ROS2 话题
================================

发布:
  /dual_arm_robot/scan              # 激光扫描
  /dual_arm_robot/odom              # 里程计
  /dual_arm_robot/joint_states      # 关节状态
  /dual_arm_robot/camera/image_raw  # 相机图像
  /dual_arm_robot/camera/depth      # 深度图像

订阅:
  /dual_arm_robot/cmd_vel           # 速度命令

================================
 注意事项
================================

1. 确保 ROS2 环境已 source
   source /opt/ros/humble/setup.bash

2. 确保 Gazebo 模型路径正确
   export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/ros2_ws/src/dual_arm_robot

3. 如果 Gazebo 启动慢,耐心等待

4. 检查 URDF 语法
   check_urdf urdf/dual_arm_robot.urdf

5. 可视化 TF
   ros2 run rqt_tf_tree rqt_tf_tree

================================
