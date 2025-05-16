# BUAA OJ Markdown Bundle Downloader

Tampermonkey 用户脚本，用于在 [BUAA OJ](https://accoding.buaa.edu.cn) 比赛页面中提取比赛数据，并以 Markdown 格式打包下载成 ZIP 文件。也支持复制 ZIP 文件的十六进制内容到剪贴板，便于分享或保存。

> 作者不是北航的学生，该项目不再维护

##  功能特点

* 下载比赛描述和题目信息为 Markdown 文件
* 以 ZIP 格式打包保存，包含 README.md 和各题目 `.md` 文件
* 可复制 ZIP 文件内容为十六进制文本

##  安装方法

1. 安装 [Tampermonkey 插件](https://www.tampermonkey.net/)（推荐使用 Chrome/Edge 浏览器）

2. 点击以下链接安装脚本：
   **[安装脚本](https://github.com/eWloYW8/BUAA-OJ-markdown/raw/refs/heads/master/BUAA-OJ-markdown.user.js)**

3. 打开 [BUAA OJ](https://accoding.buaa.edu.cn) 中任意一个比赛页面（URL 类似于 `https://accoding.buaa.edu.cn/#/12345/...`）

4. 等待页面加载，右下角将出现两个按钮：

   * `Download Markdown Bundle`：将比赛内容以 ZIP 格式下载
   * `Copy Hex Data to Clipboard`：复制 ZIP 文件为十六进制文本

##  输出结构说明

* 下载结果为一个 `.zip` 文件，文件名为比赛标题
* 包含：

  * `README.md`：比赛描述内容
  * 每道题目一个 Markdown 文件，文件名为 `1 题目名.md`、`2 题目名.md` 等

##  注意事项

* 本脚本仅支持 BUAA OJ 比赛页面（需包含比赛 ID）
* 请确保页面加载完成再点击按钮
* 本脚本仅用于学习与备份目的，**请勿用于非法用途或传播**

