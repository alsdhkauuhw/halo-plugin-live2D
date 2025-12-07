/**
 * Live2D 包装模块 - Halo Plugin 版本
 * 基于 live2d-render 的增强版本，添加了高 DPI 分辨率修复和自定义功能
 */

import * as Live2DRender from 'live2d-render'

/**
 * 修复 Canvas 高 DPI 分辨率
 */
function fixCanvasHighDPI() {
  const canvasElement = document.getElementById('live2d')
  if (!canvasElement) return

  const canvas = canvasElement as HTMLCanvasElement
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
  const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  console.log(`✅ Canvas 高 DPI 修复: ${canvas.width}x${canvas.height} (DPR: ${dpr})`)
}

/**
 * 增强版的 initializeLive2D
 * 在原有基础上添加高 DPI 修复
 */
export async function initializeLive2D(config: any) {
  // 调用原始的初始化函数
  await Live2DRender.initializeLive2D(config)

  // 等待 Canvas 创建完成后修复分辨率
  setTimeout(() => {
    fixCanvasHighDPI()

    // 监听窗口大小变化
    if (config.CanvasSize === 'auto') {
      window.addEventListener('resize', () => {
        setTimeout(fixCanvasHighDPI, 100)
      })
    }
  }, 500)
}

/**
 * 设置表情
 */
export function setExpression(expressionName: string) {
  return Live2DRender.setExpression(expressionName)
}

/**
 * 设置随机表情
 */
export function setRandomExpression() {
  return Live2DRender.setRandomExpression()
}

/**
 * 显示消息框
 */
export function setMessageBox(message: string, duration: number) {
  return Live2DRender.setMessageBox(message, duration)
}

/**
 * 隐藏消息框
 */
export function hideMessageBox() {
  return Live2DRender.hideMessageBox()
}

/**
 * 显示消息框
 */
export function revealMessageBox() {
  return Live2DRender.revealMessageBox()
}

/**
 * 手动修复 Canvas 分辨率（如果需要）
 */
export function fixCanvasResolution() {
  fixCanvasHighDPI()
}

// 导出所有原始功能
export default {
  initializeLive2D,
  setExpression,
  setRandomExpression,
  setMessageBox,
  hideMessageBox,
  revealMessageBox,
  fixCanvasResolution,
}
