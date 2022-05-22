import sqlite3
from htmldate import find_date
from bs4 import BeautifulSoup
import requests
from google.cloud import language_v1
from googlesearch import search
from flask_cors import CORS, cross_origin
from flask import jsonify, request, Flask
from youtubesearchpython import VideosSearch
from pytube import YouTube
import moviepy.editor as mp
import os
from google.cloud import speech
from youtube_transcript_api import YouTubeTranscriptApi
from flask_sqlalchemy import SQLAlchemy
from flask.helpers import send_from_directory

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String)
    url=db.Column(db.String)
    # collection_id = db.Column(db.Integer, db.ForeignKey('collection.id'))

class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String)
    # resources = db.relationship('Resource', backref='collection')

db.create_all()

unwanted_entity_types = ['PERSON', 'LOCATION', 'ORGANIZATION', 'EVENT', 'WORK_OF_ART', 'CONSUMER_GOOD', 'PHONE_NUMBER', 'ADDRESS', 'DATE', 'NUMBER', 'PRICE']

@app.route("/")
def func():
    return jsonify({"a": "b"})

@app.route("/sites/<query>/<numResults>")
def findSites(query, numResults):
    client = language_v1.LanguageServiceClient()
 
    urls = []
    setsOfEntities = []
    titles = []
    
    for url in search(query, tld="co.in", num=10, stop=10, pause=1):

        result = requests.get(url).text
        doc = BeautifulSoup(result, 'html.parser')
        
        tags_list = ["b", "em", "i", "mark", "p", "strong", "u"]
        # tags_list = ["p"]

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
            if not str(entity.type_) in unwanted_entity_types and entity.salience >= 0.0005:
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

videos_folder = '/Users/brandonmarks/Downloads/Projects/gryphhacks2022/backend/videos'

@app.route("/videos/<query>/<numResults>")
def findVideos(query, numResults):
    client = language_v1.LanguageServiceClient()
    videos = VideosSearch(query, limit = 10).result()
    videos = videos['result']

    video_urls = []
    video_titles = []
    video_entitySets = []

    for video in videos:
        entities = []
        totalTxt = ""
        print('aaa')
        tx = YouTubeTranscriptApi.get_transcript(video['id'])
        print('bbb')
        for i in tx:
            totalTxt += i['text'] + " "

        type_ = language_v1.Document.Type.PLAIN_TEXT
        language = "en"
        document = {"content": totalTxt, "type_": type_, "language": language}
        encoding_type = language_v1.EncodingType.UTF8

        response = client.analyze_entities(request = {'document': document, 'encoding_type': encoding_type})

        for entity in response.entities:
            if not str(entity.type_) in unwanted_entity_types and entity.salience >= 0.0005:
                entity_lower = entity.name.lower()
                if not entity_lower in entities:
                    entities.append(entity_lower)

    
        video_urls.append(video['link'])
        video_titles.append(video['title'])
        video_entitySets.append(entities)

    
    results = {
        "urls": video_urls,
        "setsOfEntities": video_entitySets,
        "titles": video_titles
    }

    return results


@app.route("/resource", methods=["POST"])
def addResource():
    data = request.get_json()
    new_resource = Resource(name = data['name'], url = data['url'])
    db.session.add(new_resource)
    db.session.commit()

    return jsonify({"success": True})

@app.route("/resource/<url>", methods=["DELETE"])
def deleteResource(url):
    removed_resource = Resource.query.filter_by(url = url).first()
    db.session.delete(removed_resource)
    db.session.commit()

    return jsonify({"success": True})

@app.route("/resource", methods=["GET"])
def getResources():
    resourcesList = []
    allResources = Resource.query.all()
    for res in allResources:
        resourcesList.append({"name": res.name, "url": res.url})

    return jsonify(resourcesList)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


# my_video = YouTube('https://www.youtube.com/watch?v=7BXJIjfJCsA')
# stream = my_video.streams.first()
# stream.download()
# video_name = "YouTube video downloader  Python project  Pytube  Easy Tutorial.3gpp"
# audio_name = "YouTube video downloader  Python project  Pytube  Easy Tutorial.mp3"
# clip = mp.VideoFileClip(r"{0}".format(video_name))
# clip.audio.write_audiofile(r"{0}".format(audio_name))
# os.remove(video_name)

if __name__ == '__main__':
    app.run()


# export GOOGLE_APPLICATION_CREDENTIALS="/Users/brandonmarks/Downloads/Projects/GryphHacks2022/backend/newlive-287702-59a80a53c2a2.json"


