from __future__ import absolute_import
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'JRstock.settings')
app = Celery('JRstock')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
   'add-daystock-everyday' : {
      'task': 'stock.tasks.add_day_stocks',
      'schedule' : crontab(minute=0, hour=4, day_of_week='2-6'),
   },
}


@app.task(bind=True)
def debug_task(self):
   print('Request: {0!r}'.format(self.request))