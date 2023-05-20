/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { sendEMail ,generateCode, base64EncodeFile, getFileSize } = require('./mail');

const { BadRequest } = require('../tools/errors');
const FlaggedApproveWorker = require('../queues/workers/flaggedApprove/export');
const CSVFileParser = require('./CSVFileParser');
const database = require('./database');


const exportFlaggedApprove = async({
    dbQuery,
    user
}) => {
    try {
        const headers = [
            'id',
            'user_id',
            'account_number',
            'account_name',
            'bank_name',
            'transaction_status',
            'transaction_id',
            'amount',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'user_type',
            'deactivate',
            'deactivate_at',
            'created_at',
            'updated_at',
            'deleted_at',
            ];

        const data = await database.query.any(dbQuery);
        const csvPath = path.resolve(__dirname, '../../storage/flaggedApprove');
        const spaceKeyPath = 'exports/flaggedApprove';
        const fileName = `flagged-approve-${generateCode()}.csv`;
        const filePath = path.resolve(__dirname, `${csvPath}/${fileName}`);
        
        const fileParser = new CSVFileParser(
          null,
          filePath,
          fileName
      );
      await fileParser.setHeader(headers);
      const dataArray = Array.isArray(data) ? data : [data];
      const fileStream = fileParser.createFileStream()
      dataArray.forEach(async(row) => {
        fileStream.writeStream(row);
      });
      fileParser.end()
        const file = {
          fileName : fileStream.fileName,
          filePath: fileStream.filePath,
          bucketUrl: await fileParser.getSpaceUploadPath(spaceKeyPath)
        };

        await FlaggedApproveWorker.sendExportedFlaggedApprove({
          file,
          user
      });
        return 'done';
    } catch (err) {
        throw BadRequest(err);
    }
};

const sendExportedFlaggedApprove = async({ file, user }) => {
    try {
        const base64Content = await base64EncodeFile(file.filePath);
        const fileSize = getFileSize(file.filePath);

        const templatePath = '../../views/emails/flagged-approve-export.ejs'
      
        let mailPayload = {};
        if (base64Content !== '') {
            if (fileSize >= 20) {
                mailPayload = {
                    to: 'joseph.mbassey2@gmail.com',// user.email || 'akudevops@gmail.com',
                    from: config.get('notification.email.from_mail'),
                    // bcc: [ 'akudevops@gmail.com '],
                    subject: 'Flagged Approve Data Download',
                    filePath: templatePath,
                    payload: {
                        user,
                        file
                    },
                    attachment: false
                };

                await sendEMail({
                    ...mailPayload
                });
                fs.unlink(file.filePath, err => {
                  if (err) {
                        return err;
                  }
                });
                return 'done';
            }
        }

        if (base64Content !== '') {
            mailPayload = {
                to: 'joseph.mbassey2@gmail.com',// user.email || 'akudevops@gmail.com',
                from: config.get('notification.email.from_mail'),
                subject: 'Flagged Approve Data Download',
                // bcc: [ 'akudevops@gmail.com' ],
                filePath: templatePath,
                payload: {
                    user,
                    file
                },
                attachment: true,
                fileName: file.fileName,
                fileType: 'text/csv',
                content: base64Content
            };

            await sendEMail({
                ...mailPayload
            });
            fs.unlink(file.filePath, err => {
              if (err) {
                  return err;
              }
          });
        }


        return 'done';
    } catch (err) {
        throw BadRequest({
            err
        });
    }
};


module.exports = {
    exportFlaggedApprove,
    sendExportedFlaggedApprove,
};
