CREATE DATABASE insurancedb;
CREATE USER insurance_user WITH PASSWORD 'securepassword';
GRANT ALL PRIVILEGES ON DATABASE insurancedb TO insurance_user;
ALTER USER insurance_user WITH SUPERUSER;

