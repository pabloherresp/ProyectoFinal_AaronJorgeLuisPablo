from flask_mail import Message
from flask import jsonify
from api.mail.mail_config import mail
import os

def send_email(address, token, name):
    try:
        msg = Message("Reset your password", recipients=[address])

        if  os.getenv("FLASK_DEBUG") == "1":
            msg.html = f'''
            <div>
            <h3>Reset your password</h3>
            <p>Hola, {name}, haz click en el enlace de abajo para poder restaurar tu contraseña.</p>
            <a href="{os.getenv("FRONTEND_URL")}resetpassword?token={token}">Haz click aquí</a>
            <img src="https://raw.githubusercontent.com/4GeeksAcademy/FS-PT-101_ProyectoFinal_AaronJorgeLuisPablo/refs/heads/dev/src/front/assets/img/Logo_Nomadik.png">
            </div>
            '''
        else:
            msg.html = f'''<a href="{os.getenv("BACKEND_URL")}/reset?token={token}">Hola, sigue este vinculo para resetear tu contraseña</a>'''

        mail.send(msg)
        return {'success': True, 'msg': 'correo enviado exitosamente'}
    except Exception as e:
        return {'success': False, 'msg': 'error al enviar correo' + e}
    

    