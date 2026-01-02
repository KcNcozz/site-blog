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
  gitCommander('add .')
  gitCommander(`commit -m "${commont}"`)
  gitCommander('push origin main')
  spinner.succeed('打包完成')
}


function main() {
  build()
}

main()