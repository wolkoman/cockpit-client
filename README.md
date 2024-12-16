# 🚀 Cockpit Client CLI

A powerful CLI tool to generate client output files for **Cockpit CMS v1 projects**. This tool automates creating **type-safe TypeScript client code** for seamless interaction with Cockpit collections and entries.

---

## ✨ Features

- **🔍 Collection Management**: Effortlessly fetch collection entries.
- **🛠️ TypeScript Code Generation**: Automatically generate **type-safe** client code.
- **📦 Singleton Support**: Cockpit's native singleton support is limited. Use a special collection called `internal-data` where each entry is treated as a singleton in the generated code.

---

## ⚙️ Installation

1. **Install the package**:
    ```
    npm i cockpit-client
    ```

2.	Create a .env file in the project root with the following variables:

    ```
    COCKPIT_HOST=http://your-cockpit-host
    COCKPIT_TOKEN=your-cockpit-token
    ```

3.	Add a script like this one:

     ```
    ./cockpit-client generate (-o, --output <path>: Specify the output file path.)
    ```


