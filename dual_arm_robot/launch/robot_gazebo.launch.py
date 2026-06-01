#!/usr/bin/env python3

import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, ExecuteProcess
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    
    pkg_name = 'dual_arm_robot'
    
    urdf_file = os.path.join(
        get_package_share_directory(pkg_name),
        'urdf',
        'dual_arm_robot.urdf'
    )
    
    world_file = os.path.join(
        get_package_share_directory(pkg_name),
        'worlds',
        'dual_arm_world.world'
    )
    
    with open(urdf_file, 'r') as infp:
        robot_desc = infp.read()
    
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        output='screen',
        parameters=[{
            'robot_description': robot_desc,
            'use_sim_time': True
        }]
    )
    
    joint_state_publisher = Node(
        package='joint_state_publisher',
        executable='joint_state_publisher',
        name='joint_state_publisher',
        output='screen',
        parameters=[{
            'robot_description': robot_desc,
            'use_sim_time': True
        }]
    )
    
    gazebo_server = ExecuteProcess(
        cmd=['gazebo', '--verbose', world_file, '-s', 'libgazebo_ros_init.so', '-s', 'libgazebo_ros_factory.so'],
        output='screen',
        shell=False
    )
    
    spawn_robot = Node(
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
    
    return LaunchDescription([
        DeclareLaunchArgument(
            'use_sim_time',
            default_value='true',
            description='Use simulation clock time'
        ),
        
        robot_state_publisher,
        joint_state_publisher,
        
        gazebo_server,
        
        spawn_robot,
    ])
