import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';
import unzip from 'unzip-stream';
import parse from 'csv-parse';
import es from 'event-stream';
import camelcase from 'camelcase';

const ZIP_PATH = path.join(process.cwd(), 'linkedin.zip');
const BLACKLIST_FILES = [
  'Contacts.csv',
  'Registration.csv',
  'Connections.csv',
  'Invitations.csv',
  'messages.csv',
  'Rich Media.csv',
  'Videos.csv',
  'Ad_Targeting.csv',
];

function extractInfo() {
  const result: Record<string, any> = {};

  const csvTransformer = new Transform({
    objectMode: true,
    transform: (entry, e, cb) => {
      const filePath = entry.path;

      if (BLACKLIST_FILES.includes(filePath)) {
        entry.autodrain();
        cb();
      } else {
        const formatLine = (csv: string) => {
          entry.pause();
          parse(
            csv.toString(),
            {
              columns: header => header.map(camelcase),
            },
            (error, records) => {
              if (error) {
                entry.destroy(error);
              } else {
                const key = camelcase(filePath.split('.')[0]);

                result[key] = key === 'profile' ? records[0] : records;
              }
            },
          );
          entry.resume();
        };

        entry.pipe(es.mapSync(formatLine)).on('close', cb);
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
          skills: result.skills.map(({ name }: any) => name),
          education: result.education,
          languages: result.languages,
          experiences: result.positions,
          emails: result.emailAddresses.map(({ emailAdress }: any) => emailAdress),
        }),
      );
  });
}

export { extractInfo };
