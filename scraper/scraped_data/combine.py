import json
import argparse

parser = argparse.ArgumentParser(description='Combine geojson files.')
parser.add_argument('files', type=argparse.FileType('r'), nargs='+')

args = parser.parse_args()
features = []
for f in args.files:
	features.extend(json.load(f)['features'])

output = {}
output['type'] = "FeatureCollection"
output['features'] = features

with open('combined.json', 'w') as outfile:
	json.dump(output, outfile)