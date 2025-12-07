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

      // 展示工具箱（Live2dRender 原生的）
      ShowToolBox: true,

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
