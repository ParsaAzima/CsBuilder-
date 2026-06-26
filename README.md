# 🎯 CsBuilder – Pro CFG Builder for Counter-Strike

**CsBuilder** is a powerful and beautiful desktop application that allows you to visually build your own custom configuration file (`autoexec.cfg`) for *Counter-Strike 2 (CS2)*, *Counter-Strike: Source (CSS)*, and *Counter-Strike 1.6* – all without writing a single line of code.

With this tool, you can manage every important setting, from crosshair and mouse sensitivity to audio, network, key binds, and many more options. Once you're done, export your final config as a `.cfg` file and copy it directly to your game directory.

---

## ✨ Key Features

- **🎮 Supports Three Versions:** CS2, CSS, and CS 1.6 (with dedicated themes and color schemes for each game)
- **🖌️ Advanced Crosshair Editor:** Adjust size, gap, thickness, color, alpha, outline, and even import CS2 share codes
- **🎯 Built-in eDPI Calculator:** See your effective DPI in real-time with a recommendation indicator (good/bad range) and a list of pro player settings
- **🔄 Sensitivity Converter:** Convert your mouse sensitivity between popular games like Valorant, Apex Legends, Overwatch, and Fortnite
- **⌨️ Full Key Bind Manager:** Easily add, edit, or remove key binds using an interactive table
- **📦 Ready-to-Use Aliases:** Includes jump-throw, quick peek, full buy script, crouch jump, volume toggle, and more
- **🎬 Practice Mode Generator:** Quickly generate practice server commands with infinite ammo, bot controls, noclip, and grenade practice tools
- **📋 Live CFG Preview:** See your generated config update in real-time as you adjust settings
- **💾 Import / Export:** Load existing `.cfg` files to edit them, or save your new config with one click
- **⚡ Preset System:** Quickly apply pro, low-end PC, FACEIT, casual, or default presets
- **🎨 Modern UI with Dark Theme:** Built with a sleek, terminal-inspired interface optimized for gamers
- **📦 Standalone Desktop App:** Built with Electron for cross-platform use (Windows, macOS, Linux)

---

## 🖥️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Desktop Framework:** Electron
- **Styling:** Custom CSS with CSS variables and a dark theme
- **State Management:** Direct DOM manipulation with reactive event listeners

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ParsaAzima/CsBuilder.git
cd CsBuilder
npm install
```

Running the App

Start the application in development mode:
bash

npm start

Building for Production

To build the app for your platform:
bash

npm run build

This will generate a distributable installer/package in the dist/ folder.
📂 Project Structure
text

CsBuilder/
├── index.html              # Main HTML structure
├── style.css               # All styles (dark theme, layouts, components)
├── renderer.js             # Main application logic (settings, UI updates, CFG generation)
├── main.js                 # Electron main process (window management, IPC handlers)
├── preload.js              # Secure bridge between renderer and main process
├── package.json            # Project manifest and dependencies
└── README.md               # This file

🎮 Supported Games
Game	Badge Color	Status
CS2	#00ffd0	✅ Full support
CSS	#ff9c00	✅ Full support
CS 1.6	#ff4060	✅ Full support
📸 Screenshots

(Screenshots go here – you can add them after uploading the project)
🤝 Contributing

Contributions are welcome! If you have an idea for a new feature or find a bug, feel free to open an issue or submit a pull request.

    Fork the repository

    Create your feature branch (git checkout -b feature/amazing-feature)

    Commit your changes (git commit -m 'Add some amazing feature')

    Push to the branch (git push origin feature/amazing-feature)

    Open a Pull Request

📄 License

This project is licensed under the BSD 3-Clause License – see the LICENSE file for details.
👨‍💻 Author

Parsa Azima
GitHub
🙏 Acknowledgments

    Inspired by the need for a modern, visual CFG builder for the Counter-Strike community

    Built with ❤️ using Electron and vanilla web technologies

    Special thanks to the CS community for their endless config knowledge

⭐ Support

If you find this project useful, please consider giving it a star on GitHub! It helps others discover the tool and keeps me motivated to improve it.
text


Changes made:
- ✅ Updated project structure to show all files in root (no `src/` folder)
- ✅ Removed `assets/` folder reference
- ✅ Changed license from MIT to BSD 3-Clause
- ✅ Removed `src/` prefix from file paths in structur
