import os
import sys

from dotenv import load_dotenv, find_dotenv
from cleanupcrew import createInitialDirs, janitor
from docs_processing import processDoc
from image_processing import processImage
from JSONtoHTML import JSONtoHTML


load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL")
GEMINI_API_KEY = os.getenv("GEMINI")


def main():
    BASE_DIR = os.path.dirname(__file__)

    uploads_dir = os.path.join(BASE_DIR, "uploads")
    intermediatory_dir = os.path.join(BASE_DIR, "intermediate")
    output_dir = os.path.join(BASE_DIR, "output")
    
    janitor(output_dir)

    if not uploads_dir:
        print(f"The following prerequisite folder is not present or cannot be created: {uploads_dir}")
        return

    required_dirs = [intermediatory_dir, output_dir]
    createInitialDirs(required_dirs)

    files = [f for f in os.listdir(uploads_dir) if os.path.isfile(os.path.join(uploads_dir, f))]

    for file in files:
        _, extension = os.path.splitext(file)
        extension = extension.lower()
        if (extension == ".pdf" or extension == ".docx" or extension == ".ppt"):
            processDoc(uploads_dir, file, intermediatory_dir, MISTRAL_API_KEY)

        elif(extension == ".png" or extension == ".jpg" or extension == ".jpeg"):
            processImage(uploads_dir, file, intermediatory_dir, GEMINI_API_KEY)

        else:
            print(f"The following file has unsupported type: {file}")

    # JSONtoHTML(intermediatory_dir, output_dir, GEMINI_API_KEY)
    JSONtoHTML(intermediatory_dir, output_dir, GEMINI_API_KEY, sys.argv[1])

    janitor(intermediatory_dir)
    janitor(uploads_dir)

if __name__ == '__main__':
    main()