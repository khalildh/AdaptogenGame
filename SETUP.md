# Steps to Connect to GitHub Codespaces via SSH on Windows

## 1. Install GitHub CLI

1. Download and install the GitHub CLI from GitHub's official site.
2. Open Command Prompt and run `gh auth login` to authenticate your GitHub account.

## 2. Install Visual Studio Code Remote Development Extension

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the sidebar or pressing Ctrl+Shift+X.
3. Search for "Remote Development" and install the extension pack by Microsoft.

## 3. Check and Set Up SSH

1. Open Command Prompt and type `where gh` to ensure the GitHub CLI is correctly installed and added to your PATH.
2. If `gh` is not found, add its installation directory (usually `C:\Program Files\GitHub CLI`) to your system's PATH.

## 4. Generate SSH Key (if needed)

1. Run `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"` in Command Prompt to generate a new SSH key.
2. Follow the prompts to save the key and set a passphrase (optional).

## 5. Update SSH Config File

1. Navigate to `C:\Users\yourusername\.ssh\`. If a config file doesn't exist, create one using a text editor like Notepad.
2. Add the following configuration, replacing placeholders with your actual data:

```
Host my-codespace
    User codespace
    ProxyCommand "C:\Program Files\GitHub CLI\gh.exe" cs ssh -c your-codespace-name --stdio
    UserKnownHostsFile=nul
    StrictHostKeyChecking no
    LogLevel quiet
    ControlMaster auto
    IdentityFile "C:\Users\yourusername\.ssh\id_rsa"
```

## 6. List Available Codespaces

1. In Command Prompt, run `gh codespace list` to retrieve the names of your available codespaces.
2. Identify the codespace you want to connect to and use its name in the SSH config file (`your-codespace-name`).

## 7. Connect via Cursor IDE

1. Open Cursor IDE.
2. Navigate to the "Remotes" tab.
3. Select SSH for the connection type.
4. Connect using the host alias defined in your SSH config (`my-codespace`).

These steps should provide all the necessary information to get started with connecting to GitHub Codespaces via SSH on Windows.