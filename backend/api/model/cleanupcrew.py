import os
import random
import shutil

def createInitialDirs(required_dirs):
    for directory in required_dirs:
        if not os.path.exists(directory):
            os.makedirs(directory)

def generateRandomSuffix():
    num = random.random()
    return str(num).replace("0.", "", 1)

def janitor(intermediatory_dir):
    if os.path.exists(intermediatory_dir):
        try:
            shutil.rmtree(intermediatory_dir)
            print(f"Cleaned up {intermediatory_dir} for you :D")
        except Exception as e:
            print(f"Error cleaning up {intermediatory_dir}. {e}. But no problem, proceed as usual :)")