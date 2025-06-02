  
import os
from flask_admin import Admin
from .models import db, Users, Profesionals, Clients, Activities, Info_activity, Reviews, Reports, Media, Favourites, Inscriptions, Administrators
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))
    admin.add_view(ModelView(Profesionals, db.session))
    admin.add_view(ModelView(Clients, db.session))
    admin.add_view(ModelView(Activities, db.session))
    admin.add_view(ModelView(Info_activity, db.session))
    admin.add_view(ModelView(Reviews, db.session))
    admin.add_view(ModelView(Reports, db.session))
    admin.add_view(ModelView(Media, db.session))
    admin.add_view(ModelView(Favourites, db.session))
    admin.add_view(ModelView(Inscriptions, db.session))
    admin.add_view(ModelView(Administrators, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))