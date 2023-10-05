from flask import request
from flask_restful import Resource, fields, marshal_with
from model import User, Posts, Follow, db


class api_user(Resource):

    fields ={
        "username": fields.String,
        "email": fields.String,
        "password": fields.String
    }

    @marshal_with(fields)
    def get (self, username):
        if username != 'None':
            user = User.query.filter_by(username = username).first()
            if user != None:
                return user, 200
            else:
                return '', 404
        else:
            user = User.query.all()
            return user,200
    
    @marshal_with(fields)
    def post (self):
        data = request.get_json()
        
        obj = User(username = data.get("username"),
                   password = data.get("password"),
                   email =  data.get("email"))

        if User.query.filter_by(username = obj.username).first():
            return 409

        db.session.add(obj)
        db.session.commit()
        return obj, 201
    def put(self):
        data = request.get_json()
        print(data)
        obj = User.query.filter_by(username = data["username"]).first()
        obj.email = data['email']
        obj.password = data['password']
        db.session.commit()
        return '',201

    def delete( self, username):
        check = User.query.filter_by(username = username).first()
        db.session.delete(check)
        db.session.commit()
        return '',200

class api_post(Resource):
    fields ={
        "post_id": fields.Integer,
        "username": fields.String,
        "title" : fields.String,
        "description" : fields.String,
        "image" : fields.String,
        "timestamp" : fields.String
           }

    @marshal_with(fields)
    def get(self, username):
        posts = Posts.query.filter_by(username= username).all()
  
        if posts is None:
            return posts, 404

        return posts, 200
            
    @marshal_with(fields)
    def post(self):
        data = request.get_json()
        
        obj = Posts(    
                        username = data.get("username"),
                        title = data.get("title"),
                        description = data.get("description"),
                        image = data.get("image"),
                        timestamp = data.get("timestamp")
                    )
     
        db.session.add(obj)
        db.session.commit()

        return obj , 201
    
    def put(self):
        data = request.get_json()
        obj = Posts.query.filter_by(post_id = data.get("post_id")).first()
        obj.title = data.get('title')
        obj.description = data.get('description')

        db.session.commit()

        return '', 200

    def delete(self, id):
        check = Posts.query.filter_by(post_id = int(id)).first()
        db.session.delete(check)
        db.session.commit()

        return '',201

class api_follow(Resource):
    fields ={
        "followed": fields.String,
        "follower": fields.String
    }
 
    @marshal_with(fields)
    def post(self, followed, follower):
        obj = Follow(
            follower = follower,
            followed = followed
        )
        check = Follow.query.filter_by(followed = obj.followed, follower = obj.follower).first()
        if check is None:
            db.session.add(obj)
        else:
            db.session.delete(check)
        db.session.commit()
        return obj, 201

    @marshal_with(fields)
    def get(self, followed, follower):
        if followed != 'None':
            check = Follow.query.filter_by(followed = followed).all()
        else:
            check = Follow.query.filter_by(follower= follower).all()
        return check , 201

class search(Resource):
    fields ={
        "username": fields.String,
    }
    @marshal_with(fields)
    def get(self, username):
        check = User.query.filter(User.username.ilike(username + '%')).all()
        return check, 201