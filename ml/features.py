import re


def extract_price(text_list):

    candidates = []

    for text in text_list:

        text_upper = text.upper()

        # Ignore irrelevant financial text
        if "EMI" in text_upper or "UPTO" in text_upper or "CASHBACK" in text_upper:
            continue

        # Look for price indicators
        if "₹" in text or "*" in text or "<" in text:

            matches = re.findall(r'\d{1,3}(?:,\d{3})+', text)

            for m in matches:

                value = int(m.replace(",", ""))

                # realistic ecommerce price
                if 500 < value < 200000:
                    candidates.append(value)

    if not candidates:
        return None

    # choose the most common candidate or lowest reasonable price
    return min(candidates)


def extract_mrp(text_list):

    for text in text_list:

        if "MRP" in text.upper():

            match = re.search(r'\d{1,3}(?:,\d{3})+', text)

            if match:

                mrp = int(match.group().replace(",", ""))

                return mrp

    return None


def extract_rating(text_list):

    for text in text_list:

        match = re.search(r'\b([1-5]\.\d)\b', text)

        if match:

            rating = float(match.group(1))

            if 1 <= rating <= 5:
                return rating

    return None


def extract_review_count(text_list):

    for text in text_list:

        match = re.search(r'\((\d{1,3}(?:,\d{3})+)\)', text)

        if match:

            return int(match.group(1).replace(",", ""))

    return None


def fix_mrp(price, mrp):

    if not price or not mrp:
        return mrp

    # Case 1: OCR added extra leading digit
    # 214990 instead of 14990
    if mrp > price * 10:

        mrp_str = str(mrp)

        # remove first digit
        mrp = int(mrp_str[1:])

    # Case 2: still unrealistic
    if mrp > price * 5:

        mrp = int(str(mrp)[:-1])

    # Round to nearest 10
    mrp = round(mrp, -1)

    return mrp


def extract_features(text_list):

    price = extract_price(text_list)
    mrp = extract_mrp(text_list)
    rating = extract_rating(text_list)
    reviews = extract_review_count(text_list)

    mrp = fix_mrp(price, mrp)

    discount_percent = None

    if price and mrp:

        discount_percent = round((mrp - price) / mrp * 100, 2)

    return {
        "price": price,
        "mrp": mrp,
        "discount_percent": discount_percent,
        "rating": rating,
        "review_count": reviews
    }