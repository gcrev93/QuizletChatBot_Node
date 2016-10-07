# MHacks ChatBot Tech Talk
#### Technical Evangelists: Gabby Crevecoeur (@NoWaySheCodes) & Kevin Leung (@KSLHacks)

## Bring on the Bots!
Jazz up your hack with the Microsoft Bot Framework. Add a conversational platform to any application you are building to take your project to the next level. They can be built for almost anything to help automate and create a more natural human interaction for everyday tasks. Join us and learn how to code a chat bot that helps you study, have fun and ace your exams!

Check out the .ppt for more information/resources/walkthroughs or read below

## The Quizlet Chat Bot
The Chat Bot created by Kevin and Gabby is actually a flashcards bot! If you are on the go but would like to get your study on, use this bot to study your Quizlet flashcards anytime. So lets get started.

### Prerequisites
1. You are going to need an Azure account. Sign up at [here](https://azure.microsoft.com/en-us/free/) for your free trial
2. [Node.js](https://nodejs.org/)
3. [Quizlet Developer Account](https://quizlet.com/api/2.0/docs)

## Step 1: Setup on Azure
After you have created your Azure account, it is time to create a web application for the ChatBot to run on. This is where the endpoints for communication with your bot are created.

1. Go to http://portal.azure.com
2. Select ‘New’
3. Then ‘Web + mobile’
4. And finally ‘Web App’
5. Create a name for your App
6. Choose your subscription
7. Resource Group: choose Default
8. App Service Plan: choose Default
9. Click Create.

Once your Web App is created and available in the 'All Resources' menu. Go to your Web Apps Overview section and find the url! Save that url somewhere because it will come in handy later.

## Step 2: Register Your Bot
After your web app has been created, you will need to register your bot on the bot framework site.

1. Go to http://dev.framework.com/bots/new
2. Give your bot a name, a bot handle (which will be used in the web link of the bot) and the description of your bot
3. Next, you need to configure your Message Endpoint. This is the url you got from your Azure Web App. You need to be sure you use https at the beginning of the link and add /api/messages to the end of the link. i.e. https://mhackschatbotnode.azurewebsites.net/api/messages
4. Then Generate your Microsoft App Id and Password by pressing the 'Create Microsoft App ID and password.'
5. Your App ID will automatically populate and you need to save your App password somewhere separately, because it will be hidden, until you regenerate a new one.
6. Lastly, you will need to add your APP ID and APP PASSWORD to your Azure settings. Go back to your web app overview, and in the task pnnel, go down to Application Settings.
7.  Scroll down to the App settings section and fill in your APP ID ad APP PASSWORD. The Key column should state MICROSOFT_APP_ID and the value is the App ID you got from Bot registration. Same goes for the App password, except the Key is MICROSOFT_APP_PASSWORD and the value is the App Password you got from Bot registration.

## Step 3: Get coding
First create a directory! In the working directory, you will need to set up the projec as a node project and then download the proper node modules.

1. Initialize the node project `npm init`
2. Install proper node modules `npm install --save botbuilder` `npm install --save restify `
3. Create an app.js file in your directory
4. Create an another js file that will communicate with the quizlet API (in this repository, the file is called api.js)







