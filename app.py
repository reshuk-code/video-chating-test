# app.py
from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

rooms = {}

@app.route('/')
def index():
    return render_template('video_chat.html')

@app.route('/create_room', methods=['POST'])
def create_room():
    code = request.form.get('code')
    if code in rooms:
        return "Room code already exists!", 400
    rooms[code] = []
    return redirect(url_for('video_chat', room_code=code))

@app.route('/video_chat/<room_code>')
def video_chat(room_code):
    if room_code not in rooms:
        return "Room does not exist!", 404
    return render_template('video_chat.html', room_code=room_code)

@socketio.on('message')
def handle_message(data):
    # Handle messages if needed for signaling
    pass

if __name__ == '__main__':
    socketio.run(app, debug=True)
