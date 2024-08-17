sudo apt update
sudo apt install -y python3 python3-pip unzip

pip3 install fastapi uvicorn lancedb

# Install application dependencies
pip3 install -r ${APPLICATION_FOLDER}/requirements.txt

# Move service file to correct location
mv ${APPLICATION_FOLDER}/data_plane/data_plane.service /etc/systemd/system/data_plane.service

systemctl daemon-reload
systemctl start data_plane
systemctl enable data_plane
