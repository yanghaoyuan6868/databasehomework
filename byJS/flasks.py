from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
import pymysql
import json

app = Flask(__name__)
CORS(app, resources=r'/*')

db_username = ''
db_password = ''
db_host = ''
db_port = ''
db_login = False

# 连接数据库
def connect(db_name=None):
    global db_username, db_password, db_host, db_port
    if db_name==None:
        db = pymysql.connect(host=db_host, port=int(db_port), user=db_username, passwd=db_password, charset='utf8')
    else:
        db = pymysql.connect(host=db_host, port=int(db_port), user=db_username, db=db_name, passwd=db_password, charset='utf8')
    return db

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    global db_login
    if request.method == 'POST':
        un_username = request.form['username']
        un_password = request.form['password']
        un_host = request.form['host']
        un_port = request.form['port']
        try:
            db = pymysql.connect(host=un_host, port=int(un_port), user=un_username, passwd=un_password, charset='utf8')
            global db_username, db_password, db_host, db_port
            db_username = un_username
            db_password = un_password
            db_host = un_host
            db_port = un_port
            db_login = True
            return {'status': 'success'}
        except:
            return {'status': 'error', 'message': '连接失败！请检查输入信息！'}
    else:
        if db_login == False:
            return render_template('login.html')
        else:
            return render_template('dbpage.html')

@app.route('/getdb', methods=['GET'])
def getdb():
    db = connect()
    cursor = db.cursor()
    cursor.execute("SHOW DATABASES;")
    db_list = cursor.fetchall()[4:]
    db.close()
    return {"db_list": db_list}

@app.route('/getdb/dbon', methods=['GET'])
def dbon():
    db_name = request.args.get('db_name')
    db = connect(db_name)
    cursor = db.cursor()
    cursor.execute("SHOW TABLES;")
    table_list = cursor.fetchall()
    db.close()
    return {"table_list": table_list}

@app.route('/getdb/tableon', methods=['GET'])
def tableon():
    db_name = request.args.get('db_name')
    table_name = request.args.get('table_name')
    db = connect(db_name)
    cursor = db.cursor()
    cursor.execute("SHOW COLUMNS FROM " + table_name + ";")
    column_list = cursor.fetchall()
    cursor.execute("SELECT * FROM "+table_name+";")
    table_content = cursor.fetchall()
    db.close()
    return {"table_content": table_content, "column_list": column_list}

@app.route('/insert', methods=['POST'])
def insert():
    data = eval(list(request.form.to_dict().keys())[0])
    db_name = data['db_name']
    table_name = data['table_name']
    value_list = data['value_list']
    db = connect(db_name)
    cursor = db.cursor()
    cursor.execute("SHOW COLUMNS FROM " + table_name + ";")
    column_list = cursor.fetchall()
    for i in range(len(column_list)):
        if value_list[i] == "":
            value_list[i] = "NULL"
        elif column_list[i][1] != 'int':
            value_list[i] = '"'+value_list[i]+'"'
    value_list = ",".join(value_list)
    sql = "INSERT INTO " + table_name + " VALUES (" + value_list + ");"
    try:
        cursor.execute(sql)
        db.commit()
        db.close()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        db.close()
        return {"status": "error", "error": str(e)}

@app.route('/find', methods=['POST'])
def find():
    data = eval(list(request.form.to_dict().keys())[0])
    db_name = data['db_name']
    table_name = data['table_name']
    value_list = data['value_list']
    db = connect(db_name)
    cursor = db.cursor()
    cursor.execute("SHOW COLUMNS FROM " + table_name + ";")
    column_list = cursor.fetchall()
    for i in range(len(column_list)):
        if value_list[i] == "null":
            value_list[i] = column_list[i][0]+" IS NULL"
        elif value_list[i] == '':
            value_list[i] = 'nothing'
        elif column_list[i][1] != 'int':
            value_list[i] = column_list[i][0]+'="'+value_list[i]+'"'
        else:
            value_list[i] = column_list[i][0]+"="+value_list[i]
    for i in range(len(value_list)):
        if 'nothing' in value_list:
            value_list.remove('nothing')
        else:
            break
    if  len(value_list) == 0:
        sql = "SELECT * FROM " + table_name + ";"
    else:
        value_list = " AND ".join(value_list)
        sql = "SELECT * FROM " + table_name + " WHERE " + value_list + ";"
    try:
        cursor.execute(sql)
        table_content = cursor.fetchall()
        db.close()
        return {"table_content": table_content}
    except Exception as e:
        db.rollback()
        db.close()
        return {"status": "error", "error": str(e)}

@app.route('/delete', methods=['POST'])
def delete():
    data = eval(list(request.form.to_dict().keys())[0])
    db_name = data['db_name']
    table_name = data['table_name']
    value_list = data['value_list']
    db = connect(db_name)
    cursor = db.cursor()
    cursor.execute("SHOW COLUMNS FROM " + table_name + ";")
    column_list = cursor.fetchall()
    for i in range(len(column_list)):
        if value_list[i] == "null":
            value_list[i] = column_list[i][0]+" IS NULL"
        elif column_list[i][1] != 'int':
            value_list[i] = column_list[i][0]+'="'+value_list[i]+'"'
        else:
            value_list[i] = column_list[i][0]+"="+value_list[i]
    value_list = " AND ".join(value_list)
    sql = "DELETE FROM " + table_name + " WHERE " + value_list + ";"
    try:
        cursor.execute(sql)
        db.commit()
        db.close()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        db.close()
        return {"status": "error", "error": str(e)}

@app.route('/update', methods=['POST'])
def update():
    data = eval(list(request.form.to_dict().keys())[0])
    db_name = data['db_name']
    table_name = data['table_name']
    value_list = data['value_list']
    value_listp = data['value_listp']
    db = connect(db_name)
    cursor = db.cursor()
    cursor.execute("SHOW COLUMNS FROM " + table_name + ";")
    column_list = cursor.fetchall()
    for i in range(len(column_list)):
        if value_listp[i] == "null":
            value_listp[i] = column_list[i][0]+" IS NULL"
        elif column_list[i][1] != 'int':
            value_listp[i] = column_list[i][0]+'="'+value_listp[i]+'"'
        else:
            value_listp[i] = column_list[i][0]+"="+value_listp[i]
    value_listp = " AND ".join(value_listp)
    for i in range(len(column_list)):
        if value_list[i] == "null":
            value_list[i] = column_list[i][0]+"=NULL"
        elif value_list[i] == '':
            value_list[i] = 'nothing'
        elif column_list[i][1] != 'int':
            value_list[i] = column_list[i][0]+'="'+value_list[i]+'"'
        else:
            value_list[i] = column_list[i][0]+"="+value_list[i]
    for i in range(len(value_list)):
        if 'nothing' in value_list:
            value_list.remove('nothing')
        else:
            break
    value_list = ",".join(value_list)
    sql = "UPDATE " + table_name + " SET " + value_list+ " WHERE " + value_listp + ";"
    print(sql)
    try:
        cursor.execute(sql)
        db.commit()
        db.close()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        db.close()
        return {"status": "error", "error": str(e)}
    

if __name__ == '__main__':
    app.run(use_reloader=False)