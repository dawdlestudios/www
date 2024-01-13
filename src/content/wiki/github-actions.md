---
title: Using GitHub Actions
---

GitHub Actions are a way to automate tasks on GitHub. They are similar to GitLab CI or Travis CI, but they are built into GitHub. You can use them to automatically build and deploy your website to dawdle.space whenever you push to your repository.

Using them, you can build super nice setups where you can just edit some markdown files in your repository and have them automatically build and deployed to your server.

Currently, the recommended way to use GitHub Actions is to upload your files via rsync or WebDAV.

## Rsync Example

Be sure to add a new SSH key to your account first. Then, add the private key to your repository secrets as `DEPLOY_KEY`.

```yaml
- uses: actions/checkout@v3
- name: Upload to Dawdle.space
  uses: burnett01/rsync-deployments@6.0.0
  with:
    switches: -avzr --delete
    path: dist/
    remote_path: /home/yourusername/public
    remote_host: dawdle.space
    remote_user: yourusername
    remote_key: ${{ secrets.DEPLOY_KEY }}
```
