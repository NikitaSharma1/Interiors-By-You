import csv
import os
import datetime
import calendar

from celery.schedules import crontab
from jinja2 import Template
from weasyprint import HTML

from mail_config import send_email
from app import celery, cache
from model import Posts, Follow, User

@celery.on_after_finalize.connect
def setup_intervalTASK(sender, **kwargs):
    sender.add_periodic_task(
        # Send a remainder at 5:30pm IST of every day
        #crontab(minute=40, hour=20),
        5,
        daily_rem(), name="Daily reminder"
    
    )

    sender.add_periodic_task(
       # Send the monthly report at 5:30pm IST of every month
        #crontab(minute=40, hour=20, day_of_month=18),
        5,
        monthly_report(), name="Monthly Report"
    )

@celery.task
@cache.memoize(timeout=15)
def export(username):
    filepath = 'static/download/'+username+'data.csv'

    # Check if folder is not present then create one
    if not os.path.exists('static/download/'):
        os.mkdir(path='static/download/')
    with open(file=filepath, mode='w') as file:
        writer = csv.writer(file)
        writer.writerow(["Username", "Post", "Date"])
        for post in Posts.query.filter_by(username=username).all():
            writer.writerow([post.title, post.description, post.timestamp])
    
    
    with open(r"templates/exportmaildata.html") as file:
        msg_template = Template(file.read())

    email = User.query.filter_by(username=username).first().email
    send_email(to=email, subject="CSV file for blog data ",
                msg=msg_template.render(), attachment=filepath)
   
    return 'sucess'

@celery.task
def daily_rem():
    print("Sending the daily reminder")
    with open(r"templates/daily.html") as file:
        msg_template = Template(file.read())
    date = datetime.datetime.now().day

    for user in User.query.all():
        post = Posts.query.filter_by(username=user.username).order_by(Posts.post_id.desc()).first()
        if post is not None:
            day = post.timestamp.split("_")[1]
            if day == str(date):
                continue
        send_email(to=user.email, subject="Daily reminder",
                msg=msg_template.render(username=user.username))

    return 'sucess'

@celery.task
def monthly_report():
    print("Sending the monthly report")
    month = datetime.datetime.now().month
    month_name = calendar.month_name[int(month)]
    for user in User.query.all():
        no_post = 0
        tot_follower = Follow.query.filter_by(followed=user.username).count()
        tot_following = Follow.query.filter_by(follower=user.username).count()
        tot_post = Posts.query.filter_by(username=user.username).count()
        posts = Posts.query.filter_by(username=user.username).all()
        for post in posts:
            
            if post.timestamp.split('_')[0] == str(month):
                no_post += 1
    

        filepath = f"static/monthly_reports/monthly_report_{user.username}_{month}.pdf"
        if not os.path.exists('static/monthly_reports/'):
            os.mkdir(path='static/monthly_reports/')

        with open(r"templates/monthly.html") as file:
            msg_template = Template(file.read())
        with open(r"templates/monthlypdf.html") as file:
            pdf_template = Template(file.read())
        
        pdf_html = HTML(string=pdf_template.render(tot_posts = tot_post, no_posts=no_post, tot_follower=tot_follower,
                                                   tot_following=tot_following, month=month_name))
        pdf_html.write_pdf(target=filepath)

        send_email(to=user.email, subject="Monthly report",
                    msg=msg_template.render(username=user.username), attachment=filepath)

    return 'success'