#!/usr/bin/env python3
"""
双机械臂移动机器人 - 启动菜单
提供交互式启动选项
"""

import os
import sys
import subprocess

def clear_screen():
    os.system('clear')

def print_banner():
    print("=" * 60)
    print("     双机械臂移动机器人仿真系统")
    print("     Dual Arm Mobile Robot Simulation")
    print("=" * 60)
    print()

def print_menu():
    print("请选择启动选项:")
    print()
    print("  [1] 启动完整仿真 (Gazebo + RVIZ2)")
    print("  [2] 仅启动 Gazebo 仿真")
    print("  [3] 仅启动 RVIZ2 可视化")
    print("  [4] 检查环境配置")
    print("  [5] 验证 URDF 模型")
    print("  [6] 运行机器人测试")
    print("  [7] 安装依赖")
    print("  [0] 退出")
    print()

def check_environment():
    print("\n正在检查环境...")
    result = subprocess.run(
        ["bash", "scripts/check_environment.sh"],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    input("\n按 Enter 键继续...")

def validate_urdf():
    print("\n正在验证 URDF...")
    result = subprocess.run(
        ["python3", "scripts/validate_urdf.py", "urdf/dual_arm_robot.urdf"],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print(result.stderr)
    input("\n按 Enter 键继续...")

def install_dependencies():
    print("\n开始安装依赖...")
    print("这可能需要一些时间,请耐心等待...")
    result = subprocess.run(
        ["bash", "scripts/install_ros2.sh"],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print(result.stderr)
    input("\n按 Enter 键继续...")

def launch_robot(option):
    clear_screen()
    print("正在启动机器人仿真...")
    print()
    
    if option == "1":
        print("启动完整仿真 (Gazebo + RVIZ2)...")
        cmd = ["ros2", "launch", "dual_arm_robot", "robot.launch.py"]
    elif option == "2":
        print("启动 Gazebo 仿真...")
        cmd = ["ros2", "launch", "dual_arm_robot", "robot_gazebo.launch.py"]
    elif option == "3":
        print("启动 RVIZ2 可视化...")
        cmd = ["ros2", "launch", "dual_arm_robot", "robot_rviz.launch.py"]
    
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"\n启动失败: {e}")
        print("请确保已正确安装 ROS2 和 Gazebo")
        input("\n按 Enter 键继续...")
    except KeyboardInterrupt:
        print("\n\n已取消启动")

def run_test():
    clear_screen()
    print("正在运行机器人测试...")
    print()
    print("测试内容: 前进、后退、左转、右转、停止")
    print("按 Ctrl+C 停止测试")
    print()
    try:
        subprocess.run(["ros2", "run", "dual_arm_robot", "robot_test"])
    except KeyboardInterrupt:
        print("\n\n测试已停止")
    except Exception as e:
        print(f"\n测试失败: {e}")
        print("请确保已构建并安装包")
    input("\n按 Enter 键继续...")

def main():
    while True:
        clear_screen()
        print_banner()
        print_menu()
        
        try:
            choice = input("请输入选项 [0-7]: ").strip()
        except KeyboardInterrupt:
            print("\n\n再见!")
            sys.exit(0)
        
        if choice == "0":
            print("\n再见!")
            break
        elif choice == "1":
            launch_robot("1")
        elif choice == "2":
            launch_robot("2")
        elif choice == "3":
            launch_robot("3")
        elif choice == "4":
            check_environment()
        elif choice == "5":
            validate_urdf()
        elif choice == "6":
            run_test()
        elif choice == "7":
            install_dependencies()
        else:
            print("\n无效选项,请重新选择")
            input("\n按 Enter 键继续...")

if __name__ == '__main__':
    main()
