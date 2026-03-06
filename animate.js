// 创建提示容器（使用Symbol确保唯一性）
const toastContainer = (() => {
  const containerSymbol = Symbol("toast-container");

  return function getToastContainer() {
    // 尝试从全局缓存获取
    if (!window[containerSymbol]) {
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
      window[containerSymbol] = container;
    }
    return window[containerSymbol];
  };
})();

// 成功提示动画
function showSuccess(message) {
  const container = toastContainer();
  const toast = document.createElement("div");

  toast.style.cssText = `
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translateX(120%);
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    max-width: 300px;
    word-break: break-word;
    pointer-events: auto;
    cursor: pointer;
  `;

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink: 0;">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // 点击立即关闭
  toast.addEventListener("click", () => {
    toast.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 300);
  });

  // 进入动画
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
  });

  // 自动关闭
  setTimeout(() => {
    if (toast.isConnected) {
      toast.style.transform = "translateX(120%)";
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}

// 失败提示动画
function showError(message) {
  const container = toastContainer();
  const toast = document.createElement("div");

  toast.style.cssText = `
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
    transform: scale(0.8);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 300px;
    word-break: break-word;
    pointer-events: auto;
    cursor: pointer;
  `;

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink: 0;">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // 点击立即关闭
  toast.addEventListener("click", () => {
    toast.style.transform = "scale(0.8)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  });

  // 进入动画
  requestAnimationFrame(() => {
    toast.style.transform = "scale(1)";
    toast.style.opacity = "1";
  });

  // 自动关闭
  setTimeout(() => {
    if (toast.isConnected) {
      toast.style.transform = "scale(0.8)";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}
