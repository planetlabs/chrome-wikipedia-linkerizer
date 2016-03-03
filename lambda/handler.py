import json, requests

planetKey = "" # shh... don't distribute
apiUrl = "https://api.planet.com/v0/scenes/ortho/?count=1&intersects=POINT({}%20{})"

def lambda_handler(event, context):
    lat, lon = event['lat'], event['lon']
    req = requests.get(apiUrl.format(event['lon'], event['lat']),
                       auth=(planetKey, ''))
    return {"count": json.loads(req.content)['count']}
    return '{"count": ' + str(json.loads(req.content)['count']) + '}'
