from os import environ

from flask import Flask

app = Flask(__name__)

if environ.get('IS_HEROKU'):
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')

from app import views