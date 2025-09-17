Follow this instructions to run the project
I had to delete all the node modules on these folders (root, server, frontend,TemplateHolder) to push the project into the repository so you have to "npm i" all of them 

open your terminal in the root of the project then run "npm i" and wait for it to finish
after that run "cd server" then run "npm i" again then wait for it to finish, then also run "npm i --save-dev @type/cors" or "npm i --save-dev cors" to install cors
after that run "cd.." to go back then "cd frontend" then run "npm i" and wait for it to finish, then also run "npm i --save-dev lucide-react" since I found out it is not being installed using npm i
then for the last folder run "cd.." then "cd server", "cd remotion_templates", and "cd TemplateHolder" then run the last "npm i" 

after that you can open a new terminal then run "npm start", click the link "http://localhost:3000" or paste it in your browser

P.S This application won't run without an env file at the root folder

For port tunneling/sharing:
run "npm cloudflared --version"to see if cloudflared is installed, if not "npm i cloudflared" to install it
then after successful installation run "cloudflared tunnel --url http://localhost:3000" while the poject is running 
then you wlll get the -

+--------------------------------------------------------------------------------------------+ 
2025-09-17T08:12:05Z INF | Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): | 
2025-09-17T08:12:05Z INF | https://high-intensity-referring-aaron.trycloudflare.com | 2025-09-17T08:12:05Z INF 
+--------------------------------------------------------------------------------------------+

- message in your console. find it and copy the link provided then forward it to the person you want to share it too