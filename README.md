# generator-wax

A [Yeoman](https://yeoman.io) generator for scaffolding [Wax](https://github.com/latte-soft/wax) projects - the Lua 5.1x+/Luau project bundler runtime that uses Rojo/Roblox model semantics.

Running `yo wax` sets up a ready to build Wax project: a Rojo project file, a `lune/wax.luau` loader, your toolchain manifest (Rokit), and an entry point script - with optional Darklua minification and a CI-friendly build script.

## Prerequisites

You'll need these installed and on your `PATH` before scaffolding a project:

- [Node.js](https://nodejs.org) (for Yeoman itself)
- [Rokit](https://github.com/rojo-rbx/rokit) (manages `lune`, `rojo`, and `darklua` for your generated project)

## Installation

```bash
npm install -g yo generator-wax
```

## Usage

```bash
mkdir my-wax-project
cd my-wax-project
yo wax
```

You'll be asked:

| Prompt | What it controls |
|---|---|
| **Project name** | Used in `default.project.json`, `package.json`, and build output filenames |
| **Wax env-name** | The `env-name` passed to `lune run wax bundle`, shown in runtime error messages |
| **Entry point type** | `Script`, `LocalScript`, or `ModuleScript` — determines which `init.*.luau` file is scaffolded |
| **Minify with Darklua?** | Whether to generate a `.darklua.json` and add `darklua` to `rokit.toml` |
| **Which Darklua rules to apply?** | Pick from `remove_comments`, `remove_spaces`, `remove_types`, `remove_unused_variable`, `rename_variables`, `compute_expression`, `remove_debug_profiling`, `remove_assertions` |
| **Mangle function names too?** | Only shown if `rename_variables` is selected |
| **Add a CI-friendly build script?** | Adds an npm `build` script that runs `lune run wax bundle ... ci-mode=true` |

After scaffolding, the generator runs `rokit install` automatically to fetch the pinned toolchain.

## Building your project

Once scaffolded:

```bash
lune run wax
```

or, if you opted into the CI build script:

```bash
npm run build
```

## What gets scaffolded

```
my-wax-project/
├── .darklua.json          # only if minification enabled
├── .gitignore
├── .luaurc
├── default.project.json   # Rojo project file
├── package.json           # only if CI build script enabled
├── rokit.toml             # pins lune, rojo, (darklua)
├── lune/
│   └── wax.luau           # Wax loader script
└── src/
    └── init[.server|.client].luau
```

## Development

```bash
git clone https://github.com/wirlypirly12/generator-wax.git
cd generator-wax
npm install
npm link
```

Then test it in a scratch directory:

```bash
mkdir /tmp/wax-test && cd /tmp/wax-test
yo wax
```

## License

MIT
