from flask import Flask, request, jsonify
from flask_restx import Api, Namespace as NameSpace, Resource
from flask_cors import CORS
import openai

openai.api_key = "Enter your openai api key here"

app = Flask(__name__)

CORS(
    app, 
    resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
    supports_credentials=True
    )

# Mount the API under /api to match your Vite proxy
api = Api(app, version="1.0", title="Chat API", prefix="/api")

chat_ns = NameSpace("", description="Chat Application API")
api.add_namespace(chat_ns)  # /api/*

@chat_ns.route("/chatbot")
class ChatBotResource(Resource):
    def get(self):
        return {"message": "Welcome to the ChatBot API!"}
    
    def post(self):
        data = request.get_json()
        user_input = data.get('message')
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages = [
                    {
                        "role" : "system",
                        "content" : (
                            " Hi, I am a chabot. i am powered by Openai"
                        )
                    },
                    { "role" : "user", "content" : user_input }
                ], 
                max_tokens=16384,
                temperature=0,
            )
            
            bot_response = response.choices[0].message['content']
            return { "message": bot_response}
        except Exception as e:
            pass
        return {"message": "ChatBot response"}

if __name__ == "__main__":

    app.run(host='0.0.0.0', port=5000, debug=True)