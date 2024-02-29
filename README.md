# Richpanel Assignment Facebook Helpdesk - Ayanabha Misra

> Disclaimer: The connection to facebook page functionality as well as chatting with facebook user only works with the account that is associated with the Facebook App (in the developer console). So please create your own Facebook App at https://developers.facebook.com/ and enter the App id in `VITE_FACEBOOK_APP_ID` in .env (in the root folder) file.

![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/a0a57f82-6d8e-4662-999b-ea4919f7a2cd)

## 🔗 Link

Live link: [www.richpanelassessment.ayanabha.xyz](https://www.richpanelassessment.ayanabha.xyz)

## 📹 Demo video

Demo video link: [Click here to watch the demo](https://drive.google.com/file/d/1ixcFvFHSHsq8-tvjZFUlNShPiuhHi8vw/view?usp=drive_link)

## 📖 Overview

This project is a prototype of a Facebook helpdesk that can be integrated with any Facebook page. Users can engage in chat directly from the web application with Facebook users, and they can also see the sent messages in the facebook messanger. All messages sent and received through this web app are stored in a database, enabling the Facebook page owner to track conversations later in a unified platform.

## 🛠 Screenshots

![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/316b4160-2d99-4020-8718-5990199271c2)
![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/9e720b76-84b5-4d13-9541-481d41ec1d94)
![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/b1c4123c-e213-43ed-859a-ce96f4038d49)

## </> Setting up development/testing environment

- Clone this repository `git clone https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk.git`
- Setup env files by referring to .env.example and ./Backend/.env.example

  - Create a file .env in Backend folder -> Copy content from Backend/.env.example and enter your values

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/3ffb8cde-660c-41c9-9e3e-366d5e918238)

  - Create a file .env or .env in root folder -> Copy content from .env.example and enter your values

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/602d74e7-5446-4c60-b732-97a62ed1ac5f)

- Create a Facebook app in facebook developer console

  ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/a7217b67-6fb8-41f8-af85-b3cfda391949)

  ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/499a478c-b0a0-4f93-b99a-c68170e805ff)

  ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/123e1ec3-9ae9-4b56-898b-141f467be800)

  ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/e049af96-10f1-43dc-a09f-3c1eba07f0b4)

  ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/a89237a5-f841-4da5-b5e6-85f9a3e5f728)

  Copy this **App Id** and paste it in **.env** in the root folder in `VITE_FACEBOOK_APP_ID`

- **Setup Facebook Login Configuration**

  - Facebook login requires a `https` redirect uri, so we will use `Ngrok` for that. Ngrok will map a free https domain to out localhost

    - Open a terminal and type `ngrok http 8000` [ Our frontend is going to run on localhost port 8000 ]

      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/14196c2b-1946-479f-b7c8-981427fcd2b4)

  - Configure **Facebook Login** settings in **Facebook developer console**

    - Click on `Facebook Login for Business`

      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/0f07c818-55d3-4d9a-8393-eefa2a2b1067)

    - Paste Ngrok public url in `Valid OAuth Redirect URIs` and `Allowed Domains for the JavaScript SDK` and toggle `Login with the JavaScript SDK` to YES

      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/a543c098-d750-4b4d-afd3-2c9406845ab3)

    - Setup login configurations

      Click at Configurations under **Facebook Login for Business**
      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/678acf2a-fd45-47a5-a581-4009e3d2767d)

      Create configuration
      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/961998c0-3367-443d-b14d-7ab8c76d4d05)

      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/d5cf6064-dad4-495c-87c0-b011d6876076)

      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/2a82c206-a787-479f-81ef-acbce4798930)

      Permissions required: `pages_messaging, pages_show_list, pages_manage_posts, pages_read_user_content`
      ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/b238777a-a195-4d4a-b3f7-d8ff9e4c493e)

  - Encode the **Ngrok** public url and paste it in .env `VITE_PUBLIC_URL_ENCODED`

    Use https://www.urlencoder.org/
    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/be417e9d-4aa5-4cb7-af67-2012e13701e6)

- Configure **Webhook Settings** in **Facebook developer console**

  - Facebook requires you to have a **https** url for forwarding chats using your webhhok. So basically your server needs to have a https url. We will use **Ngrok** again.

    In a terminal type `ngrok http 3000`

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/5128bd76-58f5-4092-ba5f-afa41e51a551)

  - Create a messanger webhook

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/45f2b92b-770d-4249-bd65-8917802539d2)

  - Configure the webhook

    Paste your ngrok url here and also create a new verify token. Make sure to paste the same token in `Backend/.env` in `FB_WEBHOOK_VERIFICATION_TOKEN`

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/fff74a25-6a07-43c4-9e3b-77d645c566bf)

  - Subscribe to **messages** event in Webhook fields

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/ca726a82-5256-40f2-981a-b69c7fe17fac)

  - Webhook subscription

    Add page  
    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/9c5e55ff-1de4-42af-840d-a430c8d309c6)

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/4b14aa11-3188-4453-bcb0-0abc4ccb5c65)

    Add Subscription (Subscribe to **messages**)

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/931e7a56-da72-4d23-8492-d58529f183a1)
    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/c52c2fa2-466c-4cc1-ab7b-bdeb51ec2f44)

    Finally it should look something like this  
    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/30f68ebe-1d3e-41b1-b92a-77f269f995ad)

- Configure **AWS Credentials**

  - Create a new AWS IAM User and paste the access key and secret key in `Backend/.env` in `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively.

    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/bde99756-95a4-41e8-8a77-66361ee006ab)

- And we are done. Just one last step.
  - Go to your project root folder, open a terminal and type `docker compose up`
    ![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/34bb9d63-ed46-41e5-a58d-1668083f799d)

## 📃 Flow

Receiving messages from facebook
![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/7ee0d988-d885-44f7-a038-972a2d962577)

Sending messages to facebook
![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/096566ed-c181-4d67-8cf3-70024ca29739)

Getting all previous messages on load
![image](https://github.com/Ayanabha1/Richpanel-Assignment-Facebook-Helpdesk/assets/63809278/309f4ad0-9436-4927-bcd7-88705249fcb0)

## 📧 Contact

For any questions or feedback, please contact the project maintainer:

Your Name: Ayanabha Misra  
Email: ayanabha2002@gmail.com
