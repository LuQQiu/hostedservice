import boto3
import base64
import requests
import os
import asyncio


def get_region():
    try:
        response = requests.get('http://169.254.169.254/latest/meta-data/placement/region')
        response.raise_for_status()  # Raise an error for bad status codes
        return response.text
    except requests.RequestException as e:
        print(f"Error retrieving region: {e}")
        return None

async def create_database_instance():
    region = get_region()
    if region:
        ec2 = boto3.resource('ec2', region_name=region)
        # Now you can use ec2 to interact with the resource
    else:
        print("Could not retrieve region information.")

    app_folder = os.getenv('APPLICATION_FOLDER')
    # Read the user data script
    with open(app_folder + '/data_plane/data_plane_setup.sh', 'r') as file:
        user_data_script = file.read()

    # Encode the user data script in base64
    encoded_user_data = base64.b64encode(user_data_script.encode()).decode()
    image_id = os.getenv('IMAGE_ID')
    instance_type = os.getenv('INSTANCE_TYPE')
    key_name = os.getenv('KEY_PAIR_NAME')
    security_group_ids = [os.getenv('SECURITY_GROUP')]
    subnet_id = os.getenv('PUBLIC_SUBNET')

    # Create the EC2 instance
    instance = ec2.create_instances(
        ImageId=image_id,
        InstanceType=instance_type,
        MinCount=1,
        MaxCount=1,
        KeyName=key_name,
        SecurityGroupIds=security_group_ids,
        SubnetId=subnet_id,
        UserData=encoded_user_data
    )

    instance_id = instance[0].id

    # Wait for the instance to be running and status checks to pass
    instance[0].wait_until_running()
    waiter = boto3.client('ec2').get_waiter('instance_status_ok')
    waiter.wait(InstanceIds=[instance_id])

    # Reload the instance to get the latest information
    instance[0].reload()
    
    return instance_id, instance[0].public_ip_address

# Main function to call the async function
def main():
    instance_id, public_ip = asyncio.run(create_database_instance())
    print(f"Instance ID: {instance_id}, Public IP: {public_ip}")

if __name__ == "__main__":
    main()