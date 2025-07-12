import csv
import io

def skills_to_csv(skills):
    if not skills:
        return ""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=skills[0].keys())
    writer.writeheader()
    for row in skills:
        writer.writerow(row)
    return output.getvalue()
