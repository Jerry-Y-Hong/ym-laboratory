"""
Structured Logging Facility for Platform Layer with File Logging Support
"""
import logging
import sys
import os

LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")

def setup_logger(name: str = "PLATFORM", level: str = None) -> logging.Logger:
    if level is None:
        level = os.environ.get("LOG_LEVEL", "INFO").upper()

    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(getattr(logging, level, logging.INFO))
        
        # Stream Handler (stdout)
        stream_handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            '[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

        # File Handler for Errors (platform_error.log)
        try:
            os.makedirs(LOGS_DIR, exist_ok=True)
            error_log_file = os.path.join(LOGS_DIR, "platform_error.log")
            file_handler = logging.FileHandler(error_log_file, encoding='utf-8')
            file_handler.setLevel(logging.WARNING)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            sys.stderr.write(f"Failed to setup file log handler: {e}\n")

    return logger

platform_logger = setup_logger()
