from flask import Flask
from flask_restx import Api, Namespace as NameSpace

app_ns = NameSpace("chatapp", description="Chat Application API")

@app_ns.route("/chatbot")
class ChatBotResource:
    def get(self):
        return {"message": "Welcome to the ChatBot API!"}
    
    def post(self):
        return {"message": "ChatBot response"}

if __name__ == "__main__":
    app = Flask(__name__)
    app.run(host='0.0.0.0', port=5000, debug=True)