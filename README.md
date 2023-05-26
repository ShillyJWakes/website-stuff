# Wayne State School of Information Sciences<br>Plan of Work Portal
Directions to build and deploy the SIS portal frontend and backend. Local development deployment may vary from system to\
system, instructions here are included for Ubuntu 20.04.

## Unix Setup
If you're doing a deployment to Ubuntu 20.04, there are a number of things you'll need to do beforehand. First, for security,\
it's generally a good idea to create a special service account with no password which can only be logged into via sudo.\
You'll need to make sure this user has sufficient privileges to access the /var/www/sis-portal folder. 

1. Make sure apt has the latest packages. 
```unix
sudo apt update
``` 

2. Create a service user
```unix
sudo useradd -m -r -d /opt/sis-portal sis-portal
```
3. Add the user to the www-data group
```unix
sudo usermod -a -G www-data sis-portal
```
4. Add yourself to the www-data group so that you can write and execute files during deployment. 
```unix
sudo usermod -a -G $USER sis-portal
```
5. Create the site folder at /var/www
```unix
sudo mkdir /var/www/sis-portal
```
6. Add ownership of the directory to the www-data group.
```unix
sudo chown -R www-data /var/www/sis-portal/
sudo chgrp -R www-data /var/www/sis-portal/
```
7. Give write and execute permissions to group members.
```unix
sudo chmod -R g+wxr /var/www/sis-portal/
```
**If you run into issues after a redeployment or after copying in new files, try granting permissions to the group again.**

### MySql Database
The MySql database can be created using any guide found online. All you need to do is create a blank schema and a user to\
access the schema and then configure the URI to put into the environment file on the backend. SqlAlchemy will handle\
creating the tables inside the schema for you once you run the migration upgrade command. To make it easier, you should\
make the schema name sis_portal, and the user is sisportal. Then you only need to generate password and insert it bellow.\
The sisportal user will need all privileges granted to the created schema but only from localhost. 
```unix
mysql+pymysql://sisportal:$password@localhost/sis_portal?charset=utf8mb4
```

## Frontend

### Build Frontend
1. To build the frontend, install the latest Node and NPM on your local machine.\
This is specific to your operating system.\
[Node](https://nodejs.org/en/) \
*Note:* Some of the angular dependencies do not work with more recent versions of Node. Node version 14.15.0 was used to build frontend.

2. Clone the repo into a local directory and then navigate to the sis-portal/frontend directory.

3. Run npm install to install all the necessary packages.
```unix
npm install
```

4. Run the dev site locally
```unix
npm start
```

5. The frontend is now running on [http://localhost:4200](http://localhost:4200). However, it's not connecting to a backend yet.

### Deploy Frontend
The frontend can be deployed to any file server once you build for production. Directions included for Ubuntu 20.04

1. Replace the URL in the src/environments/environment.prod.ts file with the one where the production API will be.\
Replace the CSRF token to what it's set to in the .env file on the backend.

2. Build the frontend for production.
```unix
npm run build --prod
```

3. Copy the created frontend folder generated in /dist into /var/www/sis-portal on the server.

**If you've already deployed NGINX and the backend, you're done! If not, continue to either NGINX or backend deployment.**

## Backend
### Build Local Backend

1. Install Python 3 and pip on your local machine. Instructions vary by system.\
[Python 3](https://www.python.org/downloads) \
[Pip](https://pip.pypa.io/en/stable/installation)

2. Create a python virtual environment inside the sis-portal/backend folder and activate it. This varies by system.
3. Inside the environment run this command to install all python package requirements. 
```unix
pip install -r requirements.txt
```
4. Copy the env.example file and rename it to .env
5. Add in a CSRF_SESSION_KEY and JWT_SECRET_KEY for frontend token generation. Make sure the CSRF key matches the one\
you add in the frontend environment file.
6. If you wish to send test emails, add in mail server information.\
7. Info varies by provider. For configuration options, see [Flask Mail Documentation](https://pythonhosted.org/Flask-Mail/)
8. For local development, the CORS_ORIGINS should remain http://localhost:4200. However, it can be updated here if you're\
targeting the frontend from someplace else. Go to [Flask CORS](https://flask-cors.readthedocs.io/en/latest/configuration.html) 
For more configuration options.
9. Update SQLALCHEMY_DATABASE_URI with your local database uri. The site uses MySql in production, however due to the nature\
of ORMs and SQL Alchemy, it is possible to get away with using SQL Lite for development. If you're using MySql, make sure\
You can update the location, database name, and credentials right in the existing URI.
10. Once your .env file is finished, make sure you're still in your activated environment and run
```
flask db upgrade
```
11. The migration created "student", "admin", and "advisor" roles. and assigned an admin user with a default password\
that you will be prompted to change upon logging in. 
```
username: admin@mail.com
password: 123456
```

12. Run the backend!
```
python run.py
```

### Backend Deployment
These instructions are to deploy the backend API on Ubuntu 20.04. Make sure you created a service user before you proceed.
1. Install apt packages from the ubuntu repos.
```
sudo apt update
sudo apt install python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools
```

2. Install a python virtual environment
```
sudo apt install python3-venv
```

3. Copy the contents of the backend folder into /var/www/sis-portal/backend\
**NOTE:** When you're uploading the backend folder, make sure your directory is clear of  python compiler files (*.pyc)\
as this will substantially increase the size of your upload. If you're using PyCharm, there is a folder option to clear\
all compiled files.

5. Inside /var/www/sis-portal/backend copy the ev.example file into a .env file
```
cp /var/www/sis-portal/backend/env.example /var/www/sis-portal/backend/.env
```
6. Open up the .env file in vi, nano, or a different command line text editor you have installed.
```
nano /var/www/sis-portal/backend/.env
```
7. Add in a CSRF_SESSION_KEY and JWT_SECRET_KEY for frontend token generation. Make sure the CSRF key matches the one\
you add in the frontend environment file. Add in Mail information, add in the origin that the frontend will be running on.\
Add in the sql alchemy mysql database uri, with the right credentials.
8. Create a virtual environment
```
python3 -m venv /var/www/sisportal/backend/sisportal-venv
```
9. Activate the virtual environment
```
source var/www/sis-portal/backend/sisportal-venv/bin/activate
```
10. Install Wheel, the requirements from the requirements.txt file, and gunicorn for running the backend as a service. 
```
pip install wheel
pip install -r requirements.txt
pip install gunicorn
```
11. Run the migrations to generate the database
```
flask db upgrade
```
12. Deactivate the virtual environment
```
deactivate
```
13. Open port 5000 in the firewall to allow the frontend to connect to it.
```
sudo ufw 5000
```
14. Copy and rename the sisportal.service.example file. If you used the username and locations provided in this readme\
you don't need to make any changes to this file. 
```
sudo cp /var/www/sis-portal/backend/sisportal.service.example /etc/systemd/system/sisportal.service
```
15. Start the gunicorn service.
```
sudo systemctl start sisportal
sudo systemctl enable sisportal
```
Your backend is now running! For redeployment, copy over your backend files, then restart the gunicorn service. You might\
need to grant group permissions to all the files again. Make sure you don't delete the .env file or else you'll need to recreate it!
```unix
sudo chown -R www-data /var/www/sis-portal/
sudo chgrp -R www-data /var/www/sis-portal/

sudo systemctl restart sisportal
```

If you added migrations, you'll need to apply them to the production database. There is probably a better way to do this,\
but for now, it will require a few minutes of site downtime.

1. Stop both nginx and the Gunicorn service
```
sudo systemctl stop nginx
sudo systemctl stop sisportal
```
3. Activate the python environment
```
source var/www/sis-portal/backend/sisportal-venv/bin/activate
```
5. Apply the migration updates
```
flask db upgrade
```
7. Deactivate the environment
```
deactivate
```
9. Start up NGINX and Gunicorn again
```
sudo systemctl start nginx
sudo systemctl start sisportal
```
If you've already deployed the frontend and nginx, you're done!

## NGINX Configuration
1. Install NGINX
```
sudo apt update
sudo apt install nginx
```
2. Copy over the sisportal_nginx.example file, open it, and modify the domain names  and or IPs to match what you need.\
Make sure that the domain you set in the frontend environment file is listed in server_name under backend.
```
sudo cp /var/www/sis-portal/backend/sisportal_nginx.example /etc/nginx/sites-available/sisportal_nginx

sudo nano /etc/nginx/sites-available/sisportal_nginx
```
3. Link the file to the sites-enabled directory
```
sudo ln -s /etc/nginx/sites-available/sisportal_nginx /etc/nginx/sites-enabled
```
4. Restart NGINX
```
sudo systemctl restart nginx
```





