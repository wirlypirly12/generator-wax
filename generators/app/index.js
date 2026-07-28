import Generator from 'yeoman-generator';

export default class extends Generator {
    async prompting() {
        this.answers = await this.prompt([
            {
            type: 'input',
            name: 'name',
            message: 'Project name',
            default: this.appname
            },
            {
            type: 'input',
            name: 'envName',
            message: 'Wax env-name (shows up in runtime errors, e.g. [EnvName].Script:1: ...)',
            default: 'WaxRuntime'
            },
            {
            type: 'select',
            name: 'entryType',
            message: 'Entry point type',
            choices: ['Script', 'LocalScript', 'ModuleScript']
            },
            {
            type: 'confirm',
            name: 'useDarklua',
            message: 'Minify with Darklua?',
            default: true
            },
            {
            type: 'checkbox',
            name: 'darkluaRules',
            message: 'Which Darklua rules to apply?',
            when: (answers) => answers.useDarklua,
            choices: [
                { name: 'Remove comments', value: 'remove_comments', checked: true },
                { name: 'Remove spaces', value: 'remove_spaces', checked: true },
                { name: 'Remove types (Luau annotations)', value: 'remove_types', checked: true },
                { name: 'Remove unused variables', value: 'remove_unused_variable', checked: true },
                { name: 'Rename variables (mangle identifiers)', value: 'rename_variables', checked: false },
                { name: 'Compute constant expressions', value: 'compute_expression', checked: false },
                { name: 'Remove debug profiling calls', value: 'remove_debug_profiling', checked: false },
                { name: 'Remove assertions (assert(...) calls)', value: 'remove_assertions', checked: false }
            ]
            },
            {
            type: 'confirm',
            name: 'renameIncludeFunctions',
            message: 'Also mangle function names (not just local variables)?',
            default: true,
            when: (answers) =>
                answers.useDarklua && answers.darkluaRules?.includes('rename_variables')
            },
            {
            type: 'confirm',
            name: 'ciMode',
            message: 'Add a CI-friendly build script (bundle with ci-mode=true)?',
            default: true
            }
        ]);
    }

  writing() {
    const answers = this.answers;

    this.fs.copyTpl(
      this.templatePath('rokit.toml'),
      this.destinationPath('rokit.toml'),
      answers
    );

    this.fs.copyTpl(
      this.templatePath('default.project.json'),
      this.destinationPath('default.project.json'),
      answers
    );

    this.fs.copy(
      this.templatePath('luaurc'),
      this.destinationPath('.luaurc')
    );

    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copyTpl(
      this.templatePath('lune/wax.luau'),
      this.destinationPath('lune/wax.luau'),
      answers
    );

    if (answers.useDarklua) {
        const rules = answers.darkluaRules.map((rule) => {
            if (rule === 'rename_variables') {
                return {
                    rule: 'rename_variables',
                    include_functions: !!answers.renameIncludeFunctions
                };
            }
            return rule;
        });

        const darkluaConfig = {
            generator: 'retain_lines',
            rules
        };

        this.fs.writeJSON(
        this.destinationPath('.darklua.json'),
        darkluaConfig
    );}

    const entryFileMap = {
      Script: 'init.server.luau',
      LocalScript: 'init.client.luau',
      ModuleScript: 'init.luau'
    };

    this.fs.copyTpl(
      this.templatePath('src/init.luau'),
      this.destinationPath(`src/${entryFileMap[answers.entryType]}`),
      answers
    );

    if (answers.ciMode) {
        this.fs.copyTpl(
            this.templatePath('package.json.ejs'),
            this.destinationPath('package.json'),
            answers
        );
    }

    this.fs.write(this.destinationPath('build/.gitkeep'), '');
  }

    install() {
    this.log('Installing Rokit tools...');

    try {
        this.spawnCommandSync('rokit', ['install']);
    } catch (err) {
        this.log.error(
        'Could not run `rokit install` — is Rokit installed and on your PATH?\n' +
        'See: https://github.com/rojo-rbx/rokit'
        );
    }

    this.log('Done! Run `lune run wax` to bundle your project.');
    }
}