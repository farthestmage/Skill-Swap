from flask import Flask, request, jsonify
import json
import os
from process_query import process_query
app = Flask(__name__)
FILE_NAME = 'output.json'




@app.route('/append-json', methods=['GET'])
def append_json_get():
    json_string = request.args.get('data')

    if not json_string:
        return jsonify({"error": "Missing 'data' query parameter"}), 400

    try:
        # Parse JSON string
        data = json.loads(json_string)

        if isinstance(data, dict):
            data = [data]

        required_keys = {"user_id", "skills_learnt", "skills_want_to_learn"}
        for user in data:
            if not required_keys.issubset(user.keys()):
                return jsonify({"error": "Missing required keys in one of the users"}), 400

        # Load existing data
        if os.path.exists(FILE_NAME):
            with open(FILE_NAME, 'r') as f:
                try:
                    existing_data = json.load(f)
                    if not isinstance(existing_data, list):
                        existing_data = []
                except json.JSONDecodeError:
                    existing_data = []
        else:
            existing_data = []

        existing_data.extend(data)

        with open(FILE_NAME, 'w') as f:
            json.dump(existing_data, f, indent=4)

        return jsonify({"message": "Data added via GET", "users_added": data})

    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON"}), 400
@app.route('/query', methods=['GET'])
def query():
    try:
        # Ensure JSON body exists
        query_text = request.args.get('query')
        # Ensure 'query' key is present
        if not query_text:
            return jsonify({"error": "Missing 'query' parameter"}), 400


        #query_text = data['query']

        # Ensure it's a non-empty string
        if not isinstance(query_text, str) or not query_text.strip():
            return jsonify({"error": "'query' must be a non-empty string"}), 400

        # Call the function
        result = process_query(query_text)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Something went wrong", "details": str(e)}), 500
@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        user_id = request.args.get('user_id', default=1, type=int)
        if not isinstance(user_id, int) or user_id < 1:
            return jsonify({"error": "Invalid user_id"}), 400

        from recommendation import recommendation
        result = recommendation(user_id)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Something went wrong", "details": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
    