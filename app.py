import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
import pandas as pd
import psycopg2
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#### config file
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgres://postgres:oklahoma@localhost:5432/Superstore'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


Base = automap_base()
Base.prepare(db.engine, reflect=True)
engine = create_engine('postgres://postgres:oklahoma@localhost:5432/Superstore')
conn = engine.connect()
session = Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/stateprofit")
def stateprofit():
    stateprofit = pd.read_sql('select "State",sum("Profit") as PROFIT from orders group by 1',engine)
    stateprofit = stateprofit.to_dict()
    return jsonify(stateprofit)


@app.route("/shipprofit")
def shipprofit():
    shipprofit = pd.read_sql('select left(cast("Ship Date" as text),7) as SHIP_YYYY_MM, sum("Profit") as PROFIT from orders group by 1',engine)
    shipprofit = shipprofit.to_dict()
    return jsonify(shipprofit)


@app.route("/categoryprofit")
def categoryprofit():
    categoryprofit = pd.read_sql('select "Sub-Category",sum("Profit") as PROFIT from orders group by 1',engine)
    categoryprofit = categoryprofit.to_dict()
    return jsonify(categoryprofit)

if __name__ == "__main__":
    app.run(debug=True)