#!/usr/bin/env python3
"""
机器人模型验证脚本
检查 URDF 文件的语法和完整性
"""

import sys
import xml.dom.minidom as minidom

def validate_urdf(urdf_file):
    """验证 URDF 文件"""
    try:
        with open(urdf_file, 'r') as f:
            urdf_content = f.read()
        
        doc = minidom.parseString(urdf_content)
        
        print("✓ URDF 文件语法正确")
        
        robot = doc.getElementsByTagName('robot')[0]
        robot_name = robot.getAttribute('name')
        print(f"✓ 机器人名称: {robot_name}")
        
        links = doc.getElementsByTagName('link')
        print(f"✓ 连杆数量: {len(links)}")
        
        joints = doc.getElementsByTagName('joint')
        print(f"✓ 关节数量: {len(joints)}")
        
        print("\n连杆列表:")
        for link in links:
            link_name = link.getAttribute('name')
            print(f"  - {link_name}")
        
        print("\n关节列表:")
        for joint in joints:
            joint_name = joint.getAttribute('name')
            joint_type = joint.getAttribute('type')
            parent = joint.getElementsByTagName('parent')[0].getAttribute('link')
            child = joint.getElementsByTagName('child')[0].getAttribute('link')
            print(f"  - {joint_name} ({joint_type})")
            print(f"    {parent} -> {child}")
        
        print("\n传感器:")
        sensors = doc.getElementsByTagName('sensor')
        for sensor in sensors:
            sensor_name = sensor.getAttribute('name')
            sensor_type = sensor.getAttribute('type')
            print(f"  - {sensor_name} ({sensor_type})")
        
        print("\n插件:")
        plugins = doc.getElementsByTagName('plugin')
        for plugin in plugins:
            plugin_name = plugin.getAttribute('name')
            print(f"  - {plugin_name}")
        
        print("\n✓ URDF 验证完成")
        return True
        
    except Exception as e:
        print(f"✗ URDF 验证失败: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) > 1:
        urdf_file = sys.argv[1]
    else:
        urdf_file = 'urdf/dual_arm_robot.urdf'
    
    print(f"正在验证: {urdf_file}\n")
    success = validate_urdf(urdf_file)
    sys.exit(0 if success else 1)
