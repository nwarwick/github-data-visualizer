import csv
import subprocess

users = 10
with open('data/users.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile)
	reader = next(reader)
	for u in range(users):
		p = subprocess.Popen(["node", "scraper.js", reader[u]])