from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tabelname__="User"
    username = db.Column(db.String,nullable=False, primary_key = True)
    password = db.Column(db.String,nullable=False)
    email = db.Column(db.String, nullable=False, unique = True)
    
    user_followers = db.relationship('Follow', foreign_keys = 'Follow.follower', cascade = 'delete')
    user_following = db.relationship('Follow', foreign_keys = 'Follow.followed', cascade = 'delete')
    user_by = db.relationship('Posts', foreign_keys = 'Posts.username', cascade = 'delete')


    def get_id(self):
        return self.username

class Follow(db.Model):
    __tabelname__ = "Follow"
    f_id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    follower = db.Column(db.String,db.ForeignKey(User.username))
    followed = db.Column(db.String, db.ForeignKey(User.username))

class Posts(db.Model):
    __tabelname__ = "Posts"
    post_id = db.Column(db.Integer, autoincrement = True, nullable = False, primary_key = True)
    username = db.Column(db.String, db.ForeignKey(User.username), nullable = False)
    title = db.Column(db.String, nullable = False)
    description = db.Column(db.String)
    image = db.Column(db.String, nullable = False, unique = True)
    timestamp = db.Column(db.String, nullable = False)



