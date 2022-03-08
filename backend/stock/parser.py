from drf_yasg import openapi

from .serializers import InfoKospiSerializer

rest_framework_openapi_field_mapping = {
    "EmailField": openapi.TYPE_STRING,
    "ImageField": openapi.TYPE_STRING,
    "ListField": openapi.TYPE_ARRAY,
    "CharField": openapi.TYPE_STRING,
    "TextField": openapi.TYPE_STRING,
    "BooleanField": openapi.TYPE_BOOLEAN,
    "FloatField": openapi.TYPE_NUMBER,
    "DateTimeField": openapi.TYPE_STRING,
    "IntegerField": openapi.TYPE_INTEGER,
    "SerializerMethodField": openapi.TYPE_STRING
}

def parse_rest_framework_field(field):
    rest_framework_field_type = field.split("(")[0]
    openapi_field_type = rest_framework_openapi_field_mapping[rest_framework_field_type]
    if "help_text=" in field:
        field_description = field.split("help_text='")[-1].split("'")[0]
    else:
        field_description = None
    return openapi.Schema(type=openapi_field_type, description=field_description)

def parse_serializer(name):
    properties = {}
    
    if name == "infokospi":
        serializer = InfoKospiSerializer()
        
    for k,v in serializer.get_fields().items():
        if v.__module__ == "rest_framework.fields":
            properties[k] = parse_rest_framework_field(str(v))
        elif v.__module__.startswith("apps."):
            serializer = str(v).strip().split("(")[0]
            exec(f"from {v.__module__} import {serializer}")
            eval_serializer = eval(f"{serializer}()")
            properties[k] = openapi.Schema(type=openapi.TYPE_OBJECT, properties=parse_serializer(eval_serializer))
        else:
            pass
    return properties

def get_serializer(name, description):
    """ Needs to return openapi.Schema() """
    properties = parse_serializer(name)
    return_openapi_schema = openapi.Schema(type=openapi.TYPE_OBJECT, properties=properties, description=description)
    return return_openapi_schema