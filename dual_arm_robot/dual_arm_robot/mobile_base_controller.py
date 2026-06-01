#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class MobileBaseController(Node):
    def __init__(self):
        super().__init__('mobile_base_controller')
        
        self.cmd_vel_pub = self.create_publisher(
            Twist,
            '/dual_arm_robot/cmd_vel',
            10
        )
        
        self.timer = self.create_timer(0.1, self.timer_callback)
        
        self.linear_speed = 0.0
        self.angular_speed = 0.0
        self.phase = 0
        
        self.get_logger().info('Mobile Base Controller Started')
    
    def timer_callback(self):
        msg = Twist()
        
        if self.phase == 0:
            msg.linear.x = 0.5
            msg.angular.z = 0.0
            self.get_logger().info('Moving forward', throttle_duration_sec=1.0)
        elif self.phase == 1:
            msg.linear.x = 0.0
            msg.angular.z = 0.5
            self.get_logger().info('Turning', throttle_duration_sec=1.0)
        elif self.phase == 2:
            msg.linear.x = 0.5
            msg.angular.z = 0.0
            self.get_logger().info('Moving forward', throttle_duration_sec=1.0)
        else:
            msg.linear.x = 0.0
            msg.angular.z = -0.5
            self.get_logger().info('Turning', throttle_duration_sec=1.0)
        
        self.cmd_vel_pub.publish(msg)
        
        self.linear_speed += 0.1
        if self.linear_speed > 5.0:
            self.linear_speed = 0.0
            self.phase = (self.phase + 1) % 4

def main(args=None):
    rclpy.init(args=args)
    controller = MobileBaseController()
    
    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        pass
    finally:
        controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
