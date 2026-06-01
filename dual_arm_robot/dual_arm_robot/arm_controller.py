#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import JointState
import math

class ArmController(Node):
    def __init__(self):
        super().__init__('arm_controller')
        
        self.joint_pub = self.create_publisher(
            JointState,
            '/dual_arm_robot/joint_commands',
            10
        )
        
        self.timer = self.create_timer(0.1, self.timer_callback)
        
        self.joint_state = JointState()
        self.time = 0.0
        
        self.get_logger().info('Arm Controller Started')
    
    def timer_callback(self):
        self.time += 0.1
        
        self.joint_state.header.stamp = self.get_clock().now().to_msg()
        
        left_shoulder = 0.5 * math.sin(self.time)
        left_upper = 0.3 * math.sin(self.time * 0.5)
        left_lower = 0.3 * math.cos(self.time * 0.5)
        
        right_shoulder = 0.5 * math.cos(self.time)
        right_upper = 0.3 * math.cos(self.time * 0.5)
        right_lower = 0.3 * math.sin(self.time * 0.5)
        
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
        
        self.joint_state.position = [
            left_shoulder,
            left_upper,
            left_lower,
            0.1,
            -0.1,
            right_shoulder,
            right_upper,
            right_lower,
            0.1,
            -0.1,
        ]
        
        self.joint_pub.publish(self.joint_state)

def main(args=None):
    rclpy.init(args=args)
    controller = ArmController()
    
    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        pass
    finally:
        controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
