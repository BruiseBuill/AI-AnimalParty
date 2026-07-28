# 架构边界

此项目使用同一套业务代码支持 Web、Android，后续也可接入 iOS。业务层不得导入 React、Capacitor 或浏览器 API。

## 目录职责

- `src/domain/`：纯业务领域层。保存角色、食物、对局模型、推理规则和状态转换。
- `src/application/`：应用用例层。管理当前对局、撤销历史和业务操作编排。
- `src/platform/`：平台适配层。封装本地存储、Capacitor/Web 运行环境等平台差异。
- `src/App.tsx`：React 界面层。仅负责输入、布局和显示领域层给出的结果。
- `android/`：Android 原生外壳。只打包 `dist/`，不包含推理规则。
- `public/`：Web/PWA 静态资源；Android 会在同步时复制这些资源。

## 修改规则时

1. 身份、食物或食性变更：修改 `src/domain/catalog.ts`。
2. 候选推理和标签规则变更：修改 `src/domain/game.ts`。
3. 对局数据字段变更：修改 `src/domain/model.ts`，并在存储适配层增加迁移。
4. Android/iOS 权限、图标、原生功能变更：只修改平台目录或 `src/platform/`。

领域对象必须保持 JSON 可序列化，不能保存 DOM、React 组件或 Capacitor 对象。

## Android 构建

```powershell
npm.cmd run build
npm.cmd run android:sync
npm.cmd run android:apk
```

APK 输出到 `android/app/build/outputs/apk/debug/app-debug.apk`。构建机需要 JDK 21 和 Android SDK 36；应用安装后所有网页资源都在 APK 内部，不依赖电脑或服务器。
