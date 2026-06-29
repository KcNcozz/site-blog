import { execSync } from "child_process"; //子进程 用于执行shell命令
import ora from "ora";
import fs from "node:fs";

const clearFolder = () => {
  if (fs.existsSync("./docs")) {
    fs.rmSync("./docs", { recursive: true, force: true });
  }
};

const gitCommander = (command) => {
  execSync(`git ${command}`, { stdio: "inherit" });
};

function build() {
  const commont = process.argv[2];

  // 参数校验：必须提供 commit 信息
  if (!commont) {
    console.error("❌ 错误：缺少 commit 信息");
    console.log('使用方法: npm run deploy "你的提交信息"');
    process.exit(1);
  }

  const spinner = ora("开始执行").start();
  try {
    clearFolder();
    execSync("npm run build", { stdio: "inherit" });
    console.log("build 完成");
    gitCommander("add .");
    console.log("add 完成");
    gitCommander(`commit -m "${commont}"`);
    console.log("commit 完成");
    gitCommander("push origin main");
    spinner.succeed("执行完成");
  } catch (error) {
    spinner.fail("执行失败");
    console.error(error.message);
    process.exit(1);
  }
}

function main() {
  build();
}

main();
