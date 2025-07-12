import json
from flask import jsonify



def process_query(query):
    result = []
    with open('users.json', 'r') as file:
        users = json.load(file)
    
    querx = query.replace(",", "").split(" ")
    for user in users:
        if user['user_id'] != 1:
             for skill in user['skills']:
                if skill["name"] in querx:
                    if user["user_id"] not in [r['user_id'] for r in result]:
                        result.append({
                            "user_id": user['user_id'],
                            "skill": [skill]
                        })
                    else:    
                        for r in result:
                            if r['user_id'] == user['user_id']:
                                r["skill"].append(skill)
                                break
    sorted_data = sorted(
    result,
    key=lambda user: (
        -len(user['skill']),                       # More skills first
        -max(skill['level'] for skill in user['skill'])  # Higher level as tie-breaker
    )
    )             
    result = []
    for user in sorted_data:
     
        result.append(user['user_id'])    
    return result



#print (work("Python, Java, C++"))


