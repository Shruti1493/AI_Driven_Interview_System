from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate

# Hugging Face Model Setup
llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.3",
    max_new_tokens=1000
)

chat = ChatHuggingFace(llm=llm, verbose=True)

# Input Model using Pydantic
class EvaluationInput(BaseModel):
    question: str
    candidate_answer: str

# Prompt Template
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

# Formatting the input for the prompt
def format_input_for_prompt(input_data: EvaluationInput):
    return evaluation_prompt.format(
        question=input_data.question,
        candidate_answer=input_data.candidate_answer
    )

# Evaluation Function
def evaluate(input_data: EvaluationInput):
    formatted_query = format_input_for_prompt(input_data)
    result = chat.invoke(formatted_query)  # Invoking the model
    return result.content  # Accessing the 'content' attribute of the AIMessage object

# Example usage
if __name__ == "__main__":
    # Example input
    input_data = EvaluationInput(
        question="What is the time complexity of quicksort?",
        candidate_answer="The time complexity is O(n^2) in the worst case."
    )
    
    # Evaluate candidate's answer
    evaluation_result = evaluate(input_data)
    print(evaluation_result)
