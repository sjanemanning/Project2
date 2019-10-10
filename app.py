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
    stateprofit = pd.read_sql('select o."State",abbr."abbreviation", sum("Profit") as PROFIT from orders as o inner join (select distinct "state", "abbreviation" from state_names_and_abbreviations) abbr on o."State" = abbr."state" group by 1,2 order by "abbreviation"',engine)
    stateprofit = stateprofit.to_dict(orient='list')
    return jsonify(stateprofit)


@app.route("/shipprofit")
def shipprofit():
    shipprofit = pd.read_sql('select left(cast("Ship Date" as text),7) as SHIP_YYYY_MM, sum("Profit") as PROFIT from orders group by 1 order by left(cast("Ship Date" as text),7)',engine)
    shipprofit = shipprofit.values.tolist()
    return jsonify(shipprofit)


@app.route("/categoryprofit")
def categoryprofit():
    categoryprofit = pd.read_sql('select "Sub-Category",sum("Profit") as PROFIT from orders group by 1',engine)
    categoryprofit = categoryprofit.values.tolist()
    return jsonify(categoryprofit)


@app.route("/rawdata")
def rawdata():
    return render_template("data.html")

@app.route("/stategraph")
def stategraph():
    return render_template("stategraph.html")

@app.route("/linegraph")
def linegraph():
    return render_template("linegraph.html")

@app.route("/bargraph")
def bargraph():
    return render_template("bargraph.html")

@app.route("/tableau")
def tableau():
    return render_template("tableau.html")

if __name__ == "__main__":
    app.run(debug=True)