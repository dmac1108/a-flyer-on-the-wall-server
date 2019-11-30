module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Flyer_Admin:sticky@localhost/flyer',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://Flyer_Admin:sticky@localhost/flyer-test',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://dmac1108-a-flyer-on-the-wall.now.sh',
    JWT_SECRET: process.env.JWT_SECRET || '$ervingItU9toyou'
}