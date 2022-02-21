# Simple Project CLI

A simple CLI application for generating frontend typescript project starters on the windows platform.

## Install
  ```bash
  yarn add --global simple-project-cli
  ```

**NOTE** You must add simple-project-cli to your environment PATH

### Use

```bash
project-cli [project name] ([--template-flag] --specific-flag) 
```

#### Templates Flags:

  - Basic
    - `--basic`
    - `-b`
  - Canvas
    - `--canvas`
    - `-c`
  - React
    - `--react`
    - `-r`

##### Specific Flags:

  - React Router 
    - `--router`
    - `-rr`
  - React Hook Forms
    - `--forms`
    - `-rf`

Examples:

```bash
  project-cli project-name    # creates a basic project
```

```bash
  project-cli project-name --canvas   # creates a canvas project
```

```bash
  project-cli project-name --react   # creates a react project
```

```bash
  project-cli project-name -r --forms   # creates a react project with hook forms
```

```bash
  project-cli project-name --react --router   # creates a react project with router
```

```bash
  project-cli project-name --react --router --forms   # creates a react project with hook-forms & react-router
```