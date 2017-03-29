import json
import sys

with open(sys.argv[1]) as data_file:
	data = json.load(data_file)
	
user_data = {}
coords = []

'''
{
"type":"FeatureCollection",
"features":
	[{"type":"Feature",
	"geometry":
		{"type":"Point",
		"coordinates":[37.7749295,-122.4194155]
		},
	"properties":
		{"user":"mojombo",
		"language":"Ruby"
		}
	}
	]
}
'''

output = "{\"type\":\"FeatureCollection\",\"features\":["

# Merges data points with identical coordinates
for k, v in data.items():
	for item in v:
		if type(item) is dict:
			coord = item['geometry']['coordinates']
			coords.append(coord)
			coord = str(coord)
			langs = item['properties']['language']
			if langs == None:
				langs = 'Null'
			for lang in langs.split('&'):
				if coord not in user_data.keys():
					user_data[coord] = {} 
					user_data[coord][lang] = 1
				elif lang not in user_data[coord].keys():
					user_data[coord][lang] = 1
				else:
					user_data[coord][lang] = user_data[coord][lang]+1
print len(user_data.keys())

for key,coord in user_data.items():
	print coord
	max_count = 0
	max_lang = ''
	for lang, count in coord.items():
		print 'Curr_max: '+max_lang
		print 'Checking: '+str(lang)+', with count = '+str(count)
		if (count > max_count) or (max_count == count and max_lang == 'Null') or (max_count == count and lang != 'Null'):
			max_count = count
			max_lang = lang
	new_item= '{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":'+str(key)+'},\"properties\":{\"user\":\"\",\"language\":\"'+max_lang+'\"}},'
	print new_item
	output += new_item

output += ']}'

data_file = open('data.json', 'wb')
data_file.write(output)
data_file.close



# Calculate distance between two geographic points
'''
dlon = lon2 - lon1 
dlat = lat2 - lat1 
a = (sin(dlat/2))^2 + cos(lat1) * cos(lat2) * (sin(dlon/2))^2 
c = 2 * atan2( sqrt(a), sqrt(1-a) ) 
d = R * c (where R is the radius of the Earth)
R = 6373 (km)
'''
# Cluster data points into cities/regions
# init = [[x1,y1], [x2,y2], ...]
# final = [ [[x1,y1], [xi,yi], ..], [[xj,xj], [xm,ym],..], ...]
'''https://github.com/gggritso/k-means-Geographic-Clustering/blob/master/lib/geometric.rb'''
#clusters = []
#x = sys.argv[2]
# Repeat algorithm until x clusters have been made
#while num_clusters < x:
	# Test the effect of splitting each cluster and take the one
	# that produces the lowest SSE
#	for cluster in clusters:
		#split cluster using 2-means
		#determine SSE
		#if score is lower than min score save split to min
	#apply min split	


