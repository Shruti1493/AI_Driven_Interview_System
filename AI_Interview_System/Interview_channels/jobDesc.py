 


# from pydantic import BaseModel
# from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
# from langchain_core.prompts import PromptTemplate
# from typing import Optional

# # Hugging Face Model Setup
# llm = HuggingFaceEndpoint(
#     repo_id="mistralai/Mistral-7B-Instruct-v0.3",
#     max_new_tokens=1000
# )

# chat = ChatHuggingFace(llm=llm, verbose=True)

# # Input Model using Pydantic
# class EvaluationInput(BaseModel):
#     designation: str
#     required_skills: str
#     qualifications: str
#     objectives: str
#     responsibilities: str
#     preferred_skills: str
#     year_experience: Optional[int] = None  

# # Prompt Template
# evaluation_prompt = PromptTemplate.from_template(
#     """
#     You are an experienced hiring manager with expertise in evaluating candidates for specific job roles.

#     Job Role: {designation}

#     Required Skills:
#     {required_skills}

#     Qualifications:
#     {qualifications}

#     Objectives of the Role:
#     {objectives}

#     Responsibilities:
#     {responsibilities}

#     Preferred Skills:
#     {preferred_skills}

#     Years of Experience: {year_experience}

#     Based on the above job description, generate:
#     1. Provide 5 questions to ask candidate
     
#     Please format your response as follows:

#     Question:
#     """
# )

# # Formatting the input for the prompt
# def format_input_for_prompt(input_data: EvaluationInput):
#     return evaluation_prompt.format(
#         designation=input_data.designation,
#         required_skills=input_data.required_skills,
#         qualifications=input_data.qualifications,
#         objectives=input_data.objectives,
#         responsibilities=input_data.responsibilities,
#         preferred_skills=input_data.preferred_skills,
#         year_experience=input_data.year_experience if input_data.year_experience else "Not specified"  # Add year_experience to the prompt
#     )

# # Evaluation Function
# def evaluate(input_data: EvaluationInput):
#     formatted_query = format_input_for_prompt(input_data)
#     result = chat.invoke(formatted_query)  # Invoking the model
#     return result["content"] if "content" in result else result  # Access the 'content' attribute

# # Example usage
# if __name__ == "__main__":
#     # Example input
#     input_data = EvaluationInput(
#         designation="Software Developer",
#         required_skills="Python, Django, React",
#         qualifications="Bachelor's degree in Computer Science or related field",
#         objectives="Develop and maintain web applications",
#         responsibilities="Write clean, scalable code; Collaborate with cross-functional teams",
#         preferred_skills="AWS, Docker, CI/CD tools",    
#         year_experience=1  # This is valid and will be included in the prompt
#     )
    
#     # Generate interview questions
#     evaluation_result = evaluate(input_data)
#     print("Generated Interview Content:")
#     print(evaluation_result)
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from typing import Optional

# Hugging Face Model Setup
llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.3",
    max_new_tokens=1000
)

chat = ChatHuggingFace(llm=llm, verbose=True)

# Input Model using Pydantic
class EvaluationInput(BaseModel):
    designation: str
    required_skills: str
    qualifications: str
    objectives: str
    responsibilities: str
    preferred_skills: str
    year_experience: Optional[int] = None  # Optional field

# Prompt Template
evaluation_prompt = PromptTemplate.from_template(
    """
    You are an experienced hiring manager with expertise in evaluating candidates for specific job roles.

    Job Role: {designation}

    Required Skills:
    {required_skills}

    Qualifications:
    {qualifications}

    Objectives of the Role:
    {objectives}

    Responsibilities:
    {responsibilities}

    Preferred Skills:
    {preferred_skills}

    Years of Experience: {year_experience}

    Based on the above job description, generate:
    1. Provide 4 questions to ask the candidate
    
   
    """
)

# Formatting the input for the prompt
def format_input_for_prompt(input_data: EvaluationInput):
    return evaluation_prompt.format(
        designation=input_data.designation,
        required_skills=input_data.required_skills,
        qualifications=input_data.qualifications,
        objectives=input_data.objectives,
        responsibilities=input_data.responsibilities,
        preferred_skills=input_data.preferred_skills,
        year_experience=input_data.year_experience if input_data.year_experience else "Not specified"  # Add year_experience to the prompt
    )

# Evaluation Function
def evaluate(input_data: EvaluationInput):
    formatted_query = format_input_for_prompt(input_data)
    result = chat.invoke(formatted_query)  # Invoking the model
    return result["content"] if "content" in result else result  # Access the 'content' attribute

# Example usage
if __name__ == "__main__":
    # Example input
    input_data = EvaluationInput(
        designation="Software Developer",
        required_skills="Python, Django, React",
        qualifications="Bachelor's degree in Computer Science or related field",
        objectives="Develop and maintain web applications",
        responsibilities="Write clean, scalable code; Collaborate with cross-functional teams",
        preferred_skills="AWS, Docker, CI/CD tools",    
        year_experience=1  # This is valid and will be included in the prompt
    )
    
    # Generate interview questions
    evaluation_result = evaluate(input_data)
    print("Generated Interview Content:")
    print(evaluation_result)
