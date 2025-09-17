Follow this instructions to run the project
I had to delete all the node modules on these folders (root, server, frontend,TemplateHolder) to push the project into the repository so you have to "npm i" all of them 

open your terminal in the root of the project then run "npm i" and wait for it to finish
after that run "cd server" then run "npm i" again then wait for it to finish, then also run "npm i --save-dev @type/cors" or "npm i --save-dev cors" to install cors
after that run "cd.." to go back then "cd frontend" then run "npm i" and wait for it to finish, then also run "npm i --save-dev lucide-react" since I found out it is not being installed using npm i
then for the last folder run "cd.." then "cd server", "cd remotion_templates", and "cd TemplateHolder" then run the last "npm i" 

after that you can open a new terminal then run "npm start", click the link "http://localhost:3000" or paste it in your browser

P.S This application won't run without an env file at the root folder