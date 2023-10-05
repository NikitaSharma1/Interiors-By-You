## How to use
Before we could use the web app, we need to setup the environment and servers for it.
1) <b>Setting up the Flask server :</b>   
   - In a new Linux terminal tab, start the Flask server by typing 

             ~/go/bin/MailHog
             
2) <b>Setting up the Flask server :</b>   
   - In a new Linux terminal tab, start the Flask server by typing 

             python3 app.py

3) <b> Setting up Redis server : </b>    
    - In a new Linux terminal tab, start the redis server by typing 

          redis-server
    
4) <b> Setting up Celery Worker and Celery Beat : </b>
    - In a new Linux terminal tab, start the Celery Workers and Beat together by typing 
    
          Celery -A celery_task.celery worker -l info -B    
