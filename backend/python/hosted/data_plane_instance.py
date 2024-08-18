import boto3
import base64
import requests
import os
import asyncio
import logging
from botocore.exceptions import NoRegionError

logger = logging.getLogger(__name__)

def get_region():
    region = os.getenv('AWS_DEFAULT_REGION')
    if not region:
        try:
            r = requests.get('http://169.254.169.254/latest/meta-data/placement/region', timeout=2)
            if r.status_code == 200:
                region = r.text
        except:
            pass
    return region

async def create_database_instance(database_path):
    region = get_region()
    if not region:
        raise NoRegionError("No AWS region specified. Please set the AWS_DEFAULT_REGION environment variable.")

    logger.info(f"Creating instance in region: {region}")
    
    session = boto3.Session(region_name=region)
    ec2_resource = session.resource('ec2')
    ec2_client = session.client('ec2')

    app_folder = os.getenv('APPLICATION_FOLDER', '/home/ubuntu/hostedservice')
    
    # Read the user data script
    with open(os.path.join(app_folder, 'data_plane', 'data_plane_setup.sh'), 'r') as file:
        user_data_script = file.read()

    # Prepare environment variables
    env_vars = {
        'AWS_DEFAULT_REGION': region,
        'APPLICATION_ZIP_UEL': os.getenv('APPLICATION_ZIP_URL'),
        'DATABASE_PATH': database_path,
        'APPLICATION_FOLDER': '/home/ubuntu/hostedservice',
        'IMAGE_ID': os.getenv('IMAGE_ID'),
        'PUBLIC_SUBNET': os.getenv('PUBLIC_SUBNET'),
        'KEY_PAIR_NAME': os.getenv('KEY_PAIR_NAME'),
        'INSTANCE_TYPE': os.getenv('INSTANCE_TYPE'),
        'SECURITY_GROUP': os.getenv('SECURITY_GROUP'),
        'PYTHONPATH': '/home/ubuntu/hostedservice/backend/python'
    }

    # Add export commands to set environment variables
    env_exports = '\n'.join([f"export {key}='{value}'" for key, value in env_vars.items() if value])
    user_data_script = f"""#!/bin/bash
{env_exports}

{user_data_script}
"""

    # Encode the user data script in base64
    encoded_user_data = base64.b64encode(user_data_script.encode()).decode()

    logger.debug("UserData script:")
    logger.debug(user_data_script)

    try:
        # Create the EC2 instance
        instances = ec2_resource.create_instances(
            ImageId=os.getenv('IMAGE_ID'),
            InstanceType=os.getenv('INSTANCE_TYPE'),
            MinCount=1,
            MaxCount=1,
            KeyName=os.getenv('KEY_PAIR_NAME'),
            SecurityGroupIds=[os.getenv('SECURITY_GROUP')],
            SubnetId=os.getenv('PUBLIC_SUBNET'),
            UserData=encoded_user_data
        )

        instance = instances[0]
        instance_id = instance.id

        logger.info(f"Created instance with ID: {instance_id}")

        # Wait for the instance to be running
        logger.info("Waiting for instance to be running...")
        instance.wait_until_running()

        # Wait for status checks to pass
        logger.info("Waiting for instance status checks to pass...")
        waiter = ec2_client.get_waiter('instance_status_ok')
        waiter.wait(InstanceIds=[instance_id])

        # Reload the instance to get the latest information
        instance.reload()
        
        return instance_id, instance.public_ip_address
    except Exception as e:
        logger.error(f"Error creating EC2 instance: {str(e)}")
        raise

async def delete_database_instance(instance_id):
    region = get_region()
    if not region:
        raise NoRegionError("No AWS region specified. Please set the AWS_DEFAULT_REGION environment variable.")

    session = boto3.Session(region_name=region)
    ec2 = session.resource('ec2')

    instance = ec2.Instance(instance_id)
    instance.terminate()
    print(f"Terminating instance with ID: {instance_id}")
    instance.wait_until_terminated()
    print(f"Instance with ID: {instance_id} terminated")
