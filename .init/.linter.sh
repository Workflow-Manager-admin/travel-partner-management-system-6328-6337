#!/bin/bash
cd /home/kavia/workspace/code-generation/travel-partner-management-system-6328-6337/travel_partner_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

