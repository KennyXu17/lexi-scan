from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any
from fastapi import UploadFile, File
import PyPDF2
import os
from dotenv import load_dotenv
import openai
import io

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议指定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class ComplianceRule(BaseModel):
    id: str
    title: str
    category: str
    severity: str
    type: str
    keywords: List[str] = []
    pattern: str = ""
    explanation: str = ""
    suggestion: str = ""
    examples: List[str] = []
    enabled: bool = True

class ScanRequest(BaseModel):
    contractText: str
    rules: List[ComplianceRule]

class ScanResult(BaseModel):
    ruleId: str
    status: str
    matches: List[Any]
    rationale: str
    suggestions: List[str]

class ScanResponse(BaseModel):
    results: List[ScanResult]
    overallScore: int

# 内存规则存储（仅测试用）
RULES_DB: List[ComplianceRule] = []

@app.get("/api/rules")
def get_rules():
    # 返回所有规则（如无则返回空列表）
    return [rule.dict() for rule in RULES_DB]

@app.post("/api/rules")
def save_rules(rules: List[ComplianceRule]):
    global RULES_DB
    RULES_DB = rules
    return {"success": True}

# @app.post("/api/scan", response_model=ScanResponse)
# def scan_contract(req: ScanRequest):
#     # 这里只做简单 mock，实际可调用 NLP 模型
#     results = []
#     for rule in req.rules:
#         if rule.enabled:
#             found = rule.keywords and any(k.lower() in req.contractText.lower() for k in rule.keywords)
#             status = "pass" if found else "fail"
#             results.append(ScanResult(
#                 ruleId=rule.id,
#                 status=status,
#                 matches=[k for k in rule.keywords if k.lower() in req.contractText.lower()] if found else [],
#                 rationale=f"Rule {'matched' if found else 'not matched'}",
#                 suggestions=[rule.suggestion] if not found and rule.suggestion else []
#             ))
#     overallScore = int(100 * sum(1 for r in results if r.status == "pass") / len(results)) if results else 0
#     return ScanResponse(results=results, overallScore=overallScore)

@app.post("/api/scan", response_model=ScanResponse)
def scan_contract(req: ScanRequest):
    results = []
    for rule in req.rules:
        if rule.enabled:
            prompt = f"""合同内容如下：
{req.contractText}

请判断下面的合规规则是否被满足，并简要说明理由：
规则：{rule.title}
要求：{rule.explanation}
请只回答"pass"或"fail"，并给出一句理由。"""
            try:
                client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0,
                )
                answer = response.choices[0].message.content.strip().lower()
                status = "pass" if "pass" in answer else "fail"
                rationale = answer
            except Exception as e:
                status = "fail"
                rationale = f"OpenAI 调用失败: {e}"

            results.append(ScanResult(
                ruleId=rule.id,
                status=status,
                matches=[],
                rationale=rationale,
                suggestions=[rule.suggestion] if status == "fail" and rule.suggestion else []
            ))
    overallScore = int(100 * sum(1 for r in results if r.status == "pass") / len(results)) if results else 0
    return ScanResponse(results=results, overallScore=overallScore)
# 启动命令： uvicorn main:app --reload --host 0.0.0.0 --port 5000

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    reader = PyPDF2.PdfReader(io.BytesIO(contents))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    print("Extracted text:", text)  # 可选，调试用
    return {"text": text}