/**
 * Live2D 前台初始化脚本
 * 用于在博客前台全局显示 Live2D 模型
 */

import * as Live2DRender from 'live2d-render'

// 性能监控
const perfStart = performance.now()

// 全局错误处理，忽略页面切换时的渲染错误
window.addEventListener('error', function(event) {
  if (event.message && event.message.includes('Cannot read properties of null')) {
    console.log('[Live2D] 检测到页面切换，忽略渲染错误')
    event.preventDefault()
    return true
  }
})

/**
 * 创建自定义工具箱
 */
function createCustomToolbox() {
  // 检查工具箱是否已存在
  if (document.getElementById('custom-live2d-toolbox')) {
    return
  }

  // 隐藏原生工具箱（opacity: 0 的那个元素）
  setTimeout(() => {
    const allDivs = document.querySelectorAll('div')
    for (const div of allDivs) {
      if (div.innerHTML && div.innerHTML.includes('__live2d-toolbox-item')) {
        div.style.display = 'none'
        console.log('[Live2D] 已隐藏原生工具箱元素')
        break
      }
    }
  }, 500)

  // 创建工具箱容器
  const toolbox = document.createElement('div')
  toolbox.id = 'custom-live2d-toolbox'
  toolbox.innerHTML = `
    <div class="toolbox-toggle" id="toolbox-toggle" title="展开/收起">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </div>
    <div class="toolbox-panel" id="toolbox-panel">
      <div class="toolbox-item" id="hide-model" title="隐藏模型">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <div class="toolbox-item" id="show-model" title="显示模型" style="display: none;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </div>
      <div class="toolbox-item" id="random-expression" title="随机表情">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      </div>
      <div class="toolbox-item" id="expression-smile" title="微笑">😊</div>
      <div class="toolbox-item" id="expression-happy" title="开心">😄</div>
      <div class="toolbox-item" id="expression-sad" title="悲伤">😢</div>
      <div class="toolbox-item" id="expression-surprised" title="惊讶">😲</div>
      <div class="toolbox-item" id="expression-angry" title="生气">😠</div>
    </div>
  `

  // 添加样式
  const style = document.createElement('style')
  style.textContent = `
    #custom-live2d-toolbox {
      position: fixed;
      right: 20px;
      bottom: 100px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .toolbox-toggle {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: white;
      margin-bottom: 10px;
    }

    .toolbox-toggle:hover {
      transform: scale(1.1) rotate(90deg);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .toolbox-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateY(-10px);
    }

    .toolbox-panel.active {
      max-height: 500px;
      opacity: 1;
      transform: translateY(0);
    }

    .toolbox-item {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 8px;
      margin: 4px 0;
      transition: all 0.2s;
      color: #4a5568;
      font-size: 18px;
      background: transparent;
    }

    .toolbox-item:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: scale(1.1);
    }

    .toolbox-item:active {
      transform: scale(0.95);
    }

    .toolbox-item svg {
      pointer-events: none;
    }

    @media (max-width: 768px) {
      #custom-live2d-toolbox {
        right: 10px;
        bottom: 80px;
      }
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(toolbox)

  // 绑定事件
  let isVisible = true
  let isPanelOpen = false
  let isChangingExpression = false // 防止快速重复点击

  // 切换面板
  document.getElementById('toolbox-toggle').addEventListener('click', () => {
    isPanelOpen = !isPanelOpen
    const panel = document.getElementById('toolbox-panel')
    if (isPanelOpen) {
      panel.classList.add('active')
    } else {
      panel.classList.remove('active')
    }
  })

  // 隐藏/显示模型
  const hideBtn = document.getElementById('hide-model')
  const showBtn = document.getElementById('show-model')

  hideBtn.addEventListener('click', () => {
    const canvas = document.getElementById('live2d')
    const messageBox = document.getElementById('live2dMessageBox')

    isVisible = false

    if (canvas) {
      canvas.style.opacity = '0'
      canvas.style.pointerEvents = 'none'
    }

    if (messageBox) {
      messageBox.style.opacity = '0'
    }

    hideBtn.style.display = 'none'
    showBtn.style.display = 'flex'

    console.log('[Live2D] 模型已隐藏')
  })

  showBtn.addEventListener('click', () => {
    const canvas = document.getElementById('live2d')
    const messageBox = document.getElementById('live2dMessageBox')

    isVisible = true

    if (canvas) {
      canvas.style.opacity = '1'
      canvas.style.pointerEvents = 'auto'
    }

    if (messageBox) {
      messageBox.style.opacity = '1'
    }

    hideBtn.style.display = 'flex'
    showBtn.style.display = 'none'

    console.log('[Live2D] 模型已显示')
  })

  // 随机表情（添加防抖）
  document.getElementById('random-expression').addEventListener('click', () => {
    if (isChangingExpression) {
      console.warn('[Live2D] 表情切换中，请稍候...')
      return
    }

    isChangingExpression = true

    try {
      Live2DRender.setRandomExpression()
      console.log('[Live2D] 切换随机表情')
    } catch (error) {
      console.error('[Live2D] 切换表情失败:', error)
    } finally {
      // 500ms 后解锁
      setTimeout(() => {
        isChangingExpression = false
      }, 500)
    }
  })

  // 具体表情（添加防抖）
  const expressions = ['smile', 'happy', 'sad', 'surprised', 'angry']
  expressions.forEach(exp => {
    const element = document.getElementById(`expression-${exp}`)
    if (element) {
      element.addEventListener('click', () => {
        if (isChangingExpression) {
          console.warn('[Live2D] 表情切换中，请稍候...')
          return
        }

        isChangingExpression = true

        try {
          Live2DRender.setExpression(exp)
          console.log(`[Live2D] 切换表情: ${exp}`)
        } catch (error) {
          console.error(`[Live2D] 切换表情 ${exp} 失败:`, error)
        } finally {
          // 500ms 后解锁
          setTimeout(() => {
            isChangingExpression = false
          }, 500)
        }
      })
    }
  })

  console.log('[Live2D] ✅ 自定义工具箱已创建')
}

/**
 * 修复 Canvas 高 DPI 分辨率
 * 解决 Live2D 模型在高分辨率屏幕上渲染问题
 */
function fixCanvasHighDPI() {
  const canvas = document.getElementById('live2d')
  if (!canvas) {
    console.warn('[Live2D] 未找到 Canvas 元素')
    return
  }

  const dpr = window.devicePixelRatio || 1

  // 获取当前的 CSS 尺寸
  const currentWidth = parseInt(canvas.style.width) || canvas.width
  const currentHeight = parseInt(canvas.style.height) || canvas.height

  // 设置实际渲染分辨率（Canvas 内部分辨率）
  canvas.width = currentWidth * dpr
  canvas.height = currentHeight * dpr

  // 设置 CSS 显示尺寸
  canvas.style.width = currentWidth + 'px'
  canvas.style.height = currentHeight + 'px'

  // 获取 WebGL 上下文并调整视口
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  const totalTime = ((performance.now() - perfStart) / 1000).toFixed(2)
  console.log(`[Live2D] ✅ 米塔已就绪 (总耗时: ${totalTime}秒)`)
}

/**
 * 尝试修复 Canvas（带重试机制）
 * 因为 live2d-render 异步创建 Canvas，需要等待
 */
function tryFixCanvas(attempts = 0, maxAttempts = 10) {
  const canvas = document.getElementById('live2d')

  if (canvas) {
    fixCanvasHighDPI()

    // 创建自定义工具箱
    setTimeout(() => {
      createCustomToolbox()
    }, 300)

    return
  }

  // Canvas 还未创建，继续等待
  if (attempts < maxAttempts) {
    setTimeout(() => tryFixCanvas(attempts + 1, maxAttempts), 100)
  } else {
    console.warn('[Live2D] ⚠️ Canvas 创建超时')
  }
}

// 立即开始初始化（不等待 DOMContentLoaded）
// 因为使用了 ES Module，脚本本身就是延迟执行的
async function initLive2D() {
  try {
    console.log('[Live2D] 开始加载米塔模型（约7MB，请耐心等待）...')

    // @ts-ignore - live2d-render 的类型定义不完整
    await Live2DRender.initializeLive2D({
      // live2d 所在区域的背景颜色（透明）
      BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],

      // live2d 的 model3.json 文件的路径
      // 通过 ReverseProxy 访问插件的 static 目录
      // 使用英文路径避免 URL 编码问题
      ResourcesPath: '/plugins/live2d/assets/live2d/mita/3.model3.json',

      // live2d 的大小
      CanvasSize: {
        height: 500,
        width: 400,
      },

      // live2d 的位置 ('left' | 'right')
      CanvasPosition: 'right',

      // 关闭原生工具箱（使用自定义工具箱）
      showToolBox: false,

      // 使用 indexDB 缓存（第二次访问会快很多）
      LoadFromCache: true,
    })

    const loadTime = ((performance.now() - perfStart) / 1000).toFixed(2)
    console.log(`[Live2D] ✅ 模型加载完成 (耗时: ${loadTime}秒)`)

    // 使用轮询方式等待 Canvas 创建，而不是固定延迟
    // 这样可以更快地响应 Canvas 创建完成
    tryFixCanvas()

  } catch (error) {
    console.error('[Live2D] ❌ 初始化失败:', error)
  }
}

// 立即初始化（ES Module 已经保证 DOM 可访问）
initLive2D()
