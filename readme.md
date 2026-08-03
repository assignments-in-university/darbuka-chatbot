# Sout Chatbot

<img src="./frontend/src/assets/images/logo.jpg" width="160" align="right">

### Introduction

A cute little chatbot app for the Darbuka drum! Features a chatbot, custom learning course generation, and a 3d visualizer with audio. Made with love for a university project :)

NOTE: The project uses the free tier Gemini model, so please be vary about the number of messages you send- Thank you!

### Features

- **Chatbot:** uses an LLM that is connected to a RAG pipeline with knowledge base of the Darbuka drum, maintained in a Supabase vector database.
- **Course Generation:** uses the same LLM API to generate a course for users based on their learning goals and time limits.
- **3D Visualizer:** loads a 3D drum using ThreeJs that is used to visualize the drum - complete with a soundtrack as well!

### Teck Stack That I Used

**Backend:**

- _Supabase:_ Vector database for RAG pipeline.
- _ExpressJs:_ Backend API routes to get curated LLM responses.

**Frontend:**

- _VueJs:_ Frontend fraemwork used to develop the UI.
- _TailwindCSS:_ Frontend framework used for consistent styling across the application.
- _ThreeJs:_ Framework for loading, rendering, and manipulating 3D drum asset.

### How To Use

When you first visit the website, you'll be redirected to the settings page. Just fill that up, generate a course, and you're ready to talk to Sout.

There are two types of chats you can start: **Normal Mode** and **Learning Mode**.

#### Normal Chats

Normal chats are basically your ChatGPT-style model that answers any question you ask it about the Darbuka drum. Simple and quick to test and use, but not very goal-oriented or meaningful.

#### Learning Chats

Learning chats are a little more complicated: the chatbot's goal is to teach you the content in the course you generated! You can ask questions about the lessons it teaches you, move forward in your lesson, or even ask it to re-explain a past lesson.

### Chatbot Features

The chatbot has memory context, meaning it remembers a few of the previous messages. It also has access to your settings, so that it can provide more personalized responses to you.
