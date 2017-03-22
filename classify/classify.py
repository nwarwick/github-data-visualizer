import json
import sys

with open(sys.argv[1]) as data_file:
	data = json.load(data_file)
	
coord_data = {}

for k, v in data.items():
	for item in v:
		if type(item) is dict:
			coord = str(item['geometry']['coordinates'])
			langs = item['properties']['language']
			if langs == None:
				langs = ''
			for lang in langs.split('&'):
				if coord not in coord_data.keys():
					coord_data[coord] = {} 
					coord_data[coord][lang] = 1
				elif lang not in coord_data[coord].keys():
					coord_data[coord][lang] = 1
				else:
					coord_data[coord][lang] = coord_data[coord][lang]+1

print coord_data

