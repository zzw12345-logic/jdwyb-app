# 接单无忧宝

<p align="center">
  <strong>灵活工作者的"收入晴雨表"和"保障小管家"</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android-green" alt="Platform">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

---

## 📱 项目简介

接单无忧宝是专为外卖小哥、网约车司机等灵活工作者设计的智能工具，提供：

- 📊 **收入预测** - AI预测收入趋势，准确率78%
- 🔔 **风险预警** - 收入异常提醒，推荐爆单区域
- 🛡️ **按单保险** - 每单¥0.5起，接单自动激活

## 🚀 下载APK

[![Download APK](https://img.shields.io/badge/Download-APK-brightgreen?style=for-the-badge&logo=android)](https://github.com/你的用户名/jdwyb-app/releases/latest)

> 上传到GitHub后，APK会自动构建。点击上方按钮下载最新版本。

## 📦 项目结构

```
├── www/                    # 网页资源
│   ├── index.html          # 首页
│   ├── features.html       # 核心功能
│   ├── income.html         # 收入预测
│   ├── insurance.html      # 保险保障
│   ├── about.html          # 关于我们
│   ├── contact.html        # 联系我们
│   ├── styles.css          # 样式
│   └── script.js           # 脚本
├── android/                # Android原生项目
├── .github/workflows/      # GitHub Actions配置
├── capacitor.config.json   # Capacitor配置
└── package.json
```

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 同步到Android
npx cap sync android

# 打开Android Studio（可选）
npx cap open android

# 或使用Gradle构建
cd android
./gradlew assembleDebug
```

## 👥 开发团队

**三江学院法商学院创新训练项目**

| 成员 | 角色 |
|------|------|
| 左志伟 | 项目负责人 |
| 王小宇 | 文献研究 |
| 胡金万 | 项目介绍 |
| 周杜 | 研究报告 |
| 王状 | 模拟试验 |

**指导教师**: 侯小丽、王翠娥

## 📄 许可证

MIT License

---

<p align="center">
  Made with ❤️ by 三江学院法商学院
</p>
