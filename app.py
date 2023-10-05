from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests as req
from flask_login import (LoginManager, current_user, login_required, login_user, logout_user)
from datetime import datetime
from flask_restful import Api
from api import api_user, api_post, api_follow, search
from model import User, Posts, db
import os
from cache_config import make_cache
from celery_config import create_celery_inst
import celery_task


UPLOAD_FOLDER = '/static/posts/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project_db.sqlite3'
db.init_app(app)
api = Api(app)
login_manager = LoginManager(app)


celery = create_celery_inst(app)
cache = make_cache(app)


api.add_resource(api_user, '/api/User', '/api/User/<string:username>')
api.add_resource(api_post, '/api/Posts', '/api/Posts/<string:username>', '/api/Posts/post/<string:id>')
api.add_resource(api_follow, '/api/Follow/<string:followed>/<string:follower>')
api.add_resource(search, '/api/search/<string:username>')

app.config['SECRET_KEY'] = 'bunny'

app.app_context().push()
db.create_all()

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[-1].lower() in ALLOWED_EXTENSIONS

@login_manager.user_loader
def load_user(username):
    return User.query.filter_by(username = username ).first()

@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect('/')

@app.route('/')
def welcome():
    return render_template('index.html')

@app.route ('/login', methods=['POST'])
def login():
    if request.method == 'POST':

        username = request.json.get("username")
        password = request.json.get("password")

        check = req.get(request.url_root + 'api/User/' + username)

        if check.status_code == 200 and check.json().get('password') == password:
            login_user(User.query.filter_by(username = username).first(), remember=True)
            
            return jsonify({'message': "You're logged in successfully!!"}), 200
       
        else:
            return jsonify({'message':'Incorrect username or password'}), 404    


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify('Logged out'), 200


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        file = request.files.get('image')
        user= request.form.get('user')
        basedir = os.path.abspath(os.path.dirname(__file__))
        file.save(basedir +'/static/profile/'+ user+'.jpg')
        return jsonify({'message':'image successfully saved'}), 200
    
@app.route('/create', methods=['POST'])
@login_required
def create():

    file = request.files.get('image')
    filename = request.form.get('imagename')
    basedir = os.path.abspath(os.path.dirname(__file__))
    file.save(basedir +'/static/posts/'+ filename +'.jpg')
    return jsonify({'message':'image successfully saved'}), 200

@app.route('/delete_post/<string:user>', methods=['GET', 'POST'])
@app.route('/delete_post', methods=['GET', 'POST'])
@login_required
def delete_post(user = None):
    
    basedir = os.path.abspath(os.path.dirname(__file__))
    if user == None:
        image = request.json.get('image')
        os.remove(os.path.join(basedir + '/static/posts/' + image +'.jpg'))
    else:
        list = req.get(request.url_root + 'api/Posts/'+ user)
        list = list.json()

        for post in list:
            os.remove(os.path.join(basedir + '/static/posts/' + post['image'] +'.jpg'))
    return jsonify({'message':'successfully deleted'}), 200

@app.route('/delete', methods=['GET', 'POST'])
@login_required
def delete():    
    user = request.json.get("username")
    basedir = os.path.abspath(os.path.dirname(__file__))
    os.remove(os.path.join(basedir + '/static/profile/' + user+'.jpg'))
    return redirect(url_for('delete_post', user = user))

@app.route('/export', methods=['GET', 'POST'])
@login_required
def export():
    celery_task.export.delay(current_user.username)
    return jsonify({'message':'exported'}), 200

    
if __name__ == "__main__":
    app.run(debug=True)