---
title: Using GitHub Actions
---

GitHub Actions are a way to automate tasks on GitHub. They are similar to GitLab CI or Travis CI, but they are built into GitHub. You can use them to automatically build and deploy your website to dawdle.space whenever you push to your repository.

Currently, the recommended way to use GitHub Actions is to upload your files via WebDAV.
You can use the [File Uploader](https://github.com/bxb100/action-upload) action to do this.

## Example

```yaml
- name: Upload to Dawdle.space
  uses: bxb100/action-upload@main
  with:
    provider: webdav
    provider_options: |
      endpoint=https://dawdle.space/api/webdav/
      username=${{ secrets.WEBDAV_USERNAME }}
      password=${{ secrets.WEBDAV_PASSWORD }}
      root=/public
    include: "dist/**"
```

This action isn't that actively maintained, so in the future we might add a better way to do this.
