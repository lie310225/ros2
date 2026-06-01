#!/bin/bash

echo "==================================="
echo "ROS2 环境检查"
echo "==================================="
echo ""

echo "1. 检查 ROS2 安装..."
if command -v ros2 &> /dev/null; then
    echo "   ✓ ROS2 已安装"
    ros2 --version
else
    echo "   ✗ ROS2 未安装"
    echo "   请运行: bash scripts/install_ros2.sh"
fi
echo ""

echo "2. 检查 Gazebo 安装..."
if command -v gazebo &> /dev/null; then
    echo "   ✓ Gazebo 已安装"
    gazebo --version | head -n 1
else
    echo "   ✗ Gazebo 未安装"
    echo "   请运行: bash scripts/install_ros2.sh"
fi
echo ""

echo "3. 检查 RVIZ2 安装..."
if command -v rviz2 &> /dev/null; then
    echo "   ✓ RVIZ2 已安装"
else
    echo "   ✗ RVIZ2 未安装"
    echo "   请运行: bash scripts/install_ros2.sh"
fi
echo ""

echo "4. 检查 ROS2 包..."
if [ -f "install/setup.bash" ]; then
    echo "   ✓ dual_arm_robot 包已构建"
    source install/setup.bash
    ros2 pkg list | grep dual_arm_robot && echo "   ✓ 包已安装" || echo "   ✗ 包未安装"
else
    echo "   ✗ 包未构建"
    echo "   请运行: colcon build"
fi
echo ""

echo "5. 检查 URDF 文件..."
if [ -f "urdf/dual_arm_robot.urdf" ]; then
    echo "   ✓ URDF 文件存在"
else
    echo "   ✗ URDF 文件不存在"
fi
echo ""

echo "6. 检查 Gazebo 世界文件..."
if [ -f "worlds/dual_arm_world.world" ]; then
    echo "   ✓ Gazebo 世界文件存在"
else
    echo "   ✗ Gazebo 世界文件不存在"
fi
echo ""

echo "7. 检查 RVIZ 配置..."
if [ -f "rviz/dual_arm_robot.rviz" ]; then
    echo "   ✓ RVIZ 配置文件存在"
else
    echo "   ✗ RVIZ 配置文件不存在"
fi
echo ""

echo "8. 环境变量检查..."
if [ -n "$ROS_DISTRO" ]; then
    echo "   ✓ ROS_DISTRO=$ROS_DISTRO"
else
    echo "   ✗ ROS_DISTRO 未设置"
fi

if [ -n "$GAZEBO_MODEL_PATH" ]; then
    echo "   ✓ GAZEBO_MODEL_PATH 已设置"
else
    echo "   ! GAZEBO_MODEL_PATH 未设置 (可能影响 Gazebo)"
fi
echo ""

echo "==================================="
echo "检查完成"
echo "==================================="
echo ""
echo "如果所有检查都通过,您可以运行:"
echo "  ros2 launch dual_arm_robot robot.launch.py"
echo ""
echo "如果有问题,请运行:"
echo "  bash scripts/install_ros2.sh"
