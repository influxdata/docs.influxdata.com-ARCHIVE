#!/usr/bin/env python3

import time
import random
import sys
import datetime
import time as time_
import argparse
from influxdb import InfluxDBClient


gstart_time = 0
gend_time = 0
ginterval = 0
gsilent = False
ghostname = "localhost"
gport = "8086"

def str2bool(v):
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

#Parse command line arguments
argParser = argparse.ArgumentParser(description = 'Prime and start pages_db for influxdb/kapacitor demo.')
argParser.add_argument("--silent", type=str2bool, metavar='',help='Do not print excess records to console')
argParser.add_argument("--hostname", metavar='',help='Hostname of target influxdb')
argParser.add_argument("--port", metavar='', help='Port of target influxdb')
subparsers = argParser.add_subparsers(help='sub-commmand prime', dest='command')
parser_prime = subparsers.add_parser('prime', description = 'Prime the influxdb with datapoints in the past.')
parser_run = subparsers.add_parser('run', description = 'Start the generator to write datapoints ever 15s continuously. Exit with CTRL+C')
parser_prime.add_argument('--start', metavar='', help='start time of the dataset, point in the past, e.g. 1d (ago), 12h (ago), etc.')
parser_prime.add_argument('--end', metavar='', help='end time of the dataset, point in the past or 0d (now), 1h (ago), etc.')
parser_prime.add_argument('--step', metavar='', help='interval between datapoints. e.g. 5s, 1m, 10m, 100ms')

args = argParser.parse_args()

if hasattr(args, 'hostname'):
    ghostnamae = args.hostname

if hasattr(args, 'port'):
    gport = args.port

if hasattr(args, 'silent'):
    gsilent = args.silent

database_name = "pages"
client = InfluxDBClient("localhost","8086")
client.create_database(database_name)
print("Created database ", database_name)

### A class for a simple datapoint
class simpleDP:
    def __init__(self, measurement, tags, fields):
        self.measurement = measurement
        self.tags = tags
        self.fields = fields

    def toJson(self):
        json = []
        json.append({'measurement': self.measurement,
                     'tags': self.tags,
                     'fields': self.fields })
        return json;

    def toLineWithTime(self, time):
        if time == -1:
            time = int(time_.time() * 1000)
        line = self.measurement
        for tag in self.tags:
            line = line + "," + tag + "=" + self.tags[tag]

        line = line + " "
        for i,field in enumerate(self.fields):
            if( i == 0):
                line = line + field + "=" + str(self.fields[field])
            else:
                line = line + "," + field + "=" + str(self.fields[field])

        line = line + " " + str(time * 1000000)
        return line

    def toJsonWithTime(self, time):
        json = []
        if time == -1:
            time = int(time_.time() * 1000)
        json.append({'measurement': self.measurement,
                     'tags': self.tags,
                     'fields': self.fields,
                     'time': time * 1000000})
        return json

    def walk_integer(self, field_name, max_val, min_val, max_change, min_change):
        change = random.randint(min_change, max_change);
        self.fields[field_name] = self.fields[field_name] + change
        if self.fields[field_name] > max_val:
            self.fields[field_name] = max_val
        elif self.fields[field_name] < min_val:
            self.fields[field_name] = min_val


testDPs = [ simpleDP('errors', {'page': 'page-01'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-01'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-02'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-02'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-03'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-03'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-04'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-04'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-05'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-05'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-06'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-06'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-07'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-07'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-08'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-08'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-09'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-09'}, {'value': random.randint(100,900)}),
            simpleDP('errors', {'page': 'page-10'},{'value': random.randint(0,10)}),
            simpleDP('views', {'page': 'page-10'}, {'value': random.randint(100,900)})]

#Prime the database - all args should be int milliseconds e.g. 1525953716980
def prime_db(start_time, end_time, step):
    current_time = start_time
    points = []
    while current_time < end_time:
        for dp in testDPs:
            if dp.measurement == 'errors':
                dp.walk_integer('value', 10, 0, 3, -3)
            else:
                dp.walk_integer('value', 1000, 1, 100, -100)
            if not gsilent:
                print(dp.toLineWithTime(current_time))
            points.append(dp.toLineWithTime(current_time))
        client.write_points(points, database=database_name, protocol='line', batch_size=1000)
        if not gsilent:
            sys.stdout.flush()
        del points[:]
        current_time = current_time + step

def run_live():
    points = []
    while True:
        time.sleep(15)
        for dp in testDPs:
            if dp.measurement == 'errors':
                dp.walk_integer('value', 10, 0, 3, -3)
            else:
                dp.walk_integer('value', 1000, 1, 100, -100)
            if not gsilent:
                print(dp.toJsonWithTime(-1))
                print(dp.toLineWithTime(-1))
            points.append(dp.toLineWithTime(-1))
        client.write_points(points,database=database_name,protocol='line')
        sys.stdout.flush()
        del points[:]

milliseconds_per_unit = {"s": 1000, "m": 60000, "h": 3600000, "d": 86400000, 'w': 604800000}

def convert_to_milliseconds(t):
    return int(t[:-1]) * milliseconds_per_unit[t[-1]]

def prime():
    if args.start[-2:] != "ms":
        gstart_time = convert_to_milliseconds(args.start)
    else:
        gstart_time = args.start[:-2]

    if args.end[-2:] != "ms":
        gend_time = convert_to_milliseconds(args.end)
    else:
        gend_time = args.end[:-2]

    if args.step[-2:] != "ms":
        ginterval = convert_to_milliseconds(args.step)
    else:
        ginterval = args.step[:-2]

    now = int(time_.time()) * 1000
    # if gend_time is 0 then now
    gstart_time = now - gstart_time
    gend_time = now - gend_time

    prime_db(gstart_time, gend_time, ginterval)

def run():
    run_live()

if args.command == 'prime':
    print("starting prime")
    prime()
else:
    print("starting run")
    run()
