const START_DATE = '2000-01-01';
const TIME_ZONE = 'Asia/Tokyo'; // replace with your desired timezone string. see: https://402.ecma-international.org/8.0/#sec-time-zone-names
const SCOPE = 'email personal dailemail personal daily heartrate workout tag session spo2y'; // Space separated array. choices: email personal daily heartrate workout tag session spo2   

const DAILY_SLEEP_CONTRIBUTORS = [
  'total_sleep',
  'efficiency',
  'restfulness',
  'rem_sleep',
  'deep_sleep',
  'latency',
  'timing'
];

const SLEEP_DATA_INDEX = 'bedtime_start';
const SLEEP_DATA = [
  'bedtime_end',
  'day',
  'period',
  'sleep_algorithm_version',
  'type',
  'time_in_bed',
  'latency',
  'total_sleep_duration',
  'light_sleep_duration',
  'deep_sleep_duration',
  'rem_sleep_duration',
  'awake_time',
  'efficiency',
  'average_breath',
  'average_heart_rate',
  'average_hrv',
  'lowest_heart_rate'
];
const SLEEP_DATA_DATETIME = [
  'bedtime_start',
  'bedtime_end',
];