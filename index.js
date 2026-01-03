import { execSync } from 'child_process' //子进程 用于执行shell命令
import ora from 'ora'

const gitCommander = (commad) => {
  execSync(`git ${commad}`)
}
function build() {
  const spinner = ora('开始执行').start();
  const commont = process.argv[2]
  execSync('npm run build')
  console.log('build 完成')
  gitCommander('add .')
  console.log('add 完成')
  gitCommander(`commit -m "${commont}"`)
  console.log('commit 完成')
  gitCommander('push origin main')
  spinner.succeed('执行完成')
}


function main() {
  build()
}

main()