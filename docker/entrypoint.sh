#!/bin/sh

echo "Waiting for blockchain RPC..."
until nc -z blockchain 8545; do
  sleep 2
done

echo "Blockchain is up. Deploying contracts..."

npx hardhat compile
npx hardhat run scripts/deploy.js --network docker
