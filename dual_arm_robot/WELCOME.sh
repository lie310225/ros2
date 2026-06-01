#!/bin/bash

cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║      🎉 欢迎使用双机械臂移动机器人仿真系统 🎉                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📦 项目状态: 已创建完成 ✓

当前环境状态:
⚠️  ROS2 未安装 (需要网络连接)
⚠️  Gazebo 未安装 (需要网络连接)
✓  机器人模型文件已创建
✓  仿真配置文件已创建
✓  启动脚本已创建

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 快速开始:

1️⃣  在有网络的设备上,复制整个 dual_arm_robot 文件夹

2️⃣  设置 ROS2 工作空间:
    
    mkdir -p ~/ros2_ws/src
    cd ~/ros2_ws/src
    cp -r /path/to/dual_arm_robot .
    
3️⃣  安装依赖:
    
    cd ~/ros2_ws
    sudo apt update
    sudo apt install ros-humble-desktop
    sudo apt install gazebo
    sudo apt install ros-humble-gazebo-ros-pkgs
    
4️⃣  构建项目:
    
    colcon build
    source install/setup.bash
    
5️⃣  启动仿真:
    
    ros2 launch dual_arm_robot robot.launch.py
    
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 项目文件清单:

✅ 机器人模型 (URDF)
   └─ urdf/dual_arm_robot.urdf

✅ Gazebo 世界
   └─ worlds/dual_arm_world.world

✅ RVIZ 配置
   └─ rviz/dual_arm_robot.rviz

✅ 启动文件
   ├─ launch/robot.launch.py          (完整仿真)
   ├─ launch/robot_gazebo.launch.py   (仅 Gazebo)
   └─ launch/robot_rviz.launch.py      (仅 RVIZ)

✅ 控制器
   ├─ arm_controller.py               (机械臂控制器)
   ├─ mobile_base_controller.py       (底盘控制器)
   ├─ interactive_controller.py       (交互式控制器)
   └─ robot_test.py                   (测试程序)

✅ 工具脚本
   ├─ install_ros2.sh                 (安装脚本)
   ├─ check_environment.sh           (环境检查)
   ├─ validate_urdf.py                (模型验证)
   └─ start_robot.sh                  (快速启动)

✅ 文档
   ├─ README.md                       (详细文档)
   ├─ QUICK_START_CN.md              (快速入门)
   └─ PROJECT_SUMMARY.md             (项目总结)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 机器人规格:

底盘:
  • 尺寸: 0.8m × 0.6m × 0.15m
  • 重量: 10 kg
  • 驱动: 差分驱动 (4轮)

机械臂 (×2):
  • 自由度: 4 DOF + 夹爪
  • 肩关节: ±180°
  • 上臂: ±90°
  • 下臂: ±90°

传感器:
  • LiDAR: 360°, 10m 范围
  • 相机: 640×480, 30FPS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 使用技巧:

  • 使用交互式菜单:
    python3 launch_menu.py
    
  • 检查环境:
    bash scripts/check_environment.sh
    
  • 验证模型:
    python3 scripts/validate_urdf.py
    
  • 键盘控制底盘:
    ros2 run teleop_twist_keyboard teleop_twist_keyboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 需要帮助?

  1. 查看 README.md 获取详细说明
  2. 查看 QUICK_START_CN.md 获取快速指南
  3. 查看 PROJECT_SUMMARY.md 获取完整总结
  4. 运行 python3 scripts/validate_urdf.py 检查模型

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ 祝您使用愉快! ✨

EOF
