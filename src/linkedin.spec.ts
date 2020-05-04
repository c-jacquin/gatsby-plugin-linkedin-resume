import { extractInfo } from './linkedin';
import { expect } from 'chai';
import 'mocha';

describe('linkedin.extractInfo', () => {
  it('should return all expected fields', async () => {
    const data = await extractInfo();

    expect(data['firstName']).to.be.a('string');
    expect(data['lastName']).to.be.a('string');
    expect(data['maidenName']).to.be.a('string');
    expect(data['address']).to.be.a('string');
    expect(data['birthDate']).to.be.a('string');
    expect(data['headline']).to.be.a('string');
    expect(data['summary']).to.be.a('string');
    expect(data['industry']).to.be.a('string');
    expect(data['zipCode']).to.be.a('string');
    expect(data['geoLocation']).to.be.a('string');
    expect(data['twitterHandles']).to.be.a('string');
    expect(data['websites']).to.be.a('string');
    expect(data['instantMessengers']).to.be.a('string');

    expect(data['education']).to.be.an('array');
    expect(data['skills']).to.be.an('array');
    expect(data['languages']).to.be.an('array');
    expect(data['experiences']).to.be.an('array');
    expect(data['emails']).to.be.an('array');
  });
});
