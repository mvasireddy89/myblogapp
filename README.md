# myblogapp
Currently the blog only allows admin user to be logged in. Only admin can create other user logins.
In order to create your admin account, before starting the program, make sure you have mongo DB installed.
Then go through the code and comment out the word 'isLoggedIn'. This method is responsible for allowing certain pages
to be shown only to the authenticated user. You can now access signup page and create your account. 
Do not forget to un-comment 'isLoggedIn' part of the code after you are done and re-launch the application.




node app.js - to start the app
