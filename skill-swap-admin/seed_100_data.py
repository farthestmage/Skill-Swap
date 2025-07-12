import random
import string
from db import get_db  # Make sure this returns a psycopg2 connection

USER_COUNT = 100
SKILL_COUNT = 50

# Subjects and skill templates
subjects = [
    "Python programming", "public speaking", "digital marketing", "graphic design", "guitar", "yoga",
    "data analysis", "chess", "web development", "video editing", "SEO", "painting", "creative writing",
    "app development", "photography", "cybersecurity", "AI", "networking", "cloud computing", "Excel",
    "trading", "copywriting", "UI/UX", "singing", "baking", "blockchain", "fitness", "math tutoring",
    "science projects", "foreign languages"
]

skill_templates = [
    "I will teach you {} from beginner to expert.",
    "Offering help with {} assignments and projects.",
    "1-on-1 coaching for {}.",
    "Join my workshop to learn {}.",
    "I have 5+ years of experience in {}.",
    "Unlock secrets to {} fast and easy!",
    "Learn {} the illegal way ;)",
    "I guarantee you will win every {} competition.",
    "I am a master of {}, learn from the best.",
    "Spam: Make $1000/day with this secret {} trick!!!"
]

def randstr(n=8):
    return ''.join(random.choices(string.ascii_lowercase, k=n))

def random_bio():
    return " ".join(random.choices([
        "Passionate", "experienced", "in", "helping", "others", "learn", "and", "grow",
        "with", "hands-on", "practical", "projects", "and", "real-world", "skills."
    ], k=15))

def random_location():
    return random.choice(["Delhi", "Mumbai", "Chennai", "Bangalore", "Hyderabad", "Pune", "Chandigarh", "Kolkata"])

def random_availability():
    return random.choice(["WEEKDAYS", "WEEKEND", "BOTH"])

def random_skill_desc(subject):
    template = random.choice(skill_templates)
    return template.format(subject)

def seed_all():
    conn = get_db()
    cur = conn.cursor()

    # Seed skills
    print("Seeding skills table...")
    skill_ids = []
    skill_names = set()
    for i in range(SKILL_COUNT):
        subject = random.choice(subjects)
        skill_name = (subject.split()[0] + randstr(3)).capitalize()
        while skill_name in skill_names:
            skill_name = (subject.split()[0] + randstr(4)).capitalize()
        skill_names.add(skill_name)
        desc = random_skill_desc(subject)
        ai_status = 'approved' if all(x not in desc.lower() for x in ["spam", "illegal", "guarantee"]) else 'rejected'
        ai_reason = 'OK' if ai_status == 'approved' else 'Spam or inappropriate'
        reviewed = random.choice([True, False])
        cur.execute("""
            INSERT INTO skills (name, description, ai_moderation_status, ai_moderation_reason, reviewed_by_admin)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """, (skill_name, desc, ai_status, ai_reason, reviewed))
        skill_ids.append(cur.fetchone()[0])

    # Seed users and profiles
    print("Seeding users and user_profiles...")
    user_ids = []
    for i in range(USER_COUNT):
        name = f"user_{i+1}"
        email = f"{name}@example.com"
        password = randstr(12)
        is_banned = False
        ban_reason = None

        # Users table
        cur.execute("""
            INSERT INTO users (email, name, password, is_banned, ban_reason)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """, (email, name, password, is_banned, ban_reason))
        user_id = cur.fetchone()[0]
        user_ids.append(user_id)

        # Profiles table
        skills_offered = random.sample(skill_ids, random.randint(1, 4))
        skills_wanted = random.sample(skill_ids, random.randint(1, 3))
        cur.execute("""
            INSERT INTO user_profiles (
                user_id, profile_picture, bio, location, availability, is_visible, skills_offered, skills_wanted
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_id,
            f"https://picsum.photos/seed/{name}/200",
            random_bio(),
            random_location(),
            random_availability(),
            True,
            skills_offered,
            skills_wanted
        ))

    conn.commit()
    cur.close()
    conn.close()
    print(f"Seeded {USER_COUNT} users, profiles, and {SKILL_COUNT} skills.")

if __name__ == "__main__":
    seed_all()
