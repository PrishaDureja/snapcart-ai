import easyocr

# initialize OCR reader
reader = easyocr.Reader(['en'], gpu=False)

def extract_text(image_path):
    """
    Extract text from an image using EasyOCR
    """

    results = reader.readtext(image_path)

    texts = []

    for bbox, text, confidence in results:
        texts.append(text)

    return texts