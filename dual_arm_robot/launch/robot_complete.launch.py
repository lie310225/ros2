#!/usr/bin/env python3

import os
import sys
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, ExecuteProcess
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    
    pkg_name = 'dual_arm_robot'
    
    urdf_file = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '..',
        'urdf',
        'dual_arm_robot.urdf'
    )
    
    world_file = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '..',
        'worlds',
        'dual_arm_world.world'
    )
    
    rviz_config = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '..',
        'rviz',
        'dual_arm_robot.rviz'
    )
    
    with open(urdf_file, 'r') as infp:
        robot_desc = infp.read()
    
    use_sim_time = LaunchConfiguration('use_sim_time')
    
    declare_use_sim_time_cmd = DeclareLaunchArgument(
        'use_sim_time',
        default_value='true',
        description='Use simulation clock time'
    )
    
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        output='screen',
        parameters=[{
            'robot_description': robot_desc,
            'use_sim_time': use_sim_time
        }]
    )
    
    joint_state_publisher = Node(
        package='joint_state_publisher',
        executable='joint_state_publisher',
        name='joint_state_publisher',
        output='screen',
        parameters=[{
            'robot_description': robot_desc,
            'use_sim_time': use_sim_time
        }]
    )
    
    gazebo_client = ExecuteProcess(
        cmd=['gazebo', '--verbose', world_file, '-s', 'libgazebo_ros_init.so', '-s', 'libgazebo_ros_factory.so'],
        output='screen'
    )
    
    spawn_entity = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-entity', 'dual_arm_robot',
            '-file', urdf_file,
            '-x', '0', '-y', '0', '-z', '0.3',
            '-Y', '0'
        ],
        output='screen'
    )
    
    rviz_node = Node(
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        arguments=['-d', rviz_config],
        output='screen',
        parameters=[{'use_sim_time': use_sim_time}]
    )
    
    ld = LaunchDescription()
    ld.add_action(declare_use_sim_time_cmd)
    ld.add_action(robot_state_publisher)
    ld.add_action(joint_state_publisher)
    ld.add_action(gazebo_client)
    ld.add_action(spawn_entity)
    ld.add_action(rviz_node)
    
    return ld
