from setuptools import setup

package_name = 'dual_arm_robot'

setup(
    name=package_name,
    version='1.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        ('share/' + package_name + '/launch',
            ['launch/robot.launch.py',
             'launch/robot_gazebo.launch.py',
             'launch/robot_rviz.launch.py']),
        ('share/' + package_name + '/urdf',
            ['urdf/dual_arm_robot.urdf']),
        ('share/' + package_name + '/worlds',
            ['worlds/dual_arm_world.world']),
        ('share/' + package_name + '/rviz',
            ['rviz/dual_arm_robot.rviz']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='User',
    maintainer_email='user@example.com',
    description='A mobile robot with two robotic arms',
    license='Apache-2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'arm_controller = dual_arm_robot.arm_controller:main',
            'mobile_base_controller = dual_arm_robot.mobile_base_controller:main',
        ],
    },
)
