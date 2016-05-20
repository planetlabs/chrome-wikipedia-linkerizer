#
# Purpose: Shim to get scene count from the API without shipping an API key
#
# Copyright 2016, Planet Labs, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from time import time
import json, requests

planetKey = "" # shh... don't distribute
apiUrl = "https://api.planet.com/v0/scenes/ortho/?count=1&intersects=POINT({}%20{})"

def lambda_handler(event, context):
    lat, lon = event['lat'], event['lon']
    starttime = time()
    req = requests.get(apiUrl.format(event['lon'], event['lat']),
                       auth=(planetKey, ''))
    return {"count": json.loads(req.content)['count'],
            "runtime": int((time() - starttime) * 1000)}
