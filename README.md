# Mini CRM Platform

## 🚀 Overview
This Mini CRM Platform is designed to simplify customer segmentation, deliver personalized campaigns, and provide intelligent insights using AI-powered tools. It demonstrates a blend of robust architectural principles and modern AI integrations to solve real-world CRM challenges.

## 🛠️ Local Setup Instructions
### Prerequisites
- **Node.js** (v14+)
- **MySQL** or **MongoDB** (based on configuration)
-  pub-sub architecture using in-memory logic

### Installation Steps
1. **Clone the Repository**  
   Run the following commands:  
   `git clone https://github.com/Cody-aditya/Xeno-task.git`  

2. **Install Backend Dependencies**  
   `npm install`  

3. **Set Up Environment Variables**  
   Create a `.env` file in the root directory with the following variables:  
   `DB_HOST=<database-host>`  
   `DB_PORT=<database-port>`  
   `DB_USER=<database-user>`  
   `DB_PASSWORD=<database-password>`  
   `DB_NAME=<database-name>`  
   `GOOGLE_CLIENT_ID=<your-google-oauth-client-id>`  
   `GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>`  
   `JWT_SECRET=<your-jwt-secret>`  

4. **Run Database Migrations (if applicable)**  
   `npm run migrate`  

5. **Start the Backend Server**  
   `npm start`  

6. **Frontend Setup**  
   If the frontend code is in a separate folder, navigate to it and run:  
   `cd frontend`  
   `npm install`  
   `npm run dev`  

7. **Test APIs**  
   Use tools like Postman or Swagger UI to interact with the REST APIs. Documentation is included in the `/docs` folder.

## 🏛 Architecture Diagram

![image](https://github.com/user-attachments/assets/4f2291be-a055-4dcf-9f9c-b239fda9d34d)


## 🌟 Features
### Core Features
1. **Dynamic Rule Builder**: Enables creation of audience segmentation rules using a flexible AND/OR logic and supports advanced filtering based on customer attributes.  
2. **Google OAuth 2.0**: Provides secure user authentication for accessing platform features.  
3. **Campaign Delivery Logs**: Tracks campaign delivery, including sent and failed message statistics, simulating real-world success rates using a probabilistic Vendor API.  
4. **Pub-Sub Architecture**: Ensures seamless data handling with a decoupled, scalable architecture.  
5. **Campaign History Page**: Displays past campaigns with detailed delivery statistics.

### AI-Powered Features
1. **Natural Language to Rules**: Users can type a sentence like:
“Customers who haven’t shopped in 6 months and spent over ₹5,000”,
and the app will convert it into structured segmentation rules using OpenAI. This makes it much easier to create campaigns without complex form inputs.  
2. **AI Message Generator**: Based on a campaign objective, such as “Win back inactive users”, the system suggests 2 to 3 personalized message variants.
For example:
"We miss you! Here’s a 15% discount just for you."
"Come back and enjoy free delivery on your next order!".  

## 🧠 AI Tools and Technologies Used
 **OpenAI GPT-4**: Handles natural language processing for rule creation and message generation.  

## 🔧 Tech Stack
- **Frontend**: React.js (or Next.js for SSR)  
- **Backend**: Node.js with Express  
- **Database**: MySQL or MongoDB  
- **Authentication**: Google OAuth 2.0  
- **AI Integration**: OpenAI API

## 🚧 Known Limitations and Assumptions
1. **Mocked AI Logic**: AI features are simulated and may not represent real-world behavior accurately.  
2. **Pub-Sub Simplifications**: Current setup prioritizes local testing over production-ready configurations.  
3. **Vendor API Simulation**: Delivery success rates are based on hardcoded probabilities, not real API responses.  
4. **Limited Scalability Testing**: Performance testing is optimized for small to medium datasets.  
5. **UI Features**: Basic user interface; advanced styling and UX are deferred for future enhancements.

## ✨ Conclusion
This Mini CRM Platform showcases a combination of innovative design, AI-driven features, and scalable architecture. It serves as a robust foundation for managing customer relationships, delivering personalized campaigns, and deriving actionable insights. Contributions and enhancements are always welcome!

