DATABASE_URL = #your url here
import psycopg2
import jwt
import os
import json


filename = "users.json"


def get_db():
    return psycopg2.connect(DATABASE_URL)

token = jwt.encode({"role": "admin"}, "ulala", algorithm="HS256")
print(token)
def create_users_json():
    con= get_db()
    curr = con.cursor()
    print(curr.execute(
        ''' SELECT
        up.user_id,
        ARRAY_AGG(DISTINCT so.name) AS skills_offered_names,
        ARRAY_AGG(DISTINCT sw.name) AS skills_wanted_names
    FROM
        user_profiles up
    LEFT JOIN LATERAL unnest(up.skills_offered) AS offered_skill_id ON TRUE
    LEFT JOIN skills so ON so.id = offered_skill_id
    LEFT JOIN LATERAL unnest(up.skills_wanted) AS wanted_skill_id ON TRUE
    LEFT JOIN skills sw ON sw.id = wanted_skill_id
    GROUP BY
        up.user_id '''
    ))
    rows = curr.fetchall()
    userx = {}
    urx = []


    for row in rows:
       
        user_id = row[0]
        skills_offered = row[1] if row[1] else []
        skills_wanted = row[2] if row[2] else []
        
        userx = {
            "user_id": user_id,
            "skills_offered": skills_offered,
            "skills_wanted": skills_wanted
        }
        urx.append(userx)
        # Create new file with the first entry
    with open(filename, 'w') as file:
        json.dump(urx, file, indent=4)

    curr.close()
    print("Database connection closed.")

    con.close()

