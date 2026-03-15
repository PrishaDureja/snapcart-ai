import random
import csv

rows = []

for _ in range(5000):

    mrp = random.randint(1000, 20000)

    discount = random.uniform(5, 90)

    price = int(mrp * (1 - discount / 100))

    rating = round(random.uniform(1.5, 5.0), 1)

    reviews = random.randint(1, 20000)

    fraud = 0

    # Fraud patterns
    if discount > 80 and rating < 3:
        fraud = 1

    if reviews < 20 and discount > 70:
        fraud = 1

    rows.append([
        price,
        mrp,
        round(discount, 2),
        rating,
        reviews,
        fraud
    ])

with open("data/dataset.csv", "w", newline="") as f:

    writer = csv.writer(f)

    writer.writerow([
        "price",
        "mrp",
        "discount_percent",
        "rating",
        "review_count",
        "fraud"
    ])

    writer.writerows(rows)

print("Dataset generated successfully")