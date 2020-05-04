import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';
import unzip from 'unzip-stream';
import parse from 'csv-parse';
import es from 'event-stream';
import camelcase from 'camelcase';

const ZIP_PATH = path.join(process.cwd(), 'linkedin.zip');
const TARGET_FILES = [
  'Profile.csv',
  'Skills.csv',
  'Education.csv',
  'Languages.csv',
  'Positions.csv',
  'Email Addresses.csv',
];

function extractInfo() {
  const result: Record<string, any> = {};

  const csvTransformer = new Transform({
    objectMode: true,
    transform: (entry, e, cb) => {
      const filePath = entry.path;

      if (TARGET_FILES.includes(filePath)) {
        const formatLine = (csv: string, cb: (e: Error, data: any) => void) => {
          parse(
            csv.toString(),
            {
              columns: header => header.map(camelcase),
            },
            (error, records) => {
              const key = camelcase(filePath.split('.')[0]);

              if (error) {
                console.error(`error while reading file ${key}:`, error);
                entry.destroy(error);
              } else {
                result[key] = key === 'profile' ? records[0] : records;
              }

              cb(null, null);
            },
          );
        };

        entry.pipe(es.map(formatLine)).on('close', cb);
      } else {
        entry.autodrain();
        cb(null, null);
      }
    },
  });

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(ZIP_PATH)) {
      throw new Error(
        'linkedin.zip is not at the root of the project, please follow gatsby-plugin-linkedin instruction',
      );
    }

    fs.createReadStream(ZIP_PATH)
      .pipe(unzip.Parse())
      .pipe(csvTransformer)
      .on('error', reject)
      .on('finish', () =>
        resolve({
          ...result.profile,
          skills: result.skills ? result.skills.map(({ name }: any) => name) : [],
          education: result.education,
          languages: result.languages,
          experiences: result.positions,
          emails: result.emailAddresses.map(({ emailAdress }: any) => emailAdress),
        }),
      );
  });
}

export { extractInfo };
