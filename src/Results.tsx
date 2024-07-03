import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

import Tissue1 from './assets/images/tissue-1.jpg';
import Tissue2 from './assets/images/tissue-2.jpg';
import Tissue3 from './assets/images/tissue-3.jpg';

import './Results.css';

enum Quality {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

// The numbering represents the order the events are expected to occur,
// First is the baseline, then the follow-up, and finally the conclusion.
// All event's may not be present, but when they are, the earlier event will always be present.
enum Event {
  Baseline = 'Baseline',
  FollowUp = 'FollowUp',
  Conclusion = 'Conclusion',
}

interface Result {
  patientId: string; // the client specific identifier
  scannedAt: Date; // the time at which the sample was digitally scanned
  score: number; // the score of the sample
  event: Event; // the event that the sample was taken at
  sampleQuality: Quality; // the quality of the sample
  dateOfBirth: string; // the date of birth of the patient
  tissueScan: string;
}

// please do not edit the data, unless to add further examples
const data: Result[] = [
  {
    patientId: '87gd2',
    scannedAt: new Date('2021-08-03T12:00:00Z'),
    score: 0.81,
    event: Event.FollowUp,
    sampleQuality: Quality.Low,
    dateOfBirth: '1990-01-01',
    tissueScan: Tissue1,
  },
  {
    patientId: '87gd2',
    scannedAt: new Date('2021-08-01T12:00:00Z'),
    score: 0.92,
    event: Event.Baseline,
    sampleQuality: Quality.High,
    dateOfBirth: '1990-01-01',
    tissueScan: Tissue1,
  },
  {
    patientId: '87gd2',
    scannedAt: new Date('2021-08-08T12:00:00Z'),
    score: 0.43,
    event: Event.Conclusion,
    sampleQuality: Quality.Low,
    dateOfBirth: '1990-01-01',
    tissueScan: Tissue1,
  },
  {
    patientId: 'js27h',
    scannedAt: new Date('2021-08-02T12:00:00Z'),
    score: 0.74,
    event: Event.Baseline,
    sampleQuality: Quality.Medium,
    dateOfBirth: '1993-02-12',
    tissueScan: Tissue2,
  },
  {
    patientId: '9782e',
    scannedAt: new Date('2021-08-03T12:00:00Z'),
    score: 0.25,
    event: Event.Baseline,
    sampleQuality: Quality.Medium,
    dateOfBirth: '1981-04-12',
    tissueScan: Tissue3,
  },
  {
    patientId: '9782e',
    scannedAt: new Date('2021-08-21T12:00:00Z'),
    score: 0.21,
    event: Event.FollowUp,
    sampleQuality: Quality.High,
    dateOfBirth: '1981-04-12',
    tissueScan: Tissue3,
  },
];

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getQualityValue = (quality: Quality) => {
  switch (quality) {
    case Quality.High:
      return '80%';
    case Quality.Medium:
      return '55%';
    case Quality.Low:
      return '30%';
    default:
      return 0;
  }
};

const getQualityColor = (quality: Quality) => {
  switch (quality) {
    case Quality.High:
      return '#40B0A6';
    case Quality.Medium:
      return '#FFC20A';
    case Quality.Low:
      return '#DC3220';
    default:
      return 'black';
  }
};

const groupedData = data.reduce((acc, item) => {
  if (!acc[item.patientId]) {
    acc[item.patientId] = [];
  }
  acc[item.patientId].push(item);
  return acc;
}, {} as Record<string, Result[]>);

const sortedGroupedData = Object.entries(groupedData).map(
  ([patientId, results]) => ({
    patientId,
    results: results.sort((a, b) => {
      const order = { Baseline: 0, FollowUp: 1, Conclusion: 2 };
      return order[a.event] - order[b.event];
    }),
  })
);

export default function Results() {
  const [isSwitchingId, setIsSwitchingId] = useState(false);
  const [switchedId, setSwitchedId] = useState('');

  const toggleId = (id: string) => {
    setIsSwitchingId((current) => !current);
    setSwitchedId(id);
  };

  return (
    <div className='results_container'>
      {sortedGroupedData.map((group) => (
        <div key={group.patientId} className='results'>
          <div className='header'>
            <div className='inline_block'>
              <span className='label'>PatientId:</span>
              {isSwitchingId && switchedId == group.patientId ? (
                <h3 className='text-green-500'>Copied!</h3>
              ) : (
                <h3>{group.patientId}</h3>
              )}
            </div>
            <span className='copy' onClick={() => toggleId(group.patientId)}>
              <FontAwesomeIcon icon={faCopy} size='xl' />
            </span>
          </div>
          <div className='result_wrapper'>
            {group.results.map((item, index) => (
              <div key={item.patientId + item.event} className='result'>
                <div className='result_header'>
                  <div className='event'>
                    <span className='label'>Event</span>
                    <h3>{item.event}</h3>
                  </div>
                  <div className='event_number'>{index + 1}</div>
                </div>
                <div className='scan_data'>
                  <div className='result_body'>
                    <div className='score'>
                      <span className='label'>Score</span>
                      <h1>{item.score.toFixed(2)}</h1>
                    </div>
                    <div className='quality'>
                      <div className='inline_block'>
                        <span className='label'>Sample Quality:</span>
                        <h3>{item.sampleQuality}</h3>
                      </div>
                      <div className='quality_bar'>
                        <span
                          className='quality_percent'
                          style={{
                            width: getQualityValue(item.sampleQuality),
                            backgroundColor: getQualityColor(
                              item.sampleQuality
                            ),
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div className='result_footer'>
                    <div className='scan'>
                      <img src={item.tissueScan} alt='Tissue 1' />
                      <div className='overlay'>
                        <FontAwesomeIcon icon={faExpand} size='xl' inverse />
                      </div>
                    </div>
                    <div className='date'>
                      <span className='label'>Scanned At</span>
                      <h3>{formatDate(item.scannedAt)}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
