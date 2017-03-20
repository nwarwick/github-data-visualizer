import requests
import json

# get list of users
users = []
print "Make sure this is being run within the 'scraper' directory!"

r = int(input('Number of requests to make (60 max per IP per hour): '))
#r = 20 # number of requests to make

user_start = int(input('User ID to start at (inclusive): '))
since = user_start - 1
for i in range(0, r):
	r = requests.get('https://api.github.com/users?since={}'.format(since))
	if r.status_code is not 200:
		print r.json()['message']
		break
	j = r.json()
	for u in j:
		users.append(u['login'])
	end_user_id = u['id']
	filename = './data/users{:0>5}-{:0>5}.txt'.format(since + 1, end_user_id)
	with open(filename, 'w') as outfile:
		json.dump(j, outfile)
	since = end_user_id

print "Number of users found: " + str(len(users))
users_file = open('./data/users.csv', 'a')
for u in users:
	users_file.write("{},".format(u))
