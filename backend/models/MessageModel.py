from .db import db
from .PowModel import POW
from .UserModel import User

#Creates the Message entity with the fields that the database is expecting
class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pow_id = db.Column(db.Integer, db.ForeignKey('pow.id'), nullable=False) #Switched to Lowercase pow, Dennis
    message = db.Column(db.Text, nullable=False)
    sender = db.relationship('User', backref='sender_messages', foreign_keys=[sender_id])
    send_time = db.Column(db.DateTime)
    #pow = db.relationship('POW', backref='messages')
