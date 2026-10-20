from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    database_url: str = "mysql+pymysql://root:root@localhost:3306/authdb"
    secret_key: str = "change-me-in-production"
    session_expire_hours: int = 24 * 7
    frontend_origin: str = "http://localhost:3000"
    secure_cookies: bool = False
    cookie_name: str = "session"


settings = Settings()
