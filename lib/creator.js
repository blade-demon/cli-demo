import { fetchRepoList } from "./request.js";
import { loading } from "./utils.js";
import downloadGitRepo from "download-git-repo";
import inquirer from "inquirer";
import chalk from "chalk";
import util from "util";

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName;
    this.dir = targetDir;
    // 将downloadGitRepo转成promise
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  fetchRepo = async () => {
    const branches = await loading(
      fetchRepoList,
      "waiting for fetch resources"
    );
    return branches;
  };

  fetchTag = () => {};

  download = async (branch) => {
    // 1 拼接下载路径 这里放自己的模板仓库url
    const requestUrl = `rippi-cli-template/react/#${branch}`;
    // 2 把资源下载到某个路径上
    await this.downloadGitRepo(requestUrl, this.dir);
    console.log(chalk.green("done!"));
  };

  create = async () => {
    // 1 先去拉取当前仓库下的所有分支
    const branches = await this.fetchRepo();
    // 这里会在shell命令行弹出选择项，选项为choices中的内容
    const { curBranch } = await inquirer.prompt([
      {
        name: "curBranch",
        type: "list",
        // 提示信息
        message: "please choose current version:",
        // 选项
        choices: branches
          .filter((branch) => branch.name !== "main")
          .map((branch) => ({
            name: branch.name,
            value: branch.name,
          })),
      },
    ]);
    // 2 下载
    await this.download(curBranch);
  };
}

export default Creator;
