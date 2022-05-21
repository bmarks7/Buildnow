from htmldate import find_date
from bs4 import BeautifulSoup
import requests
from google.cloud import language_v1
from googlesearch import search
from flask import Flask
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app)

@app.route("/")
def func():
    return jsonify({"a": "b"})

@app.route("/sites/<query>/<numResults>")
def findSites(query, numResults):
    client = language_v1.LanguageServiceClient()
 
    # query = "Geeksforgeeks"
    urls = []
    setsOfEntities = []
    titles = []
    
    for url in search(query, tld="co.in", num=int(numResults), stop=int(numResults), pause=1):

        result = requests.get(url).text
        doc = BeautifulSoup(result, 'html.parser')
        
        # tags_list = ["b", "em", "i", "mark", "p", "strong", "u"]
        tags_list = ["p"]

        entities = []
        text = ""

        for tag in tags_list:
            for piece in doc.find_all(tag):
                if piece.string != None:
                    text += (piece.string + " ")

        type_ = language_v1.Document.Type.PLAIN_TEXT
        language = "en"
        document = {"content": text, "type_": type_, "language": language}
        encoding_type = language_v1.EncodingType.UTF8

        response = client.analyze_entities(request = {'document': document, 'encoding_type': encoding_type})

        for entity in response.entities:
            entity_lower = entity.name.lower()
            if not entity_lower in entities:
                entities.append(entity_lower)

        urls.append(url)
        setsOfEntities.append(entities)
        titles.append(doc.title.string)

    results = {
        "urls": urls,
        "setsOfEntities": setsOfEntities,
        "titles": titles
    }

    return results


if __name__ == '__main__':
    app.run()


# @app.route("/videos/<query>/<numResults>")
# def findVideos(query, numResults):


# export GOOGLE_APPLICATION_CREDENTIALS="/Users/brandonmarks/Downloads/Projects/GryphHacks2022/backend/newlive-287702-59a80a53c2a2.json"


