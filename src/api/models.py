from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Float, Integer
from enum import Enum as PyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from sqlalchemy import Enum as SQLAEnum

db = SQLAlchemy()


class enumProf(PyEnum):
    freelance = "FREELANCE"
    business = "BUSINESS"

class enumClts(PyEnum):
    male = "MALE"
    female = "FEMALE"
    not_telling = "NOT TELLING"

class enumInfo(PyEnum):
    tourism = "TOURISM"
    leisure = "LEISURE"
    sport = "SPORT"

class enumReps(PyEnum):
    user = "USER"
    activity = "ACTIVITY"

class Users(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    surname: Mapped[str] = mapped_column(String(40))
    telephone: Mapped[str] = mapped_column(String(15), unique=True, nullable=False)
    NID: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    creation_date: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow, nullable=False)
    avatar_url: Mapped[str] = mapped_column(String, unique=True, nullable=False)


    reports: Mapped[list["Reports"]] = relationship("Reports",back_populates="user")
    profesional: Mapped["Profesionals"] = relationship("Profesionals",back_populates="user",uselist=False)
    client: Mapped["Clients"] = relationship("Clients",back_populates="user",uselist=False)
    



    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "name": self.name,
            "surname": self.surname,
            "telephone": self.telephone,
            "NID": self.NID,
            "creation_date": self.creation_date,
            "avatar_url": self.avatar_url,
            "reports": [r.id for r in self.reports],
            "profesional": self.profesional.serialize() if self.profesional else None,
            # do not serialize the password, its a security breach
        }
    
class Reports(db.Model):
    __tablename__ = "reports"
    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    target_type: Mapped[enumReps] = mapped_column(SQLAEnum(enumReps), nullable=False)
    profesional_target_id: Mapped[int] = mapped_column(ForeignKey("profesionals.id"))
    activity_target_id: Mapped[int] = mapped_column(ForeignKey("info_activities.id"))
    creation_date: Mapped[datetime] = mapped_column(DateTime(),  default=datetime.utcnow, nullable=False)


    user: Mapped["Users"] = relationship("Users",back_populates="reports")
    profesional: Mapped["Profesionals"] = relationship("Profesionals",back_populates="reports")
    info_activity: Mapped["Info_activity"] = relationship("Info_activity",back_populates="reports")
        



    def serialize(self):
        return {
            "id": self.id,
            "message": self.message,
            "user": self.user.serialize() if self.user else None,
            "profesional": self.profesional.serialize() if self.profesional else None,
            "info_activity": self.info_activity.serialize() if self.info_activity else None
            # do not serialize the password, its a security breach
        }
    
    
class Profesionals(db.Model):
    __tablename__ = "profesionals"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    bio: Mapped[str] = mapped_column(String)
    type: Mapped[enumProf] = mapped_column(SQLAEnum(enumProf), nullable=False)
    business_name: Mapped[str] = mapped_column(String)
    tax_address: Mapped[str] = mapped_column(String, nullable=False)
    nuss: Mapped[str] = mapped_column(String(12))
    rating: Mapped[float] = mapped_column(Float, nullable=False)


    user: Mapped["Users"] = relationship("Users",back_populates="profesional",uselist=False)
    activities: Mapped[list["Activities"]] = relationship("Activities",back_populates="profesional")
    reports: Mapped[list["Reports"]] = relationship("Reports",back_populates="profesional")

    def serialize(self):
        return {
            "bio": self.bio,
            "type": self.type,
            "business_name": self.business_name,
            "tax_address": self.tax_address,
            "nuss": self.nuss,
            "rating": self.rating,
            "activities": [a.id for a in self.activities],
            "reports": [r.id for r in self.reports],
            "user": self.user.serialize() if self.user else None
            # do not serialize the password, its a security breach
        }
    
class Clients(db.Model):
    __tablename__ = "clients"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    address: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    birthdate: Mapped[datetime] = mapped_column(DateTime(),  default=datetime.utcnow, nullable=False)
    gender: Mapped[enumClts] = mapped_column(SQLAEnum(enumClts), nullable=False)
    tax_address: Mapped[str] = mapped_column(String, nullable=False)


    user: Mapped["Users"] = relationship("Users",back_populates="client",uselist=False)
    inscriptions: Mapped[list["Inscriptions"]] = relationship("Inscriptions",back_populates="client")

    def serialize(self):
        return {
            "address": self.address,
            "city": self.city,
            "birthdate": self.birthdate,
            "gender": self.gender,
            "tax_address": self.tax_address,
            "user": self.user.serialize() if self.user else None,
            "inscriptions": [i.id for i in self.inscriptions]
            # do not serialize the password, its a security breach
        }
    
        
class Activities(db.Model):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(primary_key=True)
    info_id: Mapped[int] = mapped_column(ForeignKey("info_activities"))
    price: Mapped[float] = mapped_column(Float, nullable=False)
    slots: Mapped[int] = mapped_column(Integer, nullable=False)
    creation_date: Mapped[datetime] = mapped_column(DateTime(),  default=datetime.utcnow, nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime(),  default=datetime.utcnow, nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(),  default=datetime.utcnow, nullable=False)
    profesional_id: Mapped[int] = mapped_column(ForeignKey("profesionals.id"), nullable=False)
    is_finished: Mapped[bool] = mapped_column(bool, nullable=False)
    meeting_point: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(bool, nullable=False)


    profesional: Mapped["Profesionals"] = relationship("Profesionals",back_populates="activities",uselist=False)
    info_activity: Mapped["Info_activity"] = relationship("Info_activity",back_populates="activities",uselist=False)
    inscriptions: Mapped[list["Inscriptions"]] = relationship("Inscriptions",back_populates="activity")

    def serialize(self):
        return {
            "id": self.id,
            "price": self.price,
            "slots": self.slots,
            "creation_date": self.creation_date,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "profesional_id": self.profesional_id,
            "is_finished": self.is_finished,
            "meeting_point": self.meeting_point,
            "is_active": self.is_active,
            "profesional": self.profesional.serialize() if self.profesional else None,
            "info_activity": self.info_activity.serialize() if self.info_activity else None,
            "inscriptions": [i.id for i in self.inscriptions]
            # do not serialize the password, its a security breach
        }

class Inscriptions(db.Model):
    __tablename__ = "inscriptions"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activities.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    inscription_date: Mapped[datetime] = mapped_column(DateTime(),  default=datetime.utcnow, nullable=False)
    is_active: Mapped[bool] = mapped_column(bool, nullable=False)


    activity: Mapped["Activities"] = relationship("Activities",back_populates="inscriptions",uselist=False)
    client: Mapped["Clients"] = relationship("Clients",back_populates="inscriptions",uselist=False)
        



    def serialize(self):
        return {
            "id": self.id,
            "inscription_date": self.inscription_date,
            "is_active": self.is_active,
            "activity": self.activity.serialize() if self.activity else None,
            "client": self.client.serialize() if self.client else None
            # do not serialize the password, its a security breach
        }
    
class Info_activity(db.Model):
    __tablename__ = "info_activities"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(60),nullable=False)
    desc: Mapped[str] = mapped_column(String(60),nullable=False)
    type: Mapped[enumInfo] = mapped_column(SQLAEnum(enumInfo), nullable=False)
    last_update: Mapped[datetime] = mapped_column(DateTime(),  default=datetime.utcnow, nullable=False)
    media_url: Mapped[str] = mapped_column(ForeignKey("media.url"))
    rating: Mapped[float] = mapped_column(ForeignKey("reviews.activity_rating"))


    activities: Mapped[list["Activities"]] = relationship("Activities",back_populates="info_activity")
    reports: Mapped[list["Reports"]] = relationship("Reports",back_populates="info_activity")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "desc": self.desc,
            "type": self.type,
            "last_update": self.last_update,
            "activities": [a.id for a in self.activities],
            "reports": [r.id for r in self.reports]
            # do not serialize the password, its a security breach
        }
    


    """

    /////////////////// lo siguiente está comentado porque es el repositorio de Javier! //////////////////

    from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()

# 🔵 1:1 User → Profile
class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)
    profile: Mapped["Profile"] = relationship(back_populates="user", uselist=False)


    #se encarga de pasar el OBJETO respuesta a diccionario. Se ejecuta como METODO de la clase
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            #serializamos el perfil porque recibimos un objeto de la tabla Perfiles que es el perfil asociado 
            # al usuario. Los objetos (<User 1>) no son compatibles con JSONIFY, solo los diccionarios/listas/string
            "profile": self.profile.serialize() if self.profile else None
        }

class Profile(db.Model):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    bio: Mapped[str] = mapped_column(String(250))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user: Mapped["User"] = relationship(back_populates="profile")

    def serialize(self):
        return {
            "id": self.id,
            "bio": self.bio
        }

# 🟢 1:N Teacher → Course
class Teacher(db.Model):
    __tablename__ = "teachers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))

    courses: Mapped[list["Course"]] = relationship(back_populates="teacher")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            #hacemos loop porque es una lista y no queremos el objeto, 
            # en este caso, solo queremos el title del curso asociado
            "courses": [course.title for course in self.courses]
        }

class Course(db.Model):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teachers.id"))

    teacher: Mapped["Teacher"] = relationship(back_populates="courses")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="course")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "teacher": self.teacher.name,
            "students": [
                {
                    "name": enrollment.student.name,
                    "enrolled_on": enrollment.enrollment_date.isoformat()
                } for enrollment in self.enrollments
            ]
        }

# 🔴 N:M Student ↔ Course con modelo de asociación
class Student(db.Model):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))

    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="student")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "courses": [
                {
                    "title": enrollment.course.title,
                    "enrolled_on": enrollment.enrollment_date.isoformat()
                } for enrollment in self.enrollments
            ]
        }
#tabla de asosiacion, se encarga de decir que alumno esta en que curso
#es relacion muchos a muchos
class Enrollment(db.Model):
    __tablename__ = "enrollments"
    #tabla de asociacion NO tienen id
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), primary_key=True)
    enrollment_date: Mapped[datetime] = mapped_column(DateTime(), default=datetime.utcnow)

    student: Mapped["Student"] = relationship(back_populates="enrollments")
    course: Mapped["Course"] = relationship(back_populates="enrollments")

    def serialize(self):
        return {
            "student_id": self.student_id,
            "course_id": self.course_id,
            "enrollment_date": self.enrollment_date.isoformat()
        }

        """