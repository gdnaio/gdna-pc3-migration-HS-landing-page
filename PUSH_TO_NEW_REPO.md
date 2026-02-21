# Push Template to New Repository

## Steps to Create and Push to gdna-aidlc-kiro-standards-template

### 1. Create New Repository on GitHub

Go to GitHub and create a new repository:
- Name: `gdna-aidlc-kiro-standards-template`
- Description: "g/d/n/a AIDLC Kiro Standards Template - Development standards configuration for AI-driven projects"
- Visibility: Private (or Public if you want)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 2. Push This Branch to New Repository

```bash
# Add the new repository as a remote
git remote add template git@github.com:YOUR_USERNAME/gdna-aidlc-kiro-standards-template.git

# Push the template branch to the new repo's main branch
git push template gdna-standards-template:main

# Optionally, set up branch tracking
git branch --set-upstream-to=template/main gdna-standards-template
```

### 3. Make it a Template Repository (Optional)

On GitHub:
1. Go to repository Settings
2. Scroll to "Template repository" section
3. Check "Template repository"

This allows users to click "Use this template" to create new projects.

### 4. Clean Up (Optional)

If you want to remove the template branch from the a10dit repository:

```bash
# Switch back to main
git checkout main

# Delete local template branch
git branch -D gdna-standards-template

# If you pushed it to origin, delete remote branch
git push origin --delete gdna-standards-template
```

## Alternative: Push Directly Without Adding Remote

```bash
# One-time push to new repository
git push git@github.com:YOUR_USERNAME/gdna-aidlc-kiro-standards-template.git gdna-standards-template:main
```

## What's Included in This Template

- `.kiro/` directory with all standards and scripts
- `README.md` with usage instructions
- `LICENSE` file
- `.gitignore` template

## What's NOT Included

- Project-specific source code
- node_modules
- Build artifacts
- Environment files
- Test coverage reports
- Deployment configurations

## Next Steps After Pushing

1. ✅ Verify the repository on GitHub
2. ✅ Update README.md with correct GitHub URLs if needed
3. ✅ Add repository description and topics on GitHub
4. ✅ Set up branch protection rules (optional)
5. ✅ Share with team members

## Using the Template

Team members can now:

```bash
# Clone the template
git clone git@github.com:YOUR_USERNAME/gdna-aidlc-kiro-standards-template.git my-new-project

# Or use GitHub's "Use this template" button
```

---

*Ready to push? Run the commands above!*
