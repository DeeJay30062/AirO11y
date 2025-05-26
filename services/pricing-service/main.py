from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def hello():
    return "Pricing service is alive. Emotionally? Debatable. updated"

@app.route("/price", methods=["POST"])
def price():
    data = request.get_json()

    required_fields = ["baseCost", "seatClass", "daysUntilFlight", "seatsRemaining", "totalSeats"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        baseCost = float(data["baseCost"])
        seatClass = data["seatClass"]
        daysUntilFlight = int(data["daysUntilFlight"])
        seatsRemaining = int(data["seatsRemaining"])
        totalSeats = int(data["totalSeats"])
    except Exception as e:
        return jsonify({"error": "Invalid input types"}), 400

    if totalSeats <= 0:
        return jsonify({"error": "Total seats must be greater than 0"}), 400

    # Time modifier
    if daysUntilFlight > 30:
        timeMod = 1.0
    elif daysUntilFlight > 14:
        timeMod = 1.1
    elif daysUntilFlight >= 7:
        timeMod = 1.2
    else:
        timeMod = 1.4

    # Class modifier
    classMod = {
        "coach": 1.0,
        "economyPlus": 1.25,
        "first": 1.5
    }.get(seatClass, 1.0)

    # Demand modifier based on percentage available
    occupancyRate = seatsRemaining / totalSeats
    if occupancyRate > 0.6:
        demandMod = 1.0
    elif occupancyRate > 0.3:
        demandMod = 1.15
    else:
        demandMod = 1.3

    finalCost = round(baseCost * timeMod * classMod * demandMod, 2)

    response = {
        "finalCost": finalCost,
        "modifiers": {
            "time": timeMod,
            "class": classMod,
            "demand": demandMod
        }
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)