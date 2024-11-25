# AI-Powered Interview Preparation Platform

An advanced AI-driven platform to assist users in preparing for interviews by analyzing resumes, video responses, and audio inputs to generate feedback, questions, and actionable insights.

---

## Features

### Retrieval-Augmented Generation (RAG) Module
- **Resume Processing**: 
  - Splits resumes into chunks for embedding creation using Langchain.
  - Embeddings are stored in **ChromaDB**.
- **Question Generation**:
  - Retrieves contextually relevant documents using a **Retriever**.
  - Combines the retrieved context with a **Prompt Chain**.
  - Passes the query to an **LLM** to generate tailored interview questions.

### Video Analysis Module
- Processes user videos using a pre-trained **Facial Expression Recognition (FER)** model.
- Predicts emotions and calculates **stress levels** using a weighted average.
- Generates detailed **emotion and stress reports**.

### Audio Analysis Module
- Converts speech to text and analyzes tone, pace, and relevance.
- Provides **relevancy scores** and feedback for spoken responses.

### User-Friendly Frontend
- Upload resumes for question generation.
- Record and upload video and audio responses.
- Access feedback and performance reports through an intuitive dashboard.

---

## Workflow

1. **Resume Processing**:
   - The user uploads a resume, which is processed by the backend for chunking, embedding, and storage.
   - Relevant documents are retrieved, and an LLM generates interview questions.
   
2. **Mock Interview**:
   - Users record video and audio responses, which are analyzed for emotional insights and relevancy.
   
3. **Feedback and Reports**:
   - Emotional scores, stress levels, and relevancy scores are compiled into a detailed report for improvement suggestions.

---

## Technologies Used

- **Frontend**: React, TailwindCSS
- **Backend**: FastAPI, Langchain, ChromaDB
- **Video Analysis**: Pre-trained FER model (Facial Expression Recognition)
- **Audio Analysis**: Speech-to-text and tone/pacing analysis
- **Database**: ChromaDB for vector embeddings
- **Hosting**: AWS

---

## Architecture

### Retrieval-Augmented Generation (RAG) Module
1. **Resume Processing**:
    - Documents are chunked and embedded.
    - Embeddings are stored in a **Vector DB**.
    - Contextually relevant documents are retrieved for question generation.
2. **Prompt Chain**:
    - Combines retrieved context with user queries.
    - Generates interview questions using an **LLM**.

### Video Module
1. **FER Model**:
    - Processes user videos to predict emotional states.
2. **Stress Analysis**:
    - Computes stress levels based on emotions.
3. **Report Generation**:
    - Outputs a comprehensive analysis of user emotions and stress.

### Audio Module
1. **Speech Analysis**:
    - Analyzes audio responses for tone, pace, and relevance.
2. **Scoring**:
    - Provides a relevancy score with suggestions for improvement.

---

## How to Run

1. **Setup Backend**:
   - Clone the repository.
   - Navigate to the backend directory and install dependencies.
   - Run the RAG, video analysis, and audio analysis modules using FastAPI.

2. **Setup Frontend**:
   - Navigate to the frontend directory.
   - Install dependencies using `npm install`.
   - Start the frontend server using `npm start`.

3. **Access the Application**:
   - Open the frontend in your browser, upload a resume, and start a mock interview.

---

## Future Enhancements
 
- Advanced stress and tone analysis using deep learning models.

---

This project bridges traditional interview preparation techniques with modern AI tools, providing users with detailed insights and personalized feedback.
