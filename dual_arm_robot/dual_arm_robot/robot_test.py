#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import math

class RobotTest(Node):
    def __init__(self):
        super().__init__('robot_test')
        
        self.cmd_vel_pub = self.create_publisher(Twist, '/dual_arm_robot/cmd_vel', 10)
        self.timer = self.create_timer(0.5, self.test_callback)
        
        self.test_phase = 0
        self.test_count = 0
        
        self.get_logger().info('机器人测试程序已启动')
        self.get_logger().info('测试顺序:')
        self.get_logger().info('1. 前进')
        self.get_logger().info('2. 后退')
        self.get_logger().info('3. 左转')
        self.get_logger().info('4. 右转')
        self.get_logger().info('5. 停止')
    
    def test_callback(self):
        msg = Twist()
        
        if self.test_phase == 0:
            msg.linear.x = 0.5
            self.get_logger().info('测试 1/5: 前进', throttle_duration_sec=2.0)
        elif self.test_phase == 1:
            msg.linear.x = -0.5
            self.get_logger().info('测试 2/5: 后退', throttle_duration_sec=2.0)
        elif self.test_phase == 2:
            msg.angular.z = 0.5
            self.get_logger().info('测试 3/5: 左转', throttle_duration_sec=2.0)
        elif self.test_phase == 3:
            msg.angular.z = -0.5
            self.get_logger().info('测试 4/5: 右转', throttle_duration_sec=2.0)
        else:
            msg.linear.x = 0.0
            msg.angular.z = 0.0
            self.get_logger().info('测试 5/5: 停止', throttle_duration_sec=2.0)
        
        self.cmd_vel_pub.publish(msg)
        
        self.test_count += 1
        if self.test_count % 4 == 0:
            self.test_phase = (self.test_phase + 1) % 5

def main(args=None):
    rclpy.init(args=args)
    test_node = RobotTest()
    
    try:
        rclpy.spin(test_node)
    except KeyboardInterrupt:
        pass
    finally:
        stop_msg = Twist()
        test_node.cmd_vel_pub.publish(stop_msg)
        test_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
