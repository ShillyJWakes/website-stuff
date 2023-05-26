import multiprocessing

errorlog = '/var/www/website-stuff/backend/gunicorn_error.log'
loglevel = 'info'
bind = '192.168.1.203:5000'
workers = multiprocessing.cpu_count() * 2 + 1
user = 'sis-portal'
group = 'www-data'
