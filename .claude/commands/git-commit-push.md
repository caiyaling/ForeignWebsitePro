---
description: Commit and push current changes with clear commit message
---

# Commit and Push

执行以下步骤：

1. 运行 `git status` 和 `git diff` 查看当前的代码修改
2. 分析修改内容，用中文总结成清晰的 commit message，格式要求：
    - 第一行是简短的总结（不超过 50 个字符）
    - 空一行后用 bullet points 列出具体的修改点
    - 不要添加任何 Claude Code 相关的信息（如 "Generated with Claude Code" 或 "Co-Authored-By"）
3. 把草拟的 commit message 展示给我确认
4. 等待我确认后，执行 `git add .` 和 `git commit`
5. commit 成功后，执行 `git push` 推送到远端
6. 报告最终结果

注意：必须等待我明确确认 commit message 后才能执行提交操作