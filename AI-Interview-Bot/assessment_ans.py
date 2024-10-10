from fastapi import FastAPI, HTTPException
import uvicorn
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
# 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

# from huggingface_hub import login
# login() 

class EvaluationInput(BaseModel):
    question: str
    candidate_answer: str


llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.3",
    max_new_tokens=100000

)

app = FastAPI(
    title="response",
    description="A simple API for response",
    version="0.1",
)

chat = ChatHuggingFace(llm=llm, verbose=True)

evaluation_prompt = PromptTemplate.from_template(
    """
You are an experienced hiring manager with expertise in evaluating candidate responses during technical interviews.

Question:
{question}

Candidate's Answer:
{candidate_answer}

Your task is to:
1. Provide an expected ideal response to the above question in short.
2. Assess the candidate's answer and assign a relevancy score between 0 to 5, where 0 indicates no relevance and 5 indicates high relevance.

Please format your response as follows:

Expected Response:
<expected_response>

Relevancy Score:
<score>
    """
)

def format_input_for_prompt(input_data: EvaluationInput):
    return evaluation_prompt.format(
        question=input_data.question,
        candidate_answer=input_data.candidate_answer
    )



# result = chat.invoke(formatted_query)
# print(result.content)

@app.post("/evaluate")
async def evaluate(input_data: EvaluationInput):
    question = input_data.question
    candidate_answer = input_data.candidate_answer
    query = EvaluationInput(
        question=question,
        candidate_answer=candidate_answer
    )
    formatted_query = format_input_for_prompt(query)
    result = chat.invoke(formatted_query)
    print(result.content)
    return result.content

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8005)

