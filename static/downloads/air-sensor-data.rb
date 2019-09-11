#! /usr/bin/ruby
require "optparse"
require "net/http"
require"openssl"
require "uri"

# CLI Options
options = {
  protocol: "http",
  host: "localhost",
  port: "8086",
  interval: 5
}

OptionParser.new do |opt|
  opt.banner = "Usage: air-sensor-data.rb [OPTIONS]"

  opt.on("-d","--database DATABASE","The database to write data to. REQUIRED.") do |database|
    options[:database] = database
  end

  opt.on("-h","--host host","Your InfluxDB host. Defaults to 'localhost'") do |host|
    options[:host] = host
  end

  opt.on("-p","--port port","Your InfluxDB port. Defaults to '8086'") do |port|
    options[:port] = port
  end

  opt.on("-i","--interval interval",Integer,"The interval (in seconds) at which to write data. Defaults to '5'.") do |interval|
    options[:interval] = interval
  end

  opt.on("-s","--tls", "Sends data over HTTPS.") do |tls|
    options[:protocol] = "https"
  end

  opt.on("--help","Displays this help information.") do
    puts opt
    exit
  end
end.parse!

unless options[:database]
  $stderr.puts "\nError: you must specify a database. Use the '--help' flag for more info.\n\n"
  exit 1
end

# Global Variables
$protocol = options[:protocol]
$host     = options[:host]
$port     = options[:port]
$database = options[:database]
$interval = options[:interval]

# Seed Data
seeds = [
  {id: 100, t: 71.2, h: 35.1, c: 0.5, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.02},
  {id: 101, t: 71.8, h: 34.9, c: 0.5, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.02},
  {id: 102, t: 72.0, h: 34.9, c: 0.5, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.02},
  {id: 103, t: 71.3, h: 35.2, c: 0.4, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.02},
  {id: 200, t: 73.6, h: 35.8, c: 0.5, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.05},
  {id: 201, t: 74.0, h: 35.2, c: 0.5, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.02},
  {id: 202, t: 75.3, h: 35.7, c: 0.5, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.02},
  {id: 203, t: 74.8, h: 35.9, c: 0.4, t_inc: -0.05..0.05, h_inc: -0.05..0.05, c_inc: -0.02..0.02},
]

def increment_data(data={})
  data[:t] += rand(data[:t_inc])
  data[:h] += rand(data[:h_inc])
  data[:c] += rand(data[:c_inc])

  # Avoid negative humidity and co
  if data[:h] < 0
    data[:h] = 0
  end
  if data[:c] < 0
    data[:c] = 0
  end

  return data
end

def line_protocol_batch(point_data=[])
  batch = []
  point_data.each do |v|
    batch << "airSensors,sensor_id=TLM0#{v[:id]} temperature=#{v[:t]},humidity=#{v[:h]},co=#{v[:c]}"
  end
  return batch.join("\n")
end

def send_data(batch)
  uri = URI.parse("#{$protocol}://#{$host}:#{$port}/write?db=#{URI::encode($database)}")
  request = Net::HTTP::Post.new(uri)
  request.body = "#{batch}"

  req_options = {
    use_ssl: uri.scheme == "https",
    ssl_version: :SSLv23
  }

  response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
    http.request(request)
  end
end

def send_batches(dataset=[], interval=$interval)
  dataset.map! { |seed| increment_data(seed) }
  send_data(line_protocol_batch(dataset))
  sleep interval
  send_batches(dataset,interval)
end

begin
  puts "Sending data to #{$protocol}://#{$host}:#{$port}..."
  puts "  (ctrl-c to kill the data stream)"
  send_batches(seeds)
rescue Interrupt
  puts "\nStopping data stream..."
end
