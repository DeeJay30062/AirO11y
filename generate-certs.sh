#!/bin/bash

mkdir -p ./certs

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout ./certs/airO11y.key \
  -out ./certs/airO11y.crt \
  -days 365 \
  -subj "/CN=localhost"

echo "✅ Self-signed certificate created at ./certs/"

