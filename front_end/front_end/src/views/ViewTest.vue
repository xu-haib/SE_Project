<template>
  <div class="page-layout">
    <header class="header">头部内容（可随页面滚动）</header>

    <div class="content-wrapper">
      <main class="main-content">
        <div style="height: 2000px; background: #f5f5f5; padding: 20px">主内容区域</div>
      </main>

      <aside class="sidebar">
        <div class="sidebar-content">
          <div style="height: 1500px">
            侧边栏内容（固定在视口）
            <div style="position: absolute; bottom: 10px">侧边栏底部内容</div>
          </div>
        </div>
      </aside>
    </div>

    <footer class="footer">底部内容（可随页面滚动）</footer>
  </div>
</template>

<style lang="scss" scoped>
.page-layout {
  /* 常规文档流 */
}

.header,
.footer {
  background: #409eff;
  color: white;
  padding: 20px;
  text-align: center;
}

.content-wrapper {
  display: flex;
  position: relative;
}

.main-content {
  flex: 1;
}

.sidebar {
  width: 300px;
  margin-left: 20px;
  position: sticky;
  top: 0;
  align-self: flex-start; /* 重要：防止被拉伸 */
  height: 100vh; /* 视口高度 */
}

.sidebar-content {
  background: #e9e9e9;
  height: 100%;
  overflow-y: auto; /* 内部滚动 */
  padding: 20px;
  position: relative;
}
</style>
