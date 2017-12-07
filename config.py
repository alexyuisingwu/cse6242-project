class Config(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BCRYPT_HANDLE_LONG_PASSWORDS = True


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = True
