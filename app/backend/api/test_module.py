def test_function(serializer_data):
    s = f"{serializer_data['fetch_type']} -"
    product_list = serializer_data['product_list'].split(",")

    for product in product_list:
        s += f" {product}"

    return s