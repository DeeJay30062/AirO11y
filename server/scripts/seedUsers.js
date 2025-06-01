import fs from 'fs';
import path from 'path';
import axios from 'axios';
import csv from 'csv-parser';

const csvFilePath = path.join(process.cwd(), '../seed-data/users.csv'); // Replace with your actual path
const apiUrl = 'http://localhost:5050/api/auth/register'; // Adjust to match your app

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    for (const [i, user] of results.entries()) {
      try {
        const payload = {
          username: user.username,
          email: user.email,
          password: user.password,
          fullName: {
            first: user.firstName,
            middle: user.middleName || '',
            last: user.lastName,
            suffix: user.suffix || '',
          },
          dateOfBirth: user.dateOfBirth, // Make sure this is in ISO or parsable format
          loyaltyId: user.loyaltyId || '',
          status: user.status || 'Standard',
          homeAirport: user.homeAirport || '',
          tsaPrecheckNumber: user.tsaPrecheckNumber || '',
          phone: user.phone || '',
          address: {
            street: user.street || '',
            city: user.city || '',
            state: user.state || '',
            zip: user.zip || '',
            country: user.country || '',
          },
        };

        const res = await axios.post(apiUrl, payload, {
          withCredentials: true,
        });

        console.log(`✅ User ${user.username} created:`, res.data.message);
      } catch (err) {
        console.error(`❌ Failed to create ${user.username}:`, err.response?.data || err.message);
      }
    }

    console.log('Seeding complete. Go take a victory sip of coffee or something.');
  });
