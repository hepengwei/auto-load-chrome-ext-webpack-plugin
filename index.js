const fs = require("fs");
const fsExtra = require("fs-extra");

class AutoRunChromeExtPlugin {
  constructor(options) {
    const {
      targetDir,
      autoClickSelectLocation,
      chromedriverLocation = "C:\\Program Files\\Google\\Chrome\\Application\\chromedriver.exe",
    } = options;
    this.targetDir = targetDir;
    this.autoClickSelectLocation = autoClickSelectLocation;
    this.chromedriverLocation = chromedriverLocation;
  }

  apply(compiler) {
    // 监听webpack 打包时候的钩子,选择在编译完成的时候
    compiler.hooks.done.tap("autoLoadChromeExt", async (stats) => {
      // 判断targetDir文件夹是否存在
      if (this.targetDir && typeof this.targetDir === "string") {
        fs.access(this.targetDir, fs.constants.F_OK, async (err) => {
          if (!err) {
            // 判断chromedriver.exe文件是否存在
            fs.access(
              this.chromedriverLocation,
              fs.constants.F_OK,
              async (err2) => {
                if (!err2) {
                  // 清空目标文件夹里的内容
                  fsExtra.emptyDirSync(this.targetDir);
                  // 将打包后文件夹里的内容复制到目标文件夹
                  const { outputPath } = stats.compilation.compiler;
                  fsExtra.copySync(outputPath, this.targetDir, {
                    dereference: true,
                  });

                  // 构建driver
                  const webdriver = require("selenium-webdriver");
                  const remote = require("selenium-webdriver/remote");
                  const {
                    ServiceBuilder,
                  } = require("selenium-webdriver/chrome");
                  const { Builder, By } = webdriver;
                  const driver = new Builder()
                    .forBrowser("chrome")
                    .setChromeService(
                      new ServiceBuilder(this.chromedriverLocation)
                    )
                    .build();
                  driver.setFileDetector(new remote.FileDetector());
                  driver.manage().setTimeouts({ implicit: 2000 });

                  // 打开Chrome浏览器的扩展管理页面
                  await driver.get("chrome://extensions/");
                  // 找到页面中开发者模式的按钮
                  const a = await driver
                    .findElement(By.css("extensions-manager"))
                    .getShadowRoot();
                  const b = await a.findElement(By.css("extensions-toolbar"));
                  const c = await b.getShadowRoot();
                  const switchBtn = await c.findElement(By.id("devMode"));
                  if (switchBtn) {
                    const isSelected = await switchBtn.isSelected();
                    if (!isSelected) {
                      // 点击打开开发者模式
                      await switchBtn.click();
                    }
                    const devDrawer = await c.findElement(By.id("devDrawer"));
                    const buttonStrip = await devDrawer.findElement(
                      By.id("buttonStrip")
                    );
                    // 找到页面中加载已解压的扩展程序按钮
                    const loadUnpackedBtn = await buttonStrip.findElement(
                      By.id("loadUnpacked")
                    );
                    if (loadUnpackedBtn) {
                      // 判断autoClickSelect.exe文件是否存在
                      if (
                        this.autoClickSelectLocation &&
                        typeof this.autoClickSelectLocation === "string"
                      ) {
                        fs.access(
                          this.autoClickSelectLocation,
                          fs.constants.F_OK,
                          async (err) => {
                            if (!err) {
                              // 执行autoClickSelect.exe文件，等待自动点击选择文件按钮
                              const exec = require("child_process").execFile;
                              const child = exec(
                                this.autoClickSelectLocation,
                                [this.targetDir],
                                {},
                                (error, stdout, stderr) => {
                                  if (error) return console.error(error);
                                }
                              );
                            } else {
                              console.log(
                                `auto-load-chrome-ext-webpack-plugin所需的autoClickSelect.exe文件不存在，配置请参考文档: https://www.jianshu.com/p/4c854f6c6f86`
                              );
                            }
                            // 点击加载已解压的扩展程序按钮
                            await loadUnpackedBtn.sendKeys(this.targetDir);
                          }
                        );
                      } else {
                        console.log(
                          "请正确传入auto-load-chrome-ext-webpack-plugin所需的autoClickSelectLocation参数，配置请参考文档: https://www.jianshu.com/p/4c854f6c6f86"
                        );
                      }
                    }
                  }
                } else {
                  console.log(
                    "auto-load-chrome-ext-webpack-plugin必需的chromedriver.exe文件不存在，配置请参考文档: https://www.jianshu.com/p/4c854f6c6f86"
                  );
                }
              }
            );
          } else {
            console.log(
              "auto-load-chrome-ext-webpack-plugin必需的targetDir目标文件夹不存在，配置请参考文档: https://www.jianshu.com/p/4c854f6c6f86"
            );
          }
        });
      } else {
        console.log(
          "请正确传入auto-load-chrome-ext-webpack-plugin所必需的targetDir参数，配置请参考文档: https://www.jianshu.com/p/4c854f6c6f86"
        );
      }
    });
  }
}

module.exports = AutoRunChromeExtPlugin;
