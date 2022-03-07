# Generated by Django 3.0.1 on 2022-03-07 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InfoKospi',
            fields=[
                ('code_number', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('company_name', models.CharField(max_length=30)),
                ('sector', models.CharField(max_length=20)),
                ('main_product', models.CharField(max_length=30)),
                ('listing_date', models.CharField(max_length=20)),
                ('settlement_month', models.CharField(max_length=20)),
                ('representative', models.CharField(max_length=20)),
                ('homepage', models.CharField(max_length=50)),
                ('location', models.CharField(max_length=20)),
            ],
            options={
                'ordering': ['code_number'],
            },
        ),
    ]
