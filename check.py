#!/usr/bin/env python3
"""
JARVIS AI OS UI - Launch Utility
Checks environment, installs deps, and starts the development server.
"""

import os
import sys
import subprocess
import webbrowser
import time
import json
import shutil

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

COLORS = {
    'cyan': '\033[96m',
    'blue': '\033[94m',
    'purple': '\033[95m',
    'green': '\033[92m',
    'yellow': '\033[93m',
    'red': '\033[91m',
    'reset': '\033[0m',
    'bold': '\033[1m',
    'dim': '\033[2m',
}

def c(text, color):
    return f"{COLORS.get(color, '')}{text}{COLORS['reset']}"

def banner():
    print()
    print(c('╔══════════════════════════════════════════════════╗', 'cyan'))
    print(c('║', 'cyan') + c('  ╔═╗╦ ╦╦═╗╦ ╦╦╔═╗  ╔╗╔╔═╗  ╦  ', 'cyan') + c('       ║', 'cyan'))
    print(c('║', 'cyan') + c('  ╠═╣║ ║╠╦╝║ ║║║╣   ║║║║ ║  ║  ', 'cyan') + c('       ║', 'cyan'))
    print(c('║', 'cyan') + c('  ╩ ╩╚═╝╩╚═╚═╝╩╚═╝  ╝╚╝╚═╝  ╩  ', 'cyan') + c('       ║', 'cyan'))
    print(c('║', 'cyan') + c('  Artificial Intelligence Operating System', 'purple') + c('  ║', 'cyan'))
    print(c('║', 'cyan') + c('  ──────────────────────────────────────', 'dim') + c('  ║', 'cyan'))
    print(c('║', 'cyan') + c('  NEURAL CORE • QUANTUM PROCESSING', 'blue') + c('            ║', 'cyan'))
    print(c('║', 'cyan') + c('  HOLOGRAPHIC INTERFACE v3.0', 'blue') + c('                  ║', 'cyan'))
    print(c('╚══════════════════════════════════════════════════╝', 'cyan'))
    print()

def check_node():
    print(c('⟐ Checking Node.js...', 'blue'))
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True, check=True)
        version = result.stdout.strip().lstrip('v')
        major = int(version.split('.')[0])
        if major >= 18:
            print(c(f'  ✓ Node.js v{version} detected', 'green'))
            return True
        else:
            print(c(f'  ✗ Node.js v{version} found, need >= 18', 'red'))
            return False
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(c('  ✗ Node.js not found. Install from https://nodejs.org', 'red'))
        return False

def check_npm():
    print(c('⟐ Checking npm...', 'blue'))
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True, check=True)
        print(c(f'  ✓ npm v{result.stdout.strip()}', 'green'))
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(c('  ✗ npm not found.', 'red'))
        return False

def check_dependencies():
    print(c('⟐ Checking project dependencies...', 'blue'))
    node_modules = os.path.join(PROJECT_DIR, 'node_modules')
    package_json = os.path.join(PROJECT_DIR, 'package.json')

    if not os.path.exists(package_json):
        print(c('  ✗ package.json not found', 'red'))
        return False

    if not os.path.exists(node_modules):
        print(c('  ⚠ node_modules missing, installing...', 'yellow'))
        subprocess.run(['npm', 'install'], cwd=PROJECT_DIR, check=True)
        print(c('  ✓ Dependencies installed', 'green'))
        return True

    # Quick check: are key deps present?
    key_packages = ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion']
    missing = []
    for pkg in key_packages:
        pkg_path = os.path.join(node_modules, pkg)
        if not os.path.exists(pkg_path):
            missing.append(pkg)

    if missing:
        print(c(f'  ⚠ Missing packages: {", ".join(missing)}', 'yellow'))
        print(c('  Running npm install...', 'yellow'))
        subprocess.run(['npm', 'install'], cwd=PROJECT_DIR, check=True)
        print(c('  ✓ Dependencies installed', 'green'))
    else:
        print(c('  ✓ All dependencies found', 'green'))

    return True

def check_build():
    print(c('⟐ Checking build...', 'blue'))
    dist_dir = os.path.join(PROJECT_DIR, 'dist')
    if os.path.exists(dist_dir):
        print(c('  ✓ Production build exists', 'green'))
        return True
    else:
        print(c('  ⚠ No production build found', 'yellow'))
        return False

def launch_dev():
    print()
    print(c('┌──────────────────────────────────────────────┐', 'cyan'))
    print(c('│', 'cyan') + c('  INITIALIZING NEURAL CORE...', 'purple') + c('              │', 'cyan'))
    print(c('│', 'cyan') + c('  CONNECTING HOLOGRAPHIC LAYERS...', 'purple') + c('           │', 'cyan'))
    print(c('│', 'cyan') + c('  LAUNCHING DEVELOPMENT SERVER...', 'purple') + c('             │', 'cyan'))
    print(c('│', 'cyan') + c('  ─────────────────────────────────', 'dim') + c('           │', 'cyan'))
    print(c('│', 'cyan') + c('  ', 'purple') + c('http://localhost:5173', 'cyan') + c('                       │', 'cyan'))
    print(c('│', 'cyan') + c('  ', 'dim') + c('Press Ctrl+C to terminate', 'dim') + c('              │', 'cyan'))
    print(c('└──────────────────────────────────────────────┘', 'cyan'))
    print()

    try:
        time.sleep(1)

        def open_browser():
            time.sleep(2)
            webbrowser.open('http://localhost:5173')

        import threading
        t = threading.Thread(target=open_browser, daemon=True)
        t.start()

        subprocess.run(['npx', 'vite', '--host'], cwd=PROJECT_DIR, check=True)
    except KeyboardInterrupt:
        print(c('\n⏹  System shutdown complete.', 'yellow'))
    except subprocess.CalledProcessError as e:
        print(c(f'\n✗ Failed to start: {e}', 'red'))
        sys.exit(1)

def launch_prod():
    print()
    print(c('┌──────────────────────────────────────────────┐', 'cyan'))
    print(c('│', 'cyan') + c('  BUILDING PRODUCTION SYSTEM...', 'blue') + c('                │', 'cyan'))
    print(c('│', 'cyan') + c('  ─────────────────────────────────', 'dim') + c('           │', 'cyan'))
    print(c('└──────────────────────────────────────────────┘', 'cyan'))
    print()

    try:
        subprocess.run(['npx', 'vite', 'build'], cwd=PROJECT_DIR, check=True)
        print(c('✓ Build complete. Opening preview...', 'green'))
        time.sleep(1)

        def open_browser():
            time.sleep(1.5)
            webbrowser.open('http://localhost:4173')

        import threading
        t = threading.Thread(target=open_browser, daemon=True)
        t.start()

        subprocess.run(['npx', 'vite', 'preview', '--host'], cwd=PROJECT_DIR, check=True)
    except KeyboardInterrupt:
        print(c('\n⏹  System shutdown complete.', 'yellow'))
    except subprocess.CalledProcessError as e:
        print(c(f'\n✗ Build failed: {e}', 'red'))
        sys.exit(1)

def show_help():
    print()
    print(c('USAGE:', 'bold'))
    print(f'  {c("python check.py", "cyan")}          {c("— Start dev server (default)", "dim")}')
    print(f'  {c("python check.py --dev", "cyan")}    {c("— Start dev server", "dim")}')
    print(f'  {c("python check.py --build", "cyan")}  {c("— Build for production", "dim")}')
    print(f'  {c("python check.py --prod", "cyan")}   {c("— Build + preview production", "dim")}')
    print(f'  {c("python check.py --check", "cyan")}  {c("— Only check environment", "dim")}')
    print(f'  {c("python check.py --help", "cyan")}   {c("— Show this help", "dim")}')
    print()

def main():
    args = sys.argv[1:]

    banner()

    if '--help' in args or '-h' in args:
        show_help()
        return

    only_check = '--check' in args

    # Step 1: Check environment
    env_ok = check_node() and check_npm()
    if not env_ok:
        sys.exit(1)

    deps_ok = check_dependencies()
    if not deps_ok:
        sys.exit(1)

    if only_check:
        check_build()
        print()
        print(c('✓ System check complete — all systems nominal', 'green'))
        return

    # Step 2: Launch
    if '--build' in args:
        print(c('⟐ Building for production...', 'blue'))
        subprocess.run(['npx', 'vite', 'build'], cwd=PROJECT_DIR, check=True)
        print(c('✓ Build complete.', 'green'))
    elif '--prod' in args:
        launch_prod()
    else:
        launch_dev()

if __name__ == '__main__':
    main()
