import requests
import json
import time

# get list of users
users = []
print "Make sure this is being run within the 'scraper' directory!"
print "and PULL master before running this!"


r = int(input('Number of requests to make (60 max per IP per hour): '))
#r = 20 # number of requests to make

print ""
print "Make sure to pick a range of user IDs that have not been looked up yet. Check text files in data too see which ones are done. 30 users are looked up for every request."
print "Ex. user_start = 1000, requests = 60 (1800 users). IDs found = 1000 - ~2799 (some ids may be missing)"
user_start = int(input('User ID to start at (inclusive): '))
end_user_id = user_start
since = user_start - 1
for i in range(0, r):
	r = requests.get('https://api.github.com/users?since={}'.format(since))
	if r.status_code is not 200:
		reset_time = r.headers['X-RateLimit-Reset']
		print "Reset Time: " + time.strftime("%Z - %Y/%m/%d, %H:%M:%S", time.localtime(float(reset_time)))
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

print "Checked user ids: " + str(user_start) + " - " + str(end_user_id)
print "Number of users found: " + str(len(users))
users_file = open('./data/users.csv', 'a')
for u in users:
	users_file.write("{},".format(u))
