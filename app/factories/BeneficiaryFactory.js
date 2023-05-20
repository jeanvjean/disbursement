const fs = require('fs');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-v2");
const config = require('../../config')
const { s3 } = require('../utils/multer')
const toJson = require('csvtojson');
const axios = require('axios');

class BeneficiaryFactory {
    constructor({ config, errors, akupayDisbursementService, currentUser, database, queries, helper }) {
        this.config = config;
        this.errors = errors;
        this.database = database;
        this.queries = queries;
        this.helper = helper;
        this.currentUser = currentUser;
        this.akupayDisbursementService = akupayDisbursementService;
    }
    async add({ body }) {
        try {
            const response = await this.akupayDisbursementService.createBeneficiary(body);

            return response;
        } catch (err) {
            throw new this.errors.InternalServer('Something went wrong while creating beneficiary');
        }
    }
    
    async upload({ file, body }) {
        try {
            const programme = await this.akupayDisbursementService.getProgramme(body.programme_id);
            const metadata = {
                user_id: this.currentUser.id,
                programme_id: body.programme_id
            }
            const response = await this.akupayDisbursementService.uploadBeneficiary({ file, metadata });
            aws.config.setPromisesDependency();
            aws.config.update({
                endpoint: new aws.Endpoint(config.get('bucket.digitalocean.url')),
                accessKeyId: config.get('bucket.digitalocean.access_key'),
                secretAccessKey: config.get('bucket.digitalocean.secret_key'),
                region: config.get('bucket.digitalocean.region'),
            });
            var params = {
                ACL: 'public-read',
                Bucket: config.get('bucket.digitalocean.name'),
                Body: fs.createReadStream(file.path),
                Key: `beneficiary/${file.originalname}`
            };
            const s3 = new aws.S3();
            s3.upload(params, async (err, data) => {
                if (err) {
                  console.log('Error occured while trying to upload to S3 bucket', err);
                }
                await this.database.query.oneOrNone(this.queries.beneficiaryUploadLog.create, {
                    user_id: this.currentUser.id,
                    file_path: data.Location,
                    type: 'beneficiary_upload',
                    file_name: file.originalname,
                    programme_id: body.programme_id,
                    programme_name: programme.name
                })
              });
            return response;
        } catch (err) {
            throw new this.errors.InternalServer(err.message || err);
        }
    }

    async beneficiaryAccountUploadNow({ file, body }) {
        try {
            const programme = await this.akupayDisbursementService.getProgramme(body.programme_id);
    
            const { email, first_name, last_name, id } = this.currentUser;

            const metadata = {
                email,
                first_name,
                last_name,
                id,
                programme_id: body.programme_id
            }
            const beneficiaries = await toJson().fromFile(file.path);

            for(let b of beneficiaries) {
                const acn = await this.padLeft(b.bank_account_number, 10, '');
                const payload = {
                    results: [
                        {
                            from: `234${b.phone_number}`,
                            to: "2348101480067",
                            text: `${acn} ${b.bank_name}`,
                        }
                    ]
                }
                await axios.post(`${process.env.AKUPAY_DISBURSEMENT_SERVICE_BASE_URI}sms/webhook/infobip`, payload);
            }

            // const response = await this.akupayDisbursementService.beneficiaryAccountUpload({ beneficiaries, metadata });
            
            await this.database.query.oneOrNone(this.queries.beneficiaryUploadLog.create, {
                user_id: id,
                file_path: file.location,
                type: 'account_upload',
                file_name: file.originalname,
                programme_id: body.programme_id,
                programme_name: programme.name
            });

            return 'done';
        } catch (err) {
            throw new this.errors.InternalServer(err.message || err);
        }
    }

    padLeft = (nr, n, str)=>{
        return Array(n-String(nr).length+1).join(str||'0')+nr;
    };

//come back to this
    async beneficiaryAccountUpload({ file, body }) {
        return;
        try {
            const programme = await this.akupayDisbursementService.getProgramme(body.programme_id);
    
            const { email, first_name, last_name, id } = this.currentUser;

            const metadata = {
                email,
                first_name,
                last_name,
                id,
                programme_id: body.programme_id
            }
            
            const response = await this.akupayDisbursementService.beneficiaryAccountUpload({ file, metadata });
            

            await this.database.query.oneOrNone(this.queries.beneficiaryUploadLog.create, {
                user_id: id,
                file_path: file.location,
                type: 'account_upload',
                file_name: file.originalname,
                programme_id: body.programme_id,
                programme_name: programme.name
            })

            return response;
        } catch (err) {
            throw new this.errors.InternalServer(err.message || err);
        }
    }

    async getUploadLogs({ query }) {

        try {
            const { page = 1, limit = 20, type = '', s = '', period = '', start_date, end_date } = query;
            let dbValues = {};
        
            const { offset } = this.helper.getLimitOffset({ page, limit });
            let dbQuery = this.queries.beneficiaryUploadLog.allWithJoin
            let dbQuery2 = this.queries.beneficiaryUploadLog.getLogsTotal;
        
            if(s && s !== '' && s !== 'undefined') {
                dbQuery += this.queries.beneficiaryUploadLog.search;
                dbQuery2 += this.queries.beneficiaryUploadLog.search;
                dbValues.s = `${s}:*`;
            }
            if(type && type !== '' && type !== 'undefined') {
                dbQuery += this.queries.beneficiaryUploadLog.filterByType
                dbQuery2 += this.queries.beneficiaryUploadLog.filterByType;
                dbValues.type = type
            }
            if(start_date && start_date !== 'undefined') {
                dbQuery = dbQuery + this.queries.base.attachDateRange(start_date, end_date, 'bul.');
                dbQuery2 = dbQuery2 + this.queries.base.attachDateRange(start_date, end_date, 'bul.');
            }

            if (period && period !== '') {
                dbQuery += this.queries.base.interval(period, 'bul.');
            }
            dbQuery = dbQuery + this.queries.base.order('created_at', 'DESC', 'bul.');
            dbQuery = dbQuery + this.queries.base.paginate({ limit, offset });
    
            const [ data, total ] = await this.database.query.tx(t => {
                const q1 = t.any(dbQuery, dbValues);
                const q2 = t.oneOrNone(dbQuery2, dbValues);
                return t.batch([ q1, q2 ])
            });
        
            data.length ? data[0].over_all_count = total.over_all_count : data
        
            return data
        } catch (err) {
            throw new this.errors.InternalServer(err.message || err);
        
        }
    }
}

module.exports = BeneficiaryFactory;
