process.env.PORT = 3000;
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_PORT = 5432;
process.env.POSTGRES_USER = 'invent_analytics_case_user';
process.env.POSTGRES_PASSWORD = '1234@Ahmet';
process.env.POSTGRES_NAME = 'library_db';
process.env.NODE_ENV = 'development';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  moduleNameMapper: {
    '^#(.*)$': '<rootDir>/src/$1'
  }
};
