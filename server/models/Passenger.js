import mongoose from "mongoose";


//name, dob, sex, loyaltyId, tsaNumber

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true},
  dob: { type: Date, required: true},
  sex: { type: String, enum: ['M', 'F'] },
  loyaltyId: { type: String, required: true, unique: true},
  tsaNumber: {
    type: String,
    validate: {
      validator: (v) => /^[A-Z0-9]{8,10}$/.test(v),
      message: props => `${props.value} is not a valid TSA Number!`,
    },
  }
});

const Passenger = mongoose.model('Passenger',passengerSchema);

export default Passenger;

