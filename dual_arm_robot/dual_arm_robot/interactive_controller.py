#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import JointState
import sys
import termios
import tty
import select

class InteractiveController(Node):
    def __init__(self):
        super().__init__('interactive_controller')
        
        self.cmd_vel_pub = self.create_publisher(
            Twist,
            '/dual_arm_robot/cmd_vel',
            10
        )
        
        self.joint_pub = self.create_publisher(
            JointState,
            '/dual_arm_robot/joint_commands',
            10
        )
        
        self.get_logger().info('交互式控制器已启动')
        self.get_logger().info('按 q 退出')
        
        self.joint_state = JointState()
        self.left_arm_positions = [0.0, 0.0, 0.0]
        self.right_arm_positions = [0.0, 0.0, 0.0]
        self.gripper_open = True
        
    def publish_cmd_vel(self, linear_x=0.0, linear_y=0.0, angular_z=0.0):
        msg = Twist()
        msg.linear.x = linear_x
        msg.linear.y = linear_y
        msg.angular.z = angular_z
        self.cmd_vel_pub.publish(msg)
    
    def publish_joint_commands(self):
        self.joint_state.header.stamp = self.get_clock().now().to_msg()
        self.joint_state.name = [
            'left_shoulder_joint',
            'left_upper_arm_joint',
            'left_lower_arm_joint',
            'left_finger_left_joint',
            'left_finger_right_joint',
            'right_shoulder_joint',
            'right_upper_arm_joint',
            'right_lower_arm_joint',
            'right_finger_left_joint',
            'right_finger_right_joint',
        ]
        
        gripper_value = 0.2 if self.gripper_open else 0.0
        
        self.joint_state.position = [
            self.left_arm_positions[0],
            self.left_arm_positions[1],
            self.left_arm_positions[2],
            gripper_value,
            -gripper_value,
            self.right_arm_positions[0],
            self.right_arm_positions[1],
            self.right_arm_positions[2],
            gripper_value,
            -gripper_value,
        ]
        
        self.joint_pub.publish(self.joint_state)

def print_controls():
    print("""
========================================
  双机械臂移动机器人 - 交互控制
========================================

移动控制:
  w - 向前移动
  s - 向后移动
  a - 左转
  d - 右转
  x - 停止

左臂控制:
  1 - 左肩关节 +
  2 - 左肩关节 -
  3 - 左上臂 +
  4 - 左上臂 -
  5 - 左下臂 +
  6 - 左下臂 -

右臂控制:
  7 - 右肩关节 +
  8 - 右肩关节 -
  9 - 右上臂 +
  0 - 右上臂 -
  u - 右下臂 +
  i - 右下臂 -

夹爪控制:
  g - 切换夹爪开/闭

其他:
  r - 重置所有关节
  h - 显示帮助
  q - 退出

========================================
""")

def main():
    rclpy.init(args=args)
    controller = InteractiveController()
    
    print_controls()
    
    settings = termios.tcgetattr(sys.stdin)
    
    try:
        while rclpy.ok():
            if select.select([sys.stdin], [], [], 0.1)[0]:
                key = sys.stdin.read(1)
                
                if key == 'q':
                    break
                elif key == 'h':
                    print_controls()
                elif key == 'r':
                    controller.left_arm_positions = [0.0, 0.0, 0.0]
                    controller.right_arm_positions = [0.0, 0.0, 0.0]
                    controller.publish_joint_commands()
                    print("已重置所有关节")
                elif key == 'g':
                    controller.gripper_open = not controller.gripper_open
                    controller.publish_joint_commands()
                    state = "打开" if controller.gripper_open else "关闭"
                    print(f"夹爪: {state}")
                
                elif key in ['w', 's', 'a', 'd', 'x']:
                    if key == 'w':
                        controller.publish_cmd_vel(linear_x=0.5)
                        print("向前移动")
                    elif key == 's':
                        controller.publish_cmd_vel(linear_x=-0.5)
                        print("向后移动")
                    elif key == 'a':
                        controller.publish_cmd_vel(angular_z=0.5)
                        print("左转")
                    elif key == 'd':
                        controller.publish_cmd_vel(angular_z=-0.5)
                        print("右转")
                    elif key == 'x':
                        controller.publish_cmd_vel(0.0, 0.0, 0.0)
                        print("停止")
                
                elif key in ['1', '2', '3', '4', '5', '6']:
                    step = 0.1
                    if key == '1':
                        controller.left_arm_positions[0] += step
                        print(f"左肩: {controller.left_arm_positions[0]:.2f}")
                    elif key == '2':
                        controller.left_arm_positions[0] -= step
                        print(f"左肩: {controller.left_arm_positions[0]:.2f}")
                    elif key == '3':
                        controller.left_arm_positions[1] += step
                        print(f"左上臂: {controller.left_arm_positions[1]:.2f}")
                    elif key == '4':
                        controller.left_arm_positions[1] -= step
                        print(f"左上臂: {controller.left_arm_positions[1]:.2f}")
                    elif key == '5':
                        controller.left_arm_positions[2] += step
                        print(f"左下臂: {controller.left_arm_positions[2]:.2f}")
                    elif key == '6':
                        controller.left_arm_positions[2] -= step
                        print(f"左下臂: {controller.left_arm_positions[2]:.2f}")
                    controller.publish_joint_commands()
                
                elif key in ['7', '8', '9', '0', 'u', 'i']:
                    step = 0.1
                    if key == '7':
                        controller.right_arm_positions[0] += step
                        print(f"右肩: {controller.right_arm_positions[0]:.2f}")
                    elif key == '8':
                        controller.right_arm_positions[0] -= step
                        print(f"右肩: {controller.right_arm_positions[0]:.2f}")
                    elif key == '9':
                        controller.right_arm_positions[1] += step
                        print(f"右上臂: {controller.right_arm_positions[1]:.2f}")
                    elif key == '0':
                        controller.right_arm_positions[1] -= step
                        print(f"右上臂: {controller.right_arm_positions[1]:.2f}")
                    elif key == 'u':
                        controller.right_arm_positions[2] += step
                        print(f"右下臂: {controller.right_arm_positions[2]:.2f}")
                    elif key == 'i':
                        controller.right_arm_positions[2] -= step
                        print(f"右下臂: {controller.right_arm_positions[2]:.2f}")
                    controller.publish_joint_commands()
    
    except Exception as e:
        print(f"错误: {e}")
    
    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, settings)
        controller.publish_cmd_vel(0.0, 0.0, 0.0)
        controller.destroy_node()
        rclpy.shutdown()
        print("\n控制器已退出")

if __name__ == '__main__':
    args = None
    main()
