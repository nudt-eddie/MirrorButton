# ✨ Minor Button - HTML/JavaScript

一个使用HTML/JavaScript实现的交互式镜面按钮，具有实时摄像头反射效果。仅使用原生JavaScript。

## demo
![demo](/demo.png)

## ✨ 特性

- **实时摄像头反射**：使用用户摄像头创建逼真的反射效果
- **交互式光标跟踪**：光标在按钮上移动时显示反射效果
- **指纹效果**：点击按钮时留下指纹痕迹
- **可调节粗糙度**：动态调整表面粗糙度（模糊程度）
- **纯原生实现**：无需任何框架或构建工具

## 🚀 快速开始

### 1. 包含文件

```html
<!-- 包含CSS和JS文件 -->
<link rel="stylesheet" href="shiny-button.css">
<script src="shiny-button.js"></script>
```

### 2. 创建按钮容器

```html
<div id="my-button"></div>
```

### 3. 初始化按钮

```javascript
// 创建新的ShinyButton实例
const button = new ShinyButton({
    text: '点击我',
    roughness: 0.2,
    width: 300,
    height: 100,
    borderRadius: 56
});

// 将按钮添加到页面
document.getElementById('my-button').appendChild(button.getElement());

// 动态更新按钮
button.setText('新文本');
button.setRoughness(0.5);
```

## 📁 项目结构

```
ShinyButton/
├── html-js/
│   ├── index.html          # 演示页面
│   ├── shiny-button.js     # 主JavaScript类
│   └── shiny-button.css    # 样式文件
└── README.md              # 项目说明
```

## 🎮 交互控制

- **粗糙度控制**：通过滑块调整表面粗糙度（0-1）
- **点击效果**：点击按钮时产生按压效果和指纹
- **光标跟踪**：鼠标移动时显示光标反射
- **触摸支持**：移动设备上的触摸交互

## 🔧 API 参考

### ShinyButton 构造函数

```javascript
new ShinyButton(options)
```

**参数：**
- `options.text` (string): 按钮文本，默认 'Button'
- `options.roughness` (number): 表面粗糙度 (0-1)，默认 0.2
- `options.width` (number): 按钮宽度(px)，默认 300
- `options.height` (number): 按钮高度(px)，默认 100
- `options.borderRadius` (number): 圆角半径(px)，默认 56

### 方法

- `getElement()`: 返回按钮的DOM元素
- `setText(text)`: 更新按钮文本
- `setRoughness(roughness)`: 更新表面粗糙度 (0-1)
- `destroy()`: 清理资源（停止摄像头流）

## 📱 移动设备支持

- 触摸交互支持
- 响应式设计
- 移动端优化（隐藏光标效果）

## 🔒 隐私说明

- 摄像头流仅在本地处理，不会上传到任何服务器
- 所有处理都在浏览器中完成
- 可以随时通过 `destroy()` 方法停止摄像头

## 🛠️ 开发

### 本地运行

1. 克隆项目：
   ```bash
   git clone https://github.com/nudt-eddie/MirrorButton.git
   ```

2. 打开 `html-js/index.html` 在浏览器中查看演示

### 自定义样式

可以通过修改 `shiny-button.css` 文件来自定义按钮样式：

- 调整阴影效果
- 修改颜色和透明度
- 自定义字体和大小
- 调整动画过渡时间

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🎯 灵感来源及致谢

本项目灵感来源于 [alexwidua/prototypes/ShinyButton](https://github.com/alexwidua/prototypes/tree/master/ShinyButton)，将其React版本重新实现为HTML/JavaScript版本，以便更广泛地使用和集成。
---

**注意：** 首次使用时浏览器会请求摄像头权限。如果拒绝或摄像头不可用，按钮将使用优雅的渐变回退效果。