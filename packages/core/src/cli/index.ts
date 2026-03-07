import { Command } from "commander"
import { init } from "./commands/init"
import { add } from "./commands/add"
import { list } from "./commands/list"

const program = new Command()

program
  .name("taw-ui")
  .description("Add taw-ui components to your project")
  .version("0.0.1")

program
  .command("init")
  .description("Initialize taw-ui in your project — sets up shared types and utilities")
  .option("-d, --dir <path>", "Target directory for components", "components/taw")
  .option("-y, --yes", "Skip confirmation prompts")
  .action(init)

program
  .command("add")
  .description("Add a component to your project")
  .argument("[components...]", "Components to add (e.g. kpi-card option-list)")
  .option("-d, --dir <path>", "Target directory for components", "components/taw")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-a, --all", "Add all components")
  .action(add)

program
  .command("list")
  .description("List all available components")
  .action(list)

program.parse()
