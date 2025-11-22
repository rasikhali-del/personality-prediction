# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/648a60cb-3884-477a-88db-c0ca5c9282f7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/648a60cb-3884-477a-88db-c0ca5c9282f7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/648a60cb-3884-477a-88db-c0ca5c9282f7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Personality Prediction Project

## Overview

This project is a personality prediction system built using Django (backend) and a frontend framework. It uses several ML models to predict personality traits and analyze speech emotion.

## Project Structure

project/
├─ backend/
│ └─ personality_app/
│ └─ models/
│ ├─ microsoft_model/
│ │ └─ model.safetensors
│ ├─ bigfive-regression-model/
│ │ └─ model.safetensors
│ └─ SpeechEmotionModel/
│ ├─ 312weight.h5
│ └─ \_mini_XCEPTION.102-0.66.hdf5
├─ frontend/
│ └─ ...
└─ .gitignore

bash
Copy code

## Setup Instructions

### 1. Clone the repository

````bash
git clone https://github.com/Shafaq41336/personality-prediction.git
cd personality-prediction

2. Create Python virtual environment
bash
Copy code
python -m venv venv
# Activate the environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

3. Install dependencies
bash
Copy code
pip install -r requirements.txt

4. Download models
The ML models are not included in GitHub due to their large size.

Please download the following models from the shared link:
Download all models

After downloading, place them in the exact folder paths:

swift
Copy code
backend/personality_app/models/microsoft_model/model.safetensors
backend/personality_app/models/bigfive-regression-model/model.safetensors
backend/personality_app/models/SpeechEmotionModel/312weight.h5
backend/personality_app/models/SpeechEmotionModel/_mini_XCEPTION.102-0.66.hdf5

5. Run the project
For Django backend:

bash
Copy code
python manage.py runserver
Then open your frontend in the browser (if separate server is needed) or visit the URL provided by Django.

Notes
.gitignore prevents large files and virtual environment from being uploaded to GitHub.

Make sure the models are placed correctly, otherwise the project will throw file not found errors.

Only tracked files (code, configurations) are in the repo.

Contact
For any issues, contact Shafaq.

yaml
Copy code

---

After saving, don’t forget to **commit and push** to GitHub:

```bash
git add README.md
git commit -m "Add complete README with setup and model instructions"
git push

This will ensure your team members have all instructions and can run the project correctly after downloading.
````
