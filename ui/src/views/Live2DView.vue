<script setup lang="ts">
import { onMounted } from 'vue'
import * as live2d from '../lib/live2d-wrapper'

onMounted(async () => {
  console.log('开始初始化 Live2D...')
  console.log('当前页面 URL:', window.location.href)
  console.log('Base URL:', import.meta.env.BASE_URL)

  try {
    await live2d.initializeLive2D({
      // live2d 所在区域的背景颜色
      BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],

      // live2d 的 model3.json 文件的路径
      // 在 Halo 插件中，public 目录的文件通过 /plugins/{plugin-name}/assets/ 访问
      // 使用英文路径避免 URL 编码问题
      ResourcesPath: '/plugins/live2d/assets/live2d/mita/3.model3.json',

      // live2d 的大小
      CanvasSize: {
        height: 500,
        width: 400,
      },

      // live2d 的位置 ('left' | 'right')
      CanvasPosition: 'right',

      // 展示工具箱（注意：字段名是小写 showToolBox）
      showToolBox: true,

      // 是否使用 indexDB 进行缓存优化，这样下一次载入就不会再发起网络请求了
      LoadFromCache: true,
    })

    console.log('✅ Live2D 加载完成')

    // 检查 canvas 是否被创建
    const canvas = document.getElementById('live2d')
    if (canvas) {
      console.log('✅ Canvas 元素已创建:', canvas)
    } else {
      console.error('❌ Canvas 元素未找到')
    }
  } catch (error) {
    console.error('❌ Live2D 初始化失败:', error)
  }
})

// 切换随机表情
const changeExpression = () => {
  live2d.setRandomExpression()
}

// 设置特定表情
const setExpression = (expressionName: string) => {
  live2d.setExpression(expressionName)
}

// 显示消息
const showMessage = () => {
  live2d.setMessageBox('你好！我是米塔 ✨', 3000)
}
</script>

<template>
  <div id="live2d-plugin">
    <div class="controls">
      <h3>米塔 Live2D 控制面板</h3>
      <div class="button-group">
        <button @click="changeExpression">随机表情</button>
        <button @click="showMessage">显示消息</button>
      </div>
      <div class="expression-section">
        <h4>表情控制</h4>
        <div class="button-group">
          <button @click="setExpression('default')">😐 默认</button>
          <button @click="setExpression('smile')">😊 微笑</button>
          <button @click="setExpression('happy')">😄 开心</button>
        </div>
        <div class="button-group">
          <button @click="setExpression('sad')">😢 悲伤</button>
          <button @click="setExpression('surprised')">😲 惊讶</button>
          <button @click="setExpression('angry')">😠 生气</button>
        </div>
        <div class="button-group">
          <button @click="setExpression('wink')">😉 闭眼</button>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="info-card">
        <h2>🎭 Live2D 插件</h2>
        <p>欢迎使用 Halo Live2D 插件！米塔会陪伴您的博客之旅。</p>

        <div class="features">
          <div class="feature-item">
            <h3>✨ 功能特点</h3>
            <ul>
              <li>支持多种表情切换</li>
              <li>高 DPI 屏幕自适应</li>
              <li>可自定义模型位置和大小</li>
              <li>支持消息对话框</li>
              <li>IndexDB 缓存加速</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>🎯 表情列表</h3>
            <ul>
              <li>默认 - 中性表情</li>
              <li>微笑 - 温和微笑</li>
              <li>开心 - 开心大笑</li>
              <li>悲伤 - 悲伤难过</li>
              <li>惊讶 - 惊讶吃惊</li>
              <li>生气 - 生气不满</li>
              <li>闭眼 - 闭眼/眨眼</li>
            </ul>
          </div>

          <div class="feature-item">
            <h3>📝 使用说明</h3>
            <ul>
              <li>点击左侧按钮切换表情</li>
              <li>直接点击模型也可触发随机表情</li>
              <li>模型会跟随鼠标移动</li>
              <li>可通过工具箱显示/隐藏模型</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#live2d-plugin {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 20px;
}

.controls {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  max-width: 350px;

  h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #333;
  }

  h4 {
    margin: 15px 0 10px 0;
    font-size: 14px;
    color: #666;
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
}

.expression-section {
  margin-top: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: #35a372;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.info-card {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    margin-top: 0;
    color: #333;
    font-size: 24px;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.feature-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #42b983;
    font-size: 18px;
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>
