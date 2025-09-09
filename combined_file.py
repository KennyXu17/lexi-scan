import os

workspace = "."
output_file = "workspace_content.txt"

with open(output_file, "w", encoding="utf-8") as f:
    for root, _, files in os.walk(workspace):
        for file in files:
            if file.endswith((".py", ".js", ".ts", ".json", ".md",".html", ".tsx")):  # 挑选文件类型
                path = os.path.join(root, file)
                f.write(f"\n\n### File: {path}\n\n")
                with open(path, "r", encoding="utf-8", errors="ignore") as rf:
                    f.write(rf.read())
