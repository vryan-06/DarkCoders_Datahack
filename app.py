import traceback
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sys
import os
import json
import pickle
import numpy as np

import pandas as pd
from sklearn.preprocessing import StandardScaler


app = Flask(__name__)
CORS(app)
curr_loc = os.path.dirname(os.path.realpath(__file__))

with open("config.json", "r") as c:
    params = json.load(c)['params']


model = pickle.load(open(str(curr_loc)+'/ada_reg_xg1.pkl', 'rb'))
print("Model has been loaded")

mean = [2.01344575e+03, 6.02636521e+04, 2.29749528e+01, 1.62325660e+03,
       1.13124335e+02, 5.29178886e+00, 2.02346041e-01, 3.59237537e-02,
       6.41495601e-02, 7.99120235e-02, 1.05938416e-01, 9.64076246e-02,
       1.08137830e-01, 7.11143695e-02, 1.09604106e-01, 9.31085044e-02,
       1.35630499e-01, 1.00073314e-01, 1.06304985e-02, 5.40322581e-01,
       2.19941349e-03, 4.46847507e-01, 7.13709677e-01]

std = [3.13655317e+00, 1.29997668e+05, 5.27023100e+00, 5.85343287e+02,
       5.27055317e+01, 8.13588786e-01, 4.55620241e-01, 1.86100074e-01,
       2.45019171e-01, 2.71156951e-01, 3.07758783e-01, 2.95149444e-01,
       3.10554407e-01, 2.57015789e-01, 3.12395656e-01, 2.90584430e-01,
       3.42395775e-01, 3.00097727e-01, 1.02554820e-01, 4.98371437e-01,
       4.68463026e-02, 4.97166785e-01, 4.52026740e-01]

var = [9.83796579e+00, 1.68993936e+10, 2.77753348e+01, 3.42626764e+05,
       2.77787307e+03, 6.61926712e-01, 2.07589804e-01, 3.46332376e-02,
       6.00343941e-02, 7.35260920e-02, 9.47154683e-02, 8.71131945e-02,
       9.64440397e-02, 6.60571160e-02, 9.75910456e-02, 8.44393108e-02,
       1.17234866e-01, 9.00586457e-02, 1.05174910e-02, 2.48374089e-01,
       2.19457607e-03, 2.47174813e-01, 2.04328174e-01]  

n_samples_seen=2728

@app.route("/")
def index():
    return render_template("login.html", params=params)

#  ['Year', 'Kilometers_Driven', 'Mileage', 'Engine', 'Power', 'Seats',
    # 'Owner_Type_Encoded', 'Location_Ahmedabad',
    # 'Location_Bangalore', 'Location_Chennai', 'Location_Coimbatore',
    # 'Location_Delhi', 'Location_Hyderabad', 'Location_Jaipur',
    # 'Location_Kochi', 'Location_Kolkata', 'Location_Mumbai',
    # 'Location_Pune', 'Fuel_Type_CNG', 'Fuel_Type_Diesel', 'Fuel_Type_LPG',
    # 'Fuel_Type_Petrol', 'Transmission_Manual']

@app.route("/predict", methods=["POST"])
def predict():
    if(model):
        try:
            reqData = dict(request.form)
            #  reqData = {'Year': 2015, 'Kilometers_Driven': 45000, 'Mileage': '18.2 kmpl', 'Engine': '1968 CC',
            #            'Power': '141 bhp', 'Seats': 5, 'Owner_Type': 'First Owner', 'Location': 'Mumbai',
            #            'Fuel_Type': 'Diesel', 'Transmission': 'Manual'}

            if reqData['Owner_Type']=="First":
                val = 0
            elif reqData['Owner_Type']=="Second":
                val = 1
            elif reqData['Owner_Type']=="Third":
                val = 2
            else:
                val = 3
                
            reqData["Owner_Type"] = val

            loc_type = reqData['Location']
            loc_types = ['Location_Ahmedabad', 'Location_Bangalore', 'Location_Chennai', 
                        'Location_Coimbatore', 'Location_Delhi', 'Location_Hyderabad', 
                        'Location_Jaipur', 'Location_Kochi', 'Location_Kolkata', 
                        'Location_Mumbai', 'Location_Pune']
            for i, loc in enumerate(loc_types):
                if loc_type == loc.split('_')[-1]:
                    reqData[loc] = 1
                else:
                    reqData[loc] = 0
            del reqData['Location']

            fuel_type = reqData['Fuel_Type']
            fuel_types = ['Fuel_Type_CNG', 'Fuel_Type_Diesel', 'Fuel_Type_LPG', 'Fuel_Type_Petrol']
            for i, fuel in enumerate(fuel_types):
                if fuel_type == fuel.split('_')[-1]:
                    reqData[fuel] = 1
                else:
                    reqData[fuel] = 0
            del reqData['Fuel_Type']

            if reqData["Transmission"] == "Manual":
                reqData["Transmission_Manual"] = 1
            else:
                reqData["Transmission_Manual"] = 0
            del reqData['Transmission']

            df = pd.DataFrame([reqData])
            df = np.array(df)
            df = df.astype(np.float64)
            scaler = StandardScaler()
            scaler.mean_ = mean
            scaler.scale_ = std
            scaler.var_ = var
            scaler.n_samples_seen_=n_samples_seen
            
            inp = scaler.transform(df)
            prediction = model.predict(inp)
            print(prediction)
            return jsonify({"predicted" : str(prediction[0])})
        except:
            return jsonify({"error" : traceback.format_exc()})
    else:
        print("Model error")

if __name__ == "__main__":
    app.run(debug=True)