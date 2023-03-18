# get filter parameters and apply them to the modal
def json_filter(filters, model, query):
    for attr, value in filters.items():
        if value[0] == "!eq":
            query = query.filter(getattr(model, attr) != value[1])
        elif value[0] == "eq":
            query = query.filter(getattr(model, attr) == value[1])
        elif value[0] == "srch":
            query = query.filter(getattr(model, attr).like('%' + value[1] + '%'))
    return query
