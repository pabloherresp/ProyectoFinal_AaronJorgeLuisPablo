from flask_mail import Message
from flask import jsonify, render_template
from api.mail.mail_config import mail
import os

def send_email(address, token, name):
    try:
        msg = Message("Reset your password", recipients=[address])

        if  os.getenv("FLASK_DEBUG") == "1":
            msg.html = render_template("mailTemplate.html", reset_url = f"{os.getenv('FRONTEND_URL')}resetpassword?token={token}")
        else:
            msg.html = f'''<a href="{os.getenv("FRONTEND_URL")}/resetpassword?token={token}">Hola, sigue este vinculo para resetear tu contraseña</a>'''

        mail.send(msg)
        return {'success': True, 'msg': 'correo enviado exitosamente'}
    except Exception as e:
        return {'success': False, 'msg': 'error al enviar correo' + e}
    
def contact_email(address, name, message):
    try:
        msg = Message("Correo de contacto", recipients=["pabloherresp@gmail.com", "nomadik.help@gmail.com"])
        if  os.getenv("FLASK_DEBUG") == "1":
            msg.html = render_template("contactTemplate.html", name=name, email=address, message=message)
        else:
            msg.html = f'''Correo enviado por ${name}, con email: ${address}. <br> Mensaje: ${message}'''

        mail.send(msg)
        return {'success': True, 'msg': 'correo enviado exitosamente'}
    except Exception as e:
        return {'success': False, 'msg': 'error al enviar correo' + e}

  
  
