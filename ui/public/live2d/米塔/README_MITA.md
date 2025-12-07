# 米塔 Live2D 模型配置说明

## ✨ 模型信息

- **模型名称**: 米塔 (Mita)
- **作者**: bilibili 三缘绘工坊
- **路径**: `/public/live2d/米塔/`
- **配置文件**: `3.model3.json`

## 😊 表情系统

已为米塔模型创建了 **7 种表情**：

| 表情名称 | 文件 | 说明 | 控制按钮 |
|---------|------|------|---------|
| **default** | `exp_default.exp3.json` | 默认中性表情 | 😐 默认 |
| **smile** | `exp_smile.exp3.json` | 温和微笑 | 😊 微笑 |
| **happy** | `exp_happy.exp3.json` | 开心大笑 | 😄 开心 |
| **sad** | `exp_sad.exp3.json` | 悲伤难过 | 😢 悲伤 |
| **surprised** | `exp_surprised.exp3.json` | 惊讶吃惊 | 😲 惊讶 |
| **angry** | `exp_angry.exp3.json` | 生气不满 | 😠 生气 |
| **wink** | `exp_wink.exp3.json` | 闭眼/眨眼 | 😉 闭眼 |

### 表情参数说明

每个表情通过控制以下参数实现：

- `ParamMouthForm` - 嘴部形状（微笑/皱眉）
- `ParamMouthOpenY` - 嘴部张开程度
- `ParamEyeLOpen` / `ParamEyeROpen` - 左右眼开闭
- `ParamEyeLSmile` / `ParamEyeRSmile` - 左右眼微笑程度
- `ParamBrowLY` / `ParamBrowRY` - 左右眉毛上下位置
- `ParamBrowLForm` / `ParamBrowRForm` - 左右眉毛形状

### 如何添加新表情

1. **创建表情文件**（如 `exp_custom.exp3.json`）：

```json
{
    "Type": "Live2D Expression",
    "FadeInTime": 0.5,
    "FadeOutTime": 0.5,
    "Parameters": [
        {
            "Id": "ParamMouthForm",
            "Value": 1.0,
            "Blend": "Add"
        }
    ]
}
```

2. **在 `3.model3.json` 中注册**：

```json
"Expressions": [
    ...
    {"Name": "custom", "File": "exp_custom.exp3.json"}
]
```

3. **在 App.vue 中添加按钮**：

```vue
<button @click="setExpression('custom')">🎭 自定义</button>
```

## 👗 服装系统

米塔模型包含以下固定部件：

| 部件 ID | 名称 | 说明 |
|--------|------|------|
| Part | 发夹 | 头部装饰 |
| Part2 | 头发 | 发型 |
| Part8 | 脖子饰品 | 颈部配饰 |
| Part9 | 衣服 | 主体服装 |
| Part10 | 短袖 | 袖子部分 |
| Part12 | 蝴蝶结 | 蝴蝶结装饰 |

### ⚠️ 关于服装切换

**目前米塔模型不支持运行时服装切换**，原因：

1. 模型设计时没有预设多套服装材质
2. 没有配置服装切换的参数或图层
3. 服装部件是固定的，无法通过 API 动态更换

如果需要服装切换功能，需要：
- 使用 Live2D Cubism Editor 重新设计模型
- 添加多套服装的纹理贴图
- 配置服装切换的参数或 ArtMesh 显示/隐藏

## 🎮 使用方法

### 代码示例

```javascript
import * as live2d from './lib/live2d-wrapper.js';

// 初始化米塔模型
await live2d.initializeLive2D({
    ResourcesPath: '/live2d/米塔/3.model3.json',
    CanvasSize: { height: 500, width: 400 },
    CanvasPosition: 'right',
    ShowToolBox: true,
    LoadFromCache: true
});

// 切换表情
live2d.setExpression('smile');      // 微笑
live2d.setExpression('happy');      // 开心
live2d.setRandomExpression();       // 随机表情

// 显示消息
live2d.setMessageBox('你好！我是米塔 ✨', 3000);
```

### 控制面板功能

左上角的控制面板提供以下功能：

1. **随机表情** - 从 7 种表情中随机选择
2. **显示消息** - 弹出消息对话框
3. **表情按钮** - 直接切换到指定表情

## 🎯 参数列表

米塔模型支持的所有参数（来自 `3.cdi3.json`）：

### 头部控制
- `ParamAngleX/Y/Z` - 头部旋转角度
- `ParamBodyAngleX/Y/Z` - 身体旋转角度

### 面部表情
- `ParamMouthForm` - 嘴部形状
- `ParamMouthOpenY` - 嘴部张开
- `ParamEyeLOpen/ParamEyeROpen` - 眼睛开闭
- `ParamEyeLSmile/ParamEyeRSmile` - 眼睛微笑
- `ParamEyeBallX/Y` - 眼珠移动
- `ParamBrowLY/ParamBrowRY` - 眉毛高度
- `ParamBrowLForm/ParamBrowRForm` - 眉毛形状

### 物理效果
- `skirtX1/2/3`, `skirtY1/2/3` - 裙子物理
- `hairX1/2/3/4`, `hairY1/2/3/4` - 头发物理
- `hudiejieX1/2`, `hudiejieY1/2` - 蝴蝶结物理
- `Rhand1/2/3/4`, `Lhand1/2/3/4` - 手部物理

### 其他
- `ParamBreath` - 呼吸动作

## 📊 技术规格

- **纹理分辨率**: 4096x4096 (2张)
- **文件格式**: Cubism 3 (moc3)
- **物理模拟**: 启用（Physics3.json）
- **动作同步**: 支持（MotionSync3.json）
- **表情数量**: 7 个
- **参数数量**: 60+ 个

## 🔧 自定义建议

### 1. 调整表情强度

修改 `exp_*.exp3.json` 中的 `Value` 值：
- 范围通常是 -1.0 到 1.0
- 0.0 表示中性
- 正值增强，负值减弱

### 2. 调整淡入淡出时间

```json
"FadeInTime": 0.5,   // 淡入时间（秒）
"FadeOutTime": 0.5   // 淡出时间（秒）
```

### 3. 混合模式说明

- `Overwrite` - 完全覆盖原参数
- `Add` - 在原参数基础上叠加
- `Multiply` - 乘以原参数

## 📝 注意事项

1. **版权**: 米塔模型仅供个人娱乐使用，禁止商用和二次传播
2. **性能**: 高分辨率纹理可能影响性能，建议使用 `LoadFromCache: true`
3. **兼容性**: 需要支持 WebGL 的现代浏览器
4. **高 DPI**: 已自动适配 Retina 等高分辨率屏幕

## 🐛 常见问题

### Q: 表情切换没有效果？
A: 检查浏览器控制台是否有错误，确认表情文件路径正确

### Q: 模型加载很慢？
A: 启用 `LoadFromCache: true`，第二次加载会快很多

### Q: 如何调整模型大小？
A: 修改 `CanvasSize` 参数，如 `{height: 600, width: 500}`

### Q: 能否同时显示多个模型？
A: 当前实现不支持，如需要需要修改 `live2d-wrapper.js`

## 📚 参考资源

- [Live2D 官方文档](https://docs.live2d.com/)
- [三缘绘工坊 Bilibili](https://space.bilibili.com/11329178)
- [项目主文档](../README.md)

---

**配置完成日期**: 2025-12-06
**最后更新**: 2025-12-06
