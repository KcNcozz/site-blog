import fs from 'node:fs'
import { execSync } from 'child_process'
import ora from 'ora'

const gitCommander = (commad) => {
  execSync(`git ${commad}`)
}
function build() {
  const spinner = ora('Loading unicorns').start();
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