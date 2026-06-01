# 双机械臂移动机器人项目总结

## 项目概述

本项目创建了一个完整的 ROS2 机器人仿真包，包含：
- **移动底盘**: 差分驱动机器人 (4轮 + 2个万向轮)
- **双机械臂**: 2个4-DOF机械臂 + 夹爪
- **传感器**: LiDAR 激光雷达 + 深度相机
- **仿真环境**: Gazebo 物理仿真 + RVIZ2 可视化

## 文件结构

```
/workspace/dual_arm_robot/
│
├── 📄 package.xml                    # ROS2 包清单
├── 📄 CMakeLists.txt                 # CMake 构建配置
├── 📄 setup.py                       # Python 包配置
│
├── 🤖 urdf/
│   └── dual_arm_robot.urdf          # 机器人 URDF 模型 (核心文件)
│
├── 🌍 worlds/
│   └── dual_arm_world.world         # Gazebo 仿真世界
│
├── 📊 rviz/
│   └── dual_arm_robot.rviz          # RVIZ2 可视化配置
│
├── 🚀 launch/
│   ├── robot.launch.py              # 主启动文件 (完整仿真)
│   ├── robot_gazebo.launch.py       # 仅 Gazebo 启动
│   ├── robot_rviz.launch.py          # 仅 RVIZ 启动
│   └── robot_complete.launch.py     # 完整启动 (备用)
│
├── 📜 dual_arm_robot/
│   ├── __init__.py
│   ├── arm_controller.py             # 机械臂控制器
│   ├── mobile_base_controller.py    # 移动底盘控制器
│   ├── interactive_controller.py     # 交互式控制器
│   └── robot_test.py                 # 机器人测试程序
│
├── 🔧 scripts/
│   ├── install_ros2.sh              # ROS2 + Gazebo 安装脚本
│   ├── start_robot.sh                # 快速启动脚本
│   ├── check_environment.sh         # 环境检查脚本
│   └── validate_urdf.py             # URDF 验证脚本
│
├── 📖 README.md                     # 详细文档 (英文)
├── 📖 QUICK_START_CN.md             # 快速入门指南 (中文)
└── 📖 launch_menu.py               # 交互式启动菜单

总计: 23 个文件
```

## 机器人规格

### 底盘参数
- **尺寸**: 0.8m (长) × 0.6m (宽) × 0.15m (高)
- **重量**: 10 kg
- **驱动方式**: 差分驱动
- **轮子**: 4个主动轮 + 2个万向轮

### 机械臂规格
- **数量**: 2 个独立机械臂
- **自由度**: 4 DOF + 夹爪 (每臂)
- **关节**:
  - 肩关节 (Yaw): ±180°
  - 上臂关节 (Pitch): ±90°
  - 下臂关节 (Pitch): ±90°
  - 夹爪 (Gripper): 可调开合
- **材质**: 铝合金灰色

### 传感器
- **LiDAR**: 
  - 扫描角度: 360°
  - 最大范围: 10m
  - 分辨率: 1°
  - 更新频率: 10Hz
- **相机**:
  - 分辨率: 640×480
  - 更新频率: 30FPS
  - 深度范围: 0.1m - 100m

## ROS2 话题

### 发布的话题
- `/dual_arm_robot/scan` - LaserScan 数据
- `/dual_arm_robot/odom` - 里程计数据
- `/dual_arm_robot/joint_states` - 关节状态
- `/dual_arm_robot/camera/image_raw` - 相机图像
- `/dual_arm_robot/camera/depth` - 深度图像

### 订阅的话题
- `/dual_arm_robot/cmd_vel` - 速度命令 (Twist)

## 使用方法

### 方法 1: 使用启动菜单 (推荐)
```bash
cd ~/ros2_ws
source install/setup.bash
cd /path/to/dual_arm_robot
python3 launch_menu.py
```

### 方法 2: 直接启动
```bash
# 完整仿真 (Gazebo + RVIZ2)
ros2 launch dual_arm_robot robot.launch.py

# 仅 Gazebo
ros2 launch dual_arm_robot robot_gazebo.launch.py

# 仅 RVIZ
ros2 launch dual_arm_robot robot_rviz.launch.py
```

### 方法 3: 分步启动
```bash
# 1. 启动 Gazebo
gazebo worlds/dual_arm_world.world

# 2. 启动机器人状态发布器
ros2 run robot_state_publisher robot_state_publisher

# 3. 启动 RVIZ
rviz2 -d rviz/dual_arm_robot.rviz

# 4. 在 Gazebo 中手动添加机器人模型
```

## 控制方法

### 1. 键盘控制移动底盘
```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard
```

### 2. 运行交互式控制器
```bash
ros2 run dual_arm_robot interactive_controller
```
控制选项:
- `w/s/a/d` - 移动/转向
- `1-6` - 控制左臂关节
- `7-0, u-i` - 控制右臂关节
- `g` - 切换夹爪
- `r` - 重置所有关节

### 3. 运行自动测试
```bash
ros2 run dual_arm_robot robot_test
```

## 安装步骤

### 前提条件
- Ubuntu 22.04 (Jammy) 或 24.04 (Noble)
- ROS2 Humble 或更新版本
- Gazebo

### 快速安装
```bash
# 1. 克隆或复制本包到工作空间
cd ~/ros2_ws/src
cp -r /path/to/dual_arm_robot .

# 2. 安装依赖
cd ~/ros2_ws
rosdep install --from-paths src --ignore-src -r -y

# 3. 构建包
colcon build

# 4. 加载环境
source install/setup.bash

# 5. 检查环境
bash dual_arm_robot/scripts/check_environment.sh

# 6. 启动仿真
ros2 launch dual_arm_robot robot.launch.py
```

## 自定义选项

### 修改机器人模型
编辑 `urdf/dual_arm_robot.urdf`:
- 调整尺寸参数
- 修改关节限位
- 更改颜色和材质
- 添加/删除连杆

### 修改仿真世界
编辑 `worlds/dual_arm_world.world`:
- 添加障碍物
- 调整光照
- 添加更多物体
- 修改地面材质

### 修改 RVIZ 显示
编辑 `rviz/dual_arm_robot.rviz`:
- 调整显示布局
- 添加/删除显示项
- 更改视角

## 故障排除

### 问题 1: Gazebo 无法启动
**解决方案**:
```bash
export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/ros2_ws/src/dual_arm_robot
gazebo
```

### 问题 2: 机器人模型不显示
**解决方案**:
```bash
# 检查 URDF 语法
python3 scripts/validate_urdf.py

# 检查 Gazebo 插件
ros2 service list | grep spawn
```

### 问题 3: 关节不动
**解决方案**:
```bash
# 检查关节状态发布
ros2 topic echo /dual_arm_robot/joint_states

# 检查控制器
ros2 node list
```

### 问题 4: 权限错误
**解决方案**:
```bash
chmod +x scripts/*.sh
chmod +x scripts/*.py
chmod +x dual_arm_robot/*.py
```

## 性能优化建议

1. **提高仿真精度**
   ```xml
   <!-- 在 world 文件中调整 -->
   <max_step_size>0.001</max_step_size>
   <real_time_update_rate>1000</real_time_update_rate>
   ```

2. **降低计算负载**
   ```xml
   <!-- 减少 LiDAR 扫描点数 -->
   <samples>180</samples>
   ```

3. **使用 GPU 加速**
   ```bash
   export LIBGL_ALWAYS_SOFTWARE=1
   gazebo
   ```

## 扩展功能

### 添加更多传感器
在 URDF 中添加:
```xml
<link name="ultrasonic_sensor">
  <sensor type="sonar" name="ultrasonic">
    <pose>0 0 0 0 0 0</pose>
    <update_rate>10</update_rate>
    <ray>
      <range>
        <min>0.02</min>
        <max>2.0</max>
      </range>
    </ray>
    <plugin name="gazebo_ros_range" filename="libgazebo_ros_range.so">
      <ros>
        <namespace>robot</namespace>
        <remapping>range:=scan_ultra</remapping>
      </ros>
    </plugin>
  </sensor>
</link>
```

### 添加自定义控制器
参考 `dual_arm_robot/arm_controller.py` 实现自定义控制逻辑

## 技术支持

如遇到问题:
1. 查看终端错误信息
2. 运行 `scripts/check_environment.sh`
3. 验证 URDF: `python3 scripts/validate_urdf.py`
4. 查看详细日志

## 许可证

Apache 2.0

## 版本历史

- **v1.0.0** (2026-06-01)
  - 初始版本
  - 完整的双机械臂移动机器人
  - Gazebo 和 RVIZ2 集成
  - 多种控制器和测试工具

## 致谢

本项目基于:
- ROS2 Humble
- Gazebo Harmonic
- URDF 机器人描述格式
- Gazebo-ROS 集成

---

**注意**: 本项目创建于网络受限环境,所有文件已准备好,在有网络的设备上可以立即使用。

**下一步**: 按照 README.md 或 QUICK_START_CN.md 的说明进行安装和使用。
