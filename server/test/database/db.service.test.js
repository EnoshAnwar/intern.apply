const expect = require('chai').expect;
const mysql = require('mysql2');

const db = require('../../database/db.service');


describe('db.service.js', () => {

    describe('ContactMessage', () => {

        beforeEach(() => {
            db.conn.query('DROP TABLE IF EXISTS contactMessage', (err, res) => { });
            db.conn.query(`CREATE TABLE contactMessage (
            id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL,
            title VARCHAR(45) NOT NULL,
            message VARCHAR(300) NOT NULL,
            PRIMARY KEY (id))`);
            db.conn.query(`INSERT INTO contactMessage (id, email, title, message) VALUES 
            (1, 'dima@gmail.com', 'test title', 'test body'),
            (2, 'ben@gmail.com', 'second title', 'second body'),
            (3, 'what@is.this', 'third title', 'third body')`);
        });
        console.log("Testint Running. ");
        describe('getAllContactMessages', () => {

            it('should return 3 contact message records', (done) => {
                db.getAllContactMessages((err, res, fields) => {
                    expect(res).to.have.lengthOf(3);
                    done();
                });
            });

            it('should return the correct first record', (done) => {
                db.getAllContactMessages((err, res, fields) => {
                    let firstRecord = res[0];
                    expect(firstRecord.id).to.equal(1);
                    expect(firstRecord.email).to.equal('dima@gmail.com');
                    expect(firstRecord.title).to.equal('test title');
                    expect(firstRecord.message).to.equal('test body');
                    done();
                });
            });

        });

        describe('addNewContactMessage', () => {

            it('should create a new contact message', (done) => {
                db.addNewContactMessage({ id: 4, email: 'test@email.com', title: 'test title 4', message: 'test body 4' }, (err, res, fields) => { });
                db.getAllContactMessages((err, res, fields) => {
                    expect(res).to.have.lengthOf(4);
                    done();
                });
            });

            it('should not create a new contact message with an undefined email', (done) => {
                db.addNewContactMessage({ id: 4, email: undefined, title: 'test title 4', message: 'test body 4' }, (err, res, fields) => { });
                db.getAllContactMessages((err, res, fields) => {
                    expect(res).to.have.lengthOf(3);
                    done();
                });
            });

            it('should not create a new contact message with an already existing id', (done) => {
                db.addNewContactMessage({ id: 3, email: 'test@email.com', title: 'test title 4', message: 'test body 4' }, (err, res, fields) => { });
                db.getAllContactMessages((err, res, fields) => {
                    expect(res).to.have.lengthOf(3);
                    done();
                });
            });
        });
    });

    describe('GetJobs', () => {

        beforeEach(() => {
            db.conn.query('DROP TABLE IF EXISTS job', (err, res) => { });
            db.conn.query(`CREATE TABLE job (
                id INT NOT NULL AUTO_INCREMENT,
                organization VARCHAR(45) NOT NULL,
                title VARCHAR(100) NOT NULL,
                location VARCHAR(45),
                description VARCHAR(2000),
                PRIMARY KEY (id))`
            );
            db.conn.query(`INSERT INTO job (id, organization, title, location) VALUES 
                (1, 'Facebook', 'test title', 'winnipeg'),
                (2, 'google', 'second title', 'vancouver'),
                (3, 'CityOFWinnipeg', 'third title', 'location')`);
        });

        describe('getAllJobs', () => {

            it('should return 3 jobs records', (done) => {
                db.getAllJobs((err, res, fields) => {
                    expect(res).to.have.lengthOf(3);
                    done();
                });
            });

            it('should return the correct first record', (done) => {
                db.getAllJobs((err, res, fields) => {
                    let firstRecord = res[0];
                    expect(firstRecord.id).to.equal(1);
                    expect(firstRecord.organization).to.equal('Facebook');
                    expect(firstRecord.title).to.equal('test title');
                    expect(firstRecord.location).to.equal('winnipeg');
                    done();
                });
            });
        });
    });

    describe('GetFilteredJobs', () => {

        beforeEach(() => {
            db.conn.query('DROP TABLE IF EXISTS job', (err, res) => { });
            db.conn.query(`CREATE TABLE job (
                id INT NOT NULL AUTO_INCREMENT,
                organization VARCHAR(45) NOT NULL,
                title VARCHAR(100) NOT NULL,
                location VARCHAR(45),
                description VARCHAR(2000),
                PRIMARY KEY (id))`
            );
            db.conn.query(`INSERT INTO job (id, organization, title, location) VALUES 
                (1, 'Facebook', 'Software Engineer', 'winnipeg'),
                (2, 'google', 'Software Developer', 'vancouver'),
                (3, 'CityOFWinnipeg', 'Junior Dev', 'location'),
                (4, 'CityOFWinnipeg', 'Soft Dev', 'location')`);
        });

        describe('getFilteredJobs', () => {

            it('should return 3 jobs records', (done) => {
                db.getFilteredJobs("Soft",(err, res, fields) => {
                    
                    expect(res).to.have.lengthOf(3);
                    done();
                });
            });

            it('should return the correct first record', (done) => {
                db.getFilteredJobs("Soft",(err, res, fields) => {
                    let firstRecord = res[0];
                    expect(firstRecord.id).to.equal(1);
                    expect(firstRecord.organization).to.equal('Facebook');
                    expect(firstRecord.title).to.equal('Software Engineer');
                    expect(firstRecord.location).to.equal('winnipeg');
                    done();
                });
            });

            it('should return nothing', (done) => {
                db.getFilteredJobs("Random Text",(err, res, fields) => {
                    expect(res).to.have.lengthOf(0);
                    done();
                });
            });
        });
    });
});